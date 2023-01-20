const express = require('express');
const app = express();
const mongoose = require('mongoose');
const BlogPost = require('./schema');
const routes = require('./routes');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config({path: './config.env'});
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI).
    catch(error => console.error(error)).
    then(console.log('Connected to MongoDB.'));

app.use('/', routes);

app.listen(port, console.log('Listening on port', port));