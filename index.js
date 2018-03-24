const express = require('express');
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

app.use('/users', users);
app.use('/auth', auth);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => console.log(`Running on port: ${app.get('port')}`));