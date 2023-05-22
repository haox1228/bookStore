/**
 * THis is the controller for book endpoints
 * It connects with mysql database
 */
const { primaryDb, replicaDb } = require('../dbconnect/db');
const validator = require('validator');
const { response } = require('express');

/**
 * Add Book endpoint
 * Description: Add a book to the system.   
 * The ISBN will be the unique identifier for the book.
 * The book is added to the Book data table on MySql (the ISBN is the primary key).
 * @param {*} req request body
 * @param {*} res result body
 */
exports.addBook = (req, res) => {
    const { ISBN, title, Author, description, genre, price, quantity } = req.body;
    let message = ''
    const re = /^\d+\.\d{2}$/
    //handle cases
    if(!ISBN || !title || !Author || !description || !genre || !price || !quantity){
        message = 'missing some field'
        res.status(400).send({message: message})
    }else if(!re.test(price)){
        message = 'price input not valid, need a number with 2 decimals'
        res.status(400).send({message: message})
    }else{
        const addQuery = 'INSERT INTO books (ISBN, title, author, description, genre, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)'
        primaryDb.query(addQuery, [ISBN, title, Author, description, genre, price, quantity], (err, dbres) => {

            if(err){
                if(err.code === 'ER_DUP_ENTRY'){
                    message = 'This ISBN already exists in the system.'
                    res.status(422).send({message: message}) 
                }else{
                    throw err
                }
            }else{
                if(dbres.length > 0){
                    message = 'This user ID already exists in the system.'
                    res.status(422).send({message: message})
                }else{
                    res.status(201).send({
                        ISBN,
                        title,
                        Author,
                        description,
                        genre,
                        price: parseFloat(price),
                        quantity
                    });
                } 
            }
        })
    }
};


/**
 * Update Book endpoint
 * Description: Update a book’s information in the system. 
 * The ISBN will be the unique identifier for the book.
 * The book is updated to the Book data table on MySql (the ISBN is the primary key).
 * @param {*} req request body
 * @param {*} res result body
 */
exports.updateBook = (req, res) => {
    const ISBN = req.params.ISBN;
    const title = req.body.title;
    const author = req.body.Author;
    const description = req.body.description;
    const genre = req.body.genre;
    const price = req.body.price;
    const quantity = req.body.quantity;
    let message = '';
    const re = /^\d+\.\d{2}$/;
    const checkQuery = 'SELECT * FROM books WHERE ISBN = ?';
    if (!ISBN || !title || !author || !description || !genre || !price || !quantity) {
        message = 'missing some field';
        res.status(400).send({ message: message });
    } else if (!re.test(price)) {
        message = 'price input not valid, need a number with 2 decimals';
        res.status(400).send({ message: message });
    } else {
            // If the book exists, perform the update
            const updateQuery = 'UPDATE books SET title = ?, author = ?, description = ?, genre = ?, price = ?, quantity = ? where ISBN = ?';
            primaryDb.query(updateQuery, [title, author, description, genre, price, quantity, ISBN], (err, dbres) => {
                if (err) throw err;
                if (dbres.affectedRows === 0) {
                    message = 'The ISBN ' + ISBN + ' not found in table books';
                    res.status(404).send({ message: message });
                } else {
                    message = {
                        ISBN: ISBN,
                        title: title,
                        Author: author,
                        description: description,
                        genre: genre,
                        price: parseFloat(price),
                        quantity: quantity
                    };
                    res.status(200).send(message);
                }
            });
        }
    };


/**
 * Retrieve Book endpoint
 * Description: return a book given its ISBN. 
 * The ISBN will be the unique identifier for the book.
 * The book is updated to the Book data table on MySql (the ISBN is the primary key).
 * @param {*} req request body
 * @param {*} res result body
 */
exports.retrieveBook = (req, res) => {
    const ISBN = req.params.isbn || req.params.ISBN


    const selectQuery = 'select * from books where ISBN = ?'
    replicaDb.query(selectQuery, ISBN, (err,dbres) => {
        if(err) throw err
        if(dbres && dbres.length === 0){
            const message = 'No such ISBN'
            res.status(404).send({message: message})
        }else{
            message = dbres[0]
            let resJson = {
                
                ISBN : message.ISBN,
                title : message.title,
                Author : message.author,
                description: message.description,
                genre: message.genre,
                price: parseFloat(message.price),
                quantity: message.quantity
            }
            res.status(200).send(resJson)
        }
    }
        )
};