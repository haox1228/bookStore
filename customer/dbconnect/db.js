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

// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const primaryDb = mysql.createConnection({
//   host: process.env.RDS_HOST,
//   user: process.env.RDS_USER,
//   password: process.env.RDS_PASSWORD
// });

// const replicaDb = mysql.createConnection({
//   host: process.env.READ_REPLICA_HOST,
//   user: process.env.READ_REPLICA_USER,
//   password: process.env.READ_REPLICA_PASSWORD,
//   database: process.env.READ_REPLICA_DATABASE
// });

// primaryDb.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to RDS primary instance.');

//   // Create the bookstore database if it doesn't exist
//   primaryDb.query('CREATE DATABASE IF NOT EXISTS bookstore', (err) => {
//     if (err) {
//       throw err;
//     }

//     console.log('Database "bookstore" ensured.');

//     // Set the database for the primaryDb connection
//     primaryDb.changeUser({ database: process.env.RDS_DATABASE }, (err) => {
//       if (err) {
//         throw err;
//       }

//       console.log('Switched to "bookstore" database.');

//       // Create the customer table if it doesn't exist
//       primaryDb.query(`CREATE TABLE IF NOT EXISTS customer (
//         id int NOT NULL AUTO_INCREMENT,
//         userId varchar(255) NOT NULL,
//         name varchar(255) NOT NULL,
//         phone varchar(20) DEFAULT NULL,
//         address varchar(255) DEFAULT NULL,
//         address2 varchar(255) DEFAULT NULL,
//         city varchar(100) DEFAULT NULL,
//         state varchar(100) DEFAULT NULL,
//         zipcode varchar(20) DEFAULT NULL,
//         PRIMARY KEY (id),
//         UNIQUE KEY userId (userId)
//       )`, (err) => {
//         if (err) {
//           throw err;
//         }

//         console.log('Table "customer" ensured.');
//       });
//     });
//   });
// });

// setTimeout(() => {
//   replicaDb.connect((err) => {
//     if (err) {
//       throw err;
//     }
//     console.log('Connected to RDS read replica instance.');
//   });
// }, 10000); // 10 seconds delay
// module.exports = {
//   primaryDb,
//   replicaDb
// };
