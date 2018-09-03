'use strict';
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const handle = require('express-handlebars');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const Pool = pg.Pool;

app.use(express.static(__dirname + 'public'));
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.engine('handlebars', handle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/registration_app_database';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

app.get('/', function (req, res) {
    res.render('index');
}); 


const PORT = 2018;
app.listen(PORT, function () {
    console.log('Talk to me port... ' + PORT);
});