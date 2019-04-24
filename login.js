var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : '192.168.49.104',
	user     : 'slappdeveloper',
	password : 'SQLdev@sl1',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('view engine', 'jade');
app.engine('jade', require('jade').__express); 

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {

	// https://github.blog/2019-04-23-game-on-what-was-it-like-to-make-games-during-the-80s/
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
				// response.sendFile('userhome.html', {root: __dirname });
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			// response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		// response.send('Welcome back, ' + request.session.username + '!');
		 console.log('it is here');
		// response.sendFile(path.join(__dirname +'/'+ 'userhome.html'));
		response.sendFile('userhome.html', {root: __dirname });
	} else {
		response.send('Please login to view this page!');
	}
	// response.end();
});

app.listen(3000);