//加载依赖模块
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session')

//加载路由控制
var routes = require('./routes');
// var admin = require('./routes/admin');
//创建项目事例
var app = express();


// 定义session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
//定义模板引擎位置和ejs模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// 定义favicon图标位置
app.use(favicon(__dirname+'/public/images/favicon.ico'));
//定义日志输出级别
// app.use(logger('dev'));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//定义cookie解析器
app.use(cookieParser());
//定义静态文件目录
app.use(express.static(path.join(__dirname, 'public'),{maxAge:31557600000}));
//匹配路径和路由
app.use('/', routes);
// app.use('/admin', admin);



//404错误处理
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


// 开发环境，500错误处理和错误堆栈跟踪
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// 生产环境，500错误处理
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

//输出模型
module.exports = app;
