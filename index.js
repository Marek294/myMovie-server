const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const users = require('./routes/users');
const auth = require('./routes/auth');

dotenv.config();
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "AuthorizationToken, Origin, X-Requested-With, Content-Type, Accept");
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });
app.use('/users', users);
app.use('/auth', auth);

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => console.log(`Running on port: ${app.get('port')}`));