/*
	Module dependencies.
	API: http://expressjs.com/api.html
	指南翻译：https://github.com/sofish/express-guide

	@麦少 用 http://mcavage.me/node-restify/ 替代 express？
*/

var express = require('express')
var routes = require('./routes')
var user = require('./routes/user')
var http = require('http')
var path = require('path')
var mockRoute = require('./routes/mock')

var app = express()

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'bower_components')))

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler())
}

app.get('/', mockRoute.index)
app.get('/:id', mockRoute.index)

app.all('/mock/save', mockRoute.save)
app.all('/mock/item/:id', mockRoute.item)
app.all('/mock/list', mockRoute.list)
app.all('/mock/mock/:tpl', mockRoute.mock)

// app.get('/', routes.index)
// app.get('/users', user.list)

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'))
})