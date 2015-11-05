var mysql=require('mysql');
var connection=require('./connection');
var pool=require('./pool');

var pageSize=15;


module.exports={
	addArticle: function(params,callback){
		pool.getConnection(function(err, connection) {
			var sql='insert into t_article(title,content,type,time,clicks) values(?, ?, ?, ?, ?)';
			connection.query(sql, [params.title,params.content,params.type,new Date(),0], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			})
		})
	},
	getArticleById: function(params,callback){
		pool.getConnection(function(err, connection) {	// %H:%i:%s
			var sql='select id,title,type,content,clicks,date_format(time,"%Y-%m-%d") as time from t_article where id=?';
			connection.query(sql, [params.id], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			})
		})
	},
	updateClicks: function(params,callback){
		pool.getConnection(function(err, connection) {
			var sql='update t_article set clicks=clicks+1 where id=?';
			connection.query(sql, [params.id], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			})
		})
	},
	getPageCount: function(params,callback){
		pool.getConnection(function(err, connection) {
			var sql='select ceiling(count(*)/?) as count from t_article';
			if(params.type){
				sql+=' where type=?';
			}
			connection.query(sql, [pageSize,params.type], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			})
		})
	},
	getListByPageCount: function(params,callback){
		pool.getConnection(function(err, connection) {	// %H:%i:%s
			var start = (params.pageNum-1)*pageSize;
			var sql='select id,title,type,clicks,date_format(time,"%Y-%m-%d") as time from t_article order by time desc limit ?, ?';
			connection.query(sql, [start,pageSize], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			})
		})
	},
	getHotArticle: function(params,callback){
		pool.getConnection(function(err, connection) {
			var sql='select id,title,clicks from t_article order by clicks desc limit ?, ?';
			connection.query(sql, [0,5], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			})
		})
	},
	getLinks: function(params,callback){
		pool.getConnection(function(err, connection) {
			var sql='select url,name from t_links limit ?, ?';
			connection.query(sql, [0,5], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			})
		})
	},
	getBySearch:function(params,callback){
		pool.getConnection(function(err,connection){	// %H:%i:%s
			var sql='select id,title,type,clicks,date_format(time,"%Y-%m-%d") as time from t_article where title like "'+params.search+'"';
			connection.query(sql,function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			});
		});
	},
	getByType:function(params,callback){
		pool.getConnection(function(err,connection){	// %H:%i:%s
			var sql='select id,title,type,clicks,date_format(time,"%Y-%m-%d") as time from t_article';
			if(!params.type){
				sql+=' order by time desc';
			}else if(params.type=='search'){
				sql+=' where title like "%'+params.search+'%" order by time desc';
			}else{
				sql+=' where type=? order by time desc';
			}
			connection.query(sql, [params.type], function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			});
		});
	},
	getArticleType:function(params,callback){
		pool.getConnection(function(err,connection){
			var sql='select id,name,url from t_type';
			connection.query(sql, function(err,rows,fields){
				callback && callback(err,rows);
				connection.release();
			});
		});
	}
}
