var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'east0929',
  database : 'db_blog',
  connectionLimit : 100
});


module.exports=pool;