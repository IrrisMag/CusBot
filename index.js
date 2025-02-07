import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import connectDB from './lib/dbConnect.js';
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

// Session management
const clientPromise = connectDB().then(() => mongoose.connection.getClient());
app.use(
  session({
      secret: process.env.AUTH_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production' },
      store: MongoStore.create({
        clientPromise,
        ttl: 14 * 24 * 60 * 60,
    })
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

// Connect to MongoDB first, then start Express server
(async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== 'production') {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

// Export the app for Vercel
export default app;
