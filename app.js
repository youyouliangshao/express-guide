var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('./config/env').log;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 配置文件
var config = require('./config/env');
// 环境变量
var constants = require('./config/constants');
var routes = require('./routes');
// ejs helper
var helpers = require('./commons/helper');
var proxy = require('express-http-proxy');
var app = express();

// 设置本地变量的默认信息
app.locals.projectDefault = constants;
// 模板目录
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态文件目录
app.use(express.static(path.join(__dirname, 'static')));
// 路由
routes(app);
// ejs helper
helpers(app);
// 代理
app.use('/', proxy(config.api_domain,{
    filter : function(req,res){
        return req.url.indexOf('/api/b/') == 0;
    },
    forwardPath:function(req,res){
        logger.info("请求转发url：" + require('url').parse(req.url).path);
        return require('url').parse(req.url).path;
    },
    parseReqBody: false,
    reqBodyEncoding: null
}));

// 捕获404并转发到错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理
app.use(function(err, req, res, next) {
    if(err.statusCode){
        err.status = err.statusCode;
        if(err.body){
            err.message = err.body.message;
        }
    }
    logger.error(err.status+ ',' +err.message);
    logger.debug(err.stack);
  // 设置本地变量，只在开发状态显示错误
  res.locals.message = err.message || '系统异常,请稍后重试';
  res.locals.error = (config.server.profiles === 'dev' ||config.server.profiles === 'test') ? err : {};

  // 显示错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
