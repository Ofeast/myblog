var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'db_blog',
  connectionLimit : 100
});


module.exports=pool;