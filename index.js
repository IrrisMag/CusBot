import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
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

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    secret: process.env.AUTH_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.info = req.flash('info')[0]; 
  res.locals.errors = req.flash('errors'); 
  next();
});

// Routes
app.use('/auth', userRouter); 
app.use('/api', verifyUser, homeRouter); 

// 404 Route
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});