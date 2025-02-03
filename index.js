import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import fs from 'fs';
import https from 'https';
import flash from 'connect-flash';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import './lib/dbConnect.js';
import { verifyUser } from './lib/middleware.js';
import userRouter from './routes/user.route.js';
import homeRouter from './routes/home.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
  })
);


app.use(flash());
app.use((req, res, next) => {
  res.locals.info = req.flash('info')[0]; 
  res.locals.errors = req.flash('errors'); 
  next();
});


app.use('/auth', userRouter); 
app.use('/api', verifyUser, homeRouter); 


app.get('*', (req, res) => {
  res.status(404).render('404', {
    title: 'Not Found',
    message: 'The page you are looking for does not exist.',
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

const options = {
  key: fs.readFileSync('/etc/nginx/ssl/localhost.key'),
  cert: fs.readFileSync('/etc/nginx/ssl/localhost.crt'),
};

https.createServer(options, app).listen(3000, () => {
  console.log('Server running on https://localhost:3000');
});