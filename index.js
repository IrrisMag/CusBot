//const express = require('express');
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';

import productRouter from './routes/product.route.js';
import botRouter from './routes/bot.route.js';

//require('dotenv').config();
//require('./lib/dbConnect');

import 'dotenv/config';
import './lib/dbConnect.js';


//const homeRouter = require('./routes/home.route.js');
import homeRouter from './routes/home.route.js';


const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.AUTH_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

app.use(flash());


app.use('/api/home', homeRouter);

app.use('/api/bot',botRouter);

app.use("/api/products",productRouter);

app.get('*', (req, res) => {
  res.status(404).render('index', { 
    title:'Not Found',
    message: 'Not Found' 
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});