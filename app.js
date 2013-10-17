/*
 * Module dependencies.
 */

var express = require('express');
var mongoose = require("mongoose");
var db = require('./model/db');
var http = require('http');
var path = require('path');
var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;

var app = express();
var store= require('./routes/store'), expressValidator = require('express-validator');
var check = require('validator').check;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ uploadDir:'/home/isha/uploads' }));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/agent' , store.page_populate);

app.get('/' , store.page_populate);
/*
app.get('/agent_edit' , function(req,res) {
   res.render('edit_agent' , { title : 'FLEXYTAB'});
 });
*/
app.get('/agent_edit', store.agent_edit);

app.get('/campaign' , store.camp_populate);
app.get('/campaign_create' , function(req, res) {
   res.render('campaign_create' , {title : 'FLEXYTAB'});

});

app.post('/camp_create',store.camp_create);
app.post('/camp_delete' , store.camp_delete) ;
app.get('/camp_edit' , store.camp_edit);
  // res.render('camp_edit',{ title : 'FLEXYTAB'}) 
//});
app.post('/camp_update', store.camp_update) ;

app.get('/phonebook' , store.pb_populate);
/*   res.render('pbrender' , { title : 'FLEXYTAB'});
 });
*/
app.get('/pb_create', store.camp_dropdown ) ;
app.get('/pb_edit' , store.pb_edit);
app.get('/reports' , function(req,res) {
   res.render('reportrender' , { title : 'FLEXYTAB'});
 });

app.post('/csv_read' , store.upload);

app.post('/render',store.page_populate);
 
app.post('/edit_agent',function(req,res) {
   res.render('edit_agent' , { title : 'FLEXYTAB'});
 });  
app.post('/pb_delete' , store.pb_delete);
app.get('/agent_create',function(req,res) {
   res.render('agent_create' , { title : 'FLEXYTAB'});
});

app.get('/agent_delete', function(req,res) {
   res.render('agent_delete',{title: 'FLEXYTAB'});
  });

app.post('/delete_agent',store.agent_delete);

app.post('/agent_submit',store.agent_create);

app.post('/agent_edit' , store.agent_edit);

app.post('/agent_update' , store.agent_update);

app.listen(3000);
console.log("server running");
