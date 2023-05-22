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
