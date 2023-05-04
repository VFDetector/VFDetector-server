var express = require('express');
var mongoose = require('mongoose');
var config = require("./config");

var app = express();
var router = express.Router(); 

var db = null;
mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1/vnfooddetection', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    /*useCreateIndex: true,*/
})
.then(() => db = mongoose.connection)
.catch(err => console.log(err));

var path = require('path');
var cors = require('cors');
var favicon = require('serve-favicon');

/* enable json, form-encoded in post, CORS and serve favicon */
app.use(express.json({ extended: true, limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/* configure route */
var router = express.Router(); 
require('./routes')(app, router);

/* set case or incase sensitve routing. */
app.set("case sensitive routing", config.case_sensitive);
/* set to use query parser to decode (internally uses querystring.unescape)  encoded-url in GET parameters */
app.set("query parser", "simple");
/* register all routes */
app.use(router);

/* server listen on port 8282. */
var server = app.listen(8282, function(){
	console.log("Listening on port 8282...");
});

/* handle clean up server and database process is terminated */
process.on('uncaughtException', function(err) {
    console.error('Uncaught exception ', err);
    shutdown();
});
 
process.on('SIGTERM', function () {
    console.log('Received SIGTERM');
    shutdown();
});
 
process.on('SIGINT', function () {
    console.log('Received SIGINT');
    shutdown();
});

function shutdown(){
	console.log('Shutting down ....');
	server.close(() => {
		console.log("Web server closed");
        db.close()
        .then(() => {
			console.log("Database closed");
		})
		.catch((err)=>{
			console.log(err);
		});
	});
}
