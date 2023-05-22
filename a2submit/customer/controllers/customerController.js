/**
 * THis is the controller for customer endpoints
 * It connects with mysql database
 */
const  { primaryDb, replicaDb } = require('../dbconnect/db');
const validator = require('validator');

/**
 * Add a customer to the system (the system will allow self-registration). 
 * This endpoint is called to create the newly registered customer in the system.
 * A unique numeric ID is generated for the new customer, and the customer is added to the Customer data table on MySql (the numeric ID is the primary key).
 * @param {*} req request body
 * @param {*} res response body
 */
exports.addCustomer = (req, res) => {
    // Add customer logic here
    const userId = req.body.userId
    const name = req.body.name
    const phone = req.body.phone
    const address = req.body.address
    const address2 = req.body.address2
    const city = req.body.city
    const state = req.body.state
    const zipcode = req.body.zipcode
    const insertQuery = 'INSERT INTO customer (userId, name, phone, address, address2, city,state, zipcode) VALUES (?, ?, ?, ?, ?,?, ?, ?)'
    if(!userId || !name || !phone || !address || !city || !zipcode || !state){
        message = 'missing some field'
        res.status(400).send({message: message})
    }else if( !validator.isEmail(userId)){
        message = 'invalid email' 
        res.status(400).send({message: message}) 

    }else if(state.length != 2){
        message = 'state should be to 2 letter'
        res.status(400).send({message: message})
    }
    else{
        primaryDb.query(insertQuery, [userId, name, phone, address, address2, city,state, zipcode], (err, dbres) => {

            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    message = 'This user ID already exists in the system.'
                    res.status(422).send({message: message}) 
                }else{
                    throw err
                }
            }else{
                    const message = {
                        id: dbres.insertId, // Get the auto-generated ID of the newly inserted record
                        userId,
                        name,
                        phone,
                        address,
                        address2,
                        city,
                        state,
                        zipcode
                    }
                    res.status(201).send(message)
                } 
            

        })
    }
};
/**
 * obtain the data for a customer given its numeric ID. 
 * This endpoint will retrieve the customer data on MySql 
 * and send the data in the response in JSON format. 
 * Note that ID is the  numeric ID, not the user-ID.
 * @param {*} req 
 * @param {*} res 
 */
exports.retrieveCustomerById = (req, res) => {
    // Retrieve customer by ID logic here
    const id = req.params.id
    let message = ''
    if(!validator.isNumeric(id)){
        message ='invalid id' 
        res.status(400).send({message:message})

    }else{
        const selectQuery = 'select * from customer where id = ?'
        replicaDb.query(selectQuery, id, (err,dbres) => {
            if(err) throw err
            if(dbres && dbres.length === 0){
                message = 'User not exist with given id'
                res.status(404).send({message:message})
            }
            else{
                message = dbres[0]
                res.status(200).send(message)
            }
        }
            ) 
    }
};
/**
 * obtain the data for a customer given its user ID,
 * which is the email address. 
 * This endpoint will retrieve the customer data on MySql 
 * and send the data in the response in JSON format. 
 * Note that the ‘@’ character should be encoded in the query
 * string parameter value (ex.: userId=starlord2002%40gmail.com). 
 * @param {*} req 
 * @param {*} res 
 */
exports.retrieveCustomerByUserId = (req, res) => {
    // Retrieve customer by userId logic here
    const userId = req.query.userId

    if(!validator.isEmail(userId)){
        res.status(400).send('invalid user id') 
    }else{
        const selectQuery = 'select * from customer where userId = ?' 
        replicaDb.query(selectQuery, userId, (err,dbres) => {
            if(err) throw err
            if(dbres && dbres.length === 0){
                res.status(404).send('User id do not exist in the database')

            }
            else{
                message = dbres[0]
                res.status(200).send(message)
            }
        }
            )  
    }
};