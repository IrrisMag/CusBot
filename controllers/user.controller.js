import User from '../lib/models/user.model.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';


export const validateSignup = [
  body('email', 'Email must not be empty').notEmpty(),
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must not be empty').notEmpty(),
  body('password', 'Password must be 6+ characters long').isLength({ min: 6 }),
  body('repeatPassword', 'Repeat Password must not be empty').notEmpty(),
  body('repeatPassword', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
];


export const signup = async (req, res) => {
  const validationErrors = validationResult(req);


  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    req.flash('errors', errors);
    req.flash('data', req.body);
    return res.redirect('/auth/signup');
  }

  const { email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash('data', req.body);
      req.flash('info', {
        message: 'Email is already registered. Try to login instead.',
        type: 'error',
      });
      return res.redirect('/auth/signup');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = { email, password: hashedPassword };
    const result = await User.create(user);

    // Set the user ID in the session
    req.session.userId = result._id;

    // Redirect to the home page with a success message
    req.flash('info', {
      message: 'Signup Successful',
      type: 'success',
    });
    res.redirect('/api/home');
  } catch (error) {
    console.error('Signup error:', error);
    req.flash('info', {
      message: 'An error occurred during signup. Please try again.',
      type: 'error',
    });
    res.redirect('/auth/signup');
  }
};


export const validateLogin = [
  body('email', 'Email must not be empty').notEmpty(),
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must not be empty').notEmpty(),
];


export const login = async (req, res) => {
  const validationErrors = validationResult(req);

 
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    req.flash('errors', errors);
    req.flash('data', req.body);
    return res.redirect('/auth/login');
  }

  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('info', {
        message: 'Email is not registered.',
        type: 'error',
      });
      req.flash('data', req.body);
      return res.redirect('/auth/login');
    }

    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
     
      req.session.userId = user._id;

      
      req.flash('info', {
        message: 'Login Successful',
        type: 'success',
      });
      return res.redirect('/api/home');
    } else {
      req.flash('info', {
        message: 'Wrong Password',
        type: 'error',
      });
      req.flash('data', req.body);
      return res.redirect('/auth/login');
    }
  } catch (error) {
    console.error('Login error:', error);
    req.flash('info', {
      message: 'An error occurred during login. Please try again.',
      type: 'error',
    });
    res.redirect('/auth/login');
  }
};


export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      req.flash('info', {
        message: 'An error occurred during logout. Please try again.',
        type: 'error',
      });
      return res.redirect('/auth/login');
    }

    
    res.clearCookie('connect.sid');

    
    req.flash('info', {
      message: 'Logout Successful',
      type: 'success',
    });
    res.redirect('/auth/login');
  });
};