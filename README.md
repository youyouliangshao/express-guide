# express-guide
N-blog

使用 Express + MongoDB 搭建多人博客

开发环境

Node.js: 6.9.1
MongoDB: 3.2.10
Express: 4.14.0
目录

开发环境搭建
Node.js 的安装与使用
安装 Node.js
n 和 nvm
nrm
MongoDB 的安装与使用
安装与启动 MongoDB
Robomongo 和 MongoChef
Node.js 知识点讲解
require
exports 和 module.exports
Promise
环境变量
packge.json
semver
npm 使用注意事项
npm init
npm install
npm scripts
npm shrinkwrap
Hello, Express
初始化一个 Express 项目
supervisor
路由
express.Router
模板引擎
ejs
includes
Express 浅析
中间件与 next
错误处理
一个简单的博客
开发环境
准备工作
目录结构
安装依赖模块
配置文件
config-lite
功能设计
功能与路由设计
会话
页面通知
权限控制
页面设计
组件
app.locals 和 res.locals
连接数据库
为什么使用 Mongolass
注册
用户模型设计
注册页
注册与文件上传
登出与登录
登出
登录页
登录
文章
文章模型设计
发表文章
主页与文章页
编辑与删除文章
留言
留言模型设计
显示留言
发表与删除留言
404页面
错误页面
日志
winston 和 express-winston
.gitignore
测试
mocha 和 supertest
测试覆盖率
部署
申请 MLab
pm2
部署到 Heroku
部署到 UCloud
