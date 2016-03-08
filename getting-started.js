'use strict';

var mongoose = require('mongoose');
const express = require('express');
var stringify = require('json-stringify-safe');
var bodyParser = require('body-parser');

// Constants
const PORT = 8080;
var mydb = '172.17.0.2/agence';

// connexion à la base mongodb
mongoose.connect('mongodb://'+mydb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to "+mydb);
});

// declaration du schema
var bruitSchema = mongoose.Schema({
    date: { type: Date },
    level: Number
});

// declaration du type
var Bruit = mongoose.model('Bruit', bruitSchema);

// App
const app = express();
app.use(bodyParser.json()); // for parsing application/json

app.get('/', function (req, res) {
  res.send('Application running\n');
});

// liste des buits
app.get('/bruit', function (req, res) {
  console.log('bruit.find');
  Bruit.find(function (err, bruits) {
    if (err) return console.error(err);
    res.send(bruits);
  });
});

// insertion d'un evenement
app.post('/bruit', function (req, res) {
  // ton trace laa requete recue
  //var myreq = stringify(req);
  console.log('insert req.body: '+stringify(req.body));
  console.log('insert req.query: '+stringify(req.query));
  console.log('insert req.path: '+req.path);
  console.log('insert req params: '+stringify(req.params));

  var mylevel = 0;

  // si une value est fournie, on l'utilise
  if (req.query.value) {
    mylevel = req.query.value;
  }

  var bruit = new Bruit({ date: new Date(), level : mylevel });

  bruit.save(function (err, bruit) {
    if (err) return console.error(err);
  });
  console.log('bruit.insert :' + bruit);
  res.send(bruit);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
