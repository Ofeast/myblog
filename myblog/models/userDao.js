var mysql=require('mysql');
var connection=require('./connection');
var pool=require('./pool');


module.exports={
	addUser: function(params,callback){
		pool.getConnection(function(err, connection) {
			var sql='insert into t_user(username,password,time) values(?, ?, ?)';
			connection.query(sql, [params.username,params.password,new Date()], function(err,rows,fields){
				connection.release();
				callback && callback(err,rows);
			})
		})
	},
	findUser: function(params,callback){
		pool.getConnection(function(err, connection) {
			var sql='select * from t_user where username=?';
			connection.query(sql, [params.username], function(err,rows,fields){
				callback && callback(err,rows);
			})
		})
	}
}
