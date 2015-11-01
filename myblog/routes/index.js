var express = require('express');
var router = express.Router();
var userDao = require('../models/userDao')
var articleDao = require('../models/articleDao')
var qs = require('querystring');
var url = require('url');

/* GET home page. */
router.get(/^\/(type\/.*)?(search?.*)?$/, function(req, res, next) {

	var params = {};
	if(req.url=='/'){
		params.type=null;
	}else if(/\/type\//.test(req.url)){
		params.type=req.url.substring(req.url.lastIndexOf('/')+1);
	}else if(/\/search/.test(req.url)){
		params.type='search';
		params.search = url.parse(req.url,true).query.search;
	}else{
		res.render('error', { title: 'Error'});
	}
	
	var data={
		title: 'jtwmy-东'
	};
	//列表
	articleDao.getByType(params,function(err, rows){
		if(err){
			res.render('error', { title: 'Error'});
		}else{
			data.list=rows;
			//页码
			articleDao.getPageCount(params, function(err,rows){
				if(err){
					res.render('error', { title: 'Error', message: err});
				}else{
					var count = rows[0].count;
					count = count<1?1:count;
					data.pageCount=count;

					//热门文章
					articleDao.getHotArticle(params,function(err, rows){
						if(err){
							res.render('error', { title: 'Error', message: err});
						}else{
							data.hotArticle=rows;

							articleDao.getArticleType(params, function(err,rows){
								if(err){
									res.send('error', {title: 'Error', message:err});
								}else{
									data.type=rows;
									//友情链接
									articleDao.getLinks(params,function(err, rows){
										if(err){
											res.send('error', {title: 'Error', message:err});
										}else{
											data.links=rows;
											res.render('index', { data:data });
										}
									})
								}
							});

							
							
						}
					})
					
				}
			})
		}
	})

});

router.get('/getListByPageCount',function(req, res, next){
	var params = req.query;
	articleDao.getListByPageCount(params,function(err, rows){
		if(err){
			res.send('{"err":1,"msg":"从服务器获取数据失败"}');
		}else{
			res.send(JSON.stringify(rows));
		}
	})
})
router.get('/article/:id', function(req, res, next) {
	var data={};
	params=req.params;
	articleDao.updateClicks(params,function(err,rows){
		if (err) {
			data.title = 'Error';
			data.message = err;
			res.render('error', { data: data});
		}else{
			articleDao.getArticleById(params, function(err, rows){
				if(err){
					data.title = 'Error';
					data.message = err;
					res.render('error', { data: data});
				}else{
					data.title = rows[0].title;
					data.article = rows[0];
					res.render('article', { data: data});
				}
			});
		}
	})
});

function findUser(req){
	if(req.session.status){
		return true;
	 }
	 return false;
}
router.get('/admin', function(req, res, next) {
	var params=req.body;
	var data={
		title: '后台管理'
	};
  	if(!findUser(req)){
  		res.render('error', { title: 'Error' });	
  	}
  	articleDao.getArticleType(params,function(err,rows){
  		data.type=rows;
  		res.render('admin', { data: data });
  	});
});

router.post('/admin', function(req, res, next) {
	findUser(req, res, next)
  	var params = req.body;
  	articleDao.addArticle(params,function(err,rows){
	  	if(err){
	  		console.log(err);
	  		res.send('{"err":0,"msg":"发表失败"}');
	  	}else{
	  		res.send('{"err":0,"msg":"发表成功"}');
	  	}
  	});
});

router.get('/admin-login', function(req, res, next) {
  res.render('login', { title: '登录入口' });
});

router.post('/login', function(req, res, next) {
	var params = req.body;
	userDao.findUser(params,function(err,rows){
		if(err){
			console.log(err)
			res.send(err);
		}else{
			if(rows.length==0){
				res.send('{"err":1,"msg":"用户名不存在"}');
			}else if(rows[0].password == params.password){
				req.session.status = true;
				res.send('{"err":0,"msg":"登录成功"}');
			}else{
				res.send('{"err":1,"msg":"用户名或密码错误"}');
			}
		}
	})
});

// router.post('/reg', function(req, res, next) {
// 	var params = req.body;
//   	userDao.addUser(params,function(err, rows){
// 		if(err){
// 			console.log(err)
// 			res.send('注册失败');
// 		}else
// 		{
// 			res.send('注册成功');
// 		}
// 	})
// });
// 


router.get('/About', function(req, res, next) {
	var data={
		title: '登录入口'
	};
	res.render('about', { data: data });
})
router.get('/Not', function(req, res, next) {
	var data={
		title: 'Not'
	};
	res.render('not', { data: data });
})

module.exports = router;
