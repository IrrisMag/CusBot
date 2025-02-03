import express from 'express';
import axios from 'axios';
const router = express.Router();


import { redirectAuthenticated } from '../lib/middleware.js';

import {
  validateSignup,
  signup,
  validateLogin,
  login,
  logout,
} from '../controllers/user.controller.js';

// Authentication Routes
router.get('/login', redirectAuthenticated, (req, res) => {
  res.render('login.ejs', {
    title: 'Sign in',
    user: req.flash('data')[0],
    info: req.flash('info')[0],
    errors: req.flash('errors'),
  });
});

router.post('/login', validateLogin, login);

router.get('/signup', redirectAuthenticated, (req, res) => {
  res.render('signup.ejs', {
    title: 'Sign up',
    user: req.flash('data')[0],
    info: req.flash('info')[0],
    errors: req.flash('errors'),
  });
});

router.post('/signup', validateSignup, signup);

router.get('/logout', logout);

// Translation Route
router.post('/translate', async (req, res) => {
  const { text, target_lang } = req.body;
  const allowedLanguages = ['fr', 'es'];

  if (!allowedLanguages.includes(target_lang)) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  try {
    const response = await axios.post('http://localhost:5000/api/translate', {
      q: text,
      source: 'en',
      target: target_lang,
      format: 'text',
    });

    res.json({ translatedText: response.data.translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});


router.get('/', (req, res) => {
  res.redirect('/login'); 
});

export default router;