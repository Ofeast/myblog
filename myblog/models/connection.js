var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'east0929',
  database : 'db_blog'
})


module.exports=connection;