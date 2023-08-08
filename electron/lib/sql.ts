import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '#Admin1993',
  database: 'authenticator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  maxIdle: 10,
});

const connection = pool.promise();

connection.on('connection', (conn) => {
  console.log('connection');
  conn.on('error', (err) => {
    console.log('error', err);
  });
  conn.on('close', (err) => {
    console.log('close', err);
  });
  conn.on('end', (err) => {
    console.log('end', err);
  });
});

export default connection;
