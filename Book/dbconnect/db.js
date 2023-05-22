// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const primaryDb = mysql.createConnection({
//   host: process.env.RDS_HOST,
//   user: process.env.RDS_USER,
//   password: process.env.RDS_PASSWORD,
//   database: process.env.RDS_DATABASE
// });

// const replicaDb = mysql.createConnection({
//   host: process.env.READ_REPLICA_HOST,
//   user: process.env.READ_REPLICA_USER,
//   password: process.env.READ_REPLICA_PASSWORD,
//   database: process.env.READ_REPLICA_DATABASE
// });

// const createBooksTable = `
// CREATE TABLE IF NOT EXISTS books (
//   ISBN varchar(255) NOT NULL,
//   title varchar(255) NOT NULL,
//   author varchar(255) NOT NULL,
//   description text,
//   genre varchar(255) NOT NULL,
//   price decimal(10,2) NOT NULL,
//   quantity int NOT NULL,
//   PRIMARY KEY (ISBN)
// );
// `;

// primaryDb.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to RDS primary instance.');

//   primaryDb.query(createBooksTable, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log('Books table created or already exists.');
//   });
// });

// replicaDb.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to RDS read replica instance.');
// });

// module.exports = {
//   primaryDb,
//   replicaDb
// };

const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const primaryDb = mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE
});

const replicaDb = mysql.createConnection({
  host: process.env.READ_REPLICA_HOST,
  user: process.env.READ_REPLICA_USER,
  password: process.env.READ_REPLICA_PASSWORD,
  database: process.env.READ_REPLICA_DATABASE
});

primaryDb.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to RDS primary instance.');
});

replicaDb.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to RDS read replica instance.');
});

module.exports = {
  primaryDb,
  replicaDb
};