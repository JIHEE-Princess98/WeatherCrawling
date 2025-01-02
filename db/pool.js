const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    user: process.env.pg_user,
    host: process.env.pg_host,
    database: process.env.pg_database,
    password: process.env.pg_password,  
    port: parseInt(process.env.pg_port),
    schema: process.env.pg_schema,
  });
  

  pool.connect(function(err) {
    if(err) throw err;
    console.log('pg db connect !');
  });

  let tableQuerys = "SET search_path TO 'pohang_tp'";
  pool.query(tableQuerys, function (err, rows, fields) {
      if (err) console.log(err);
      console.log("Get Schema !")
  });

  module.exports =pool;