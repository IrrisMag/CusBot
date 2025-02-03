export const verifyUser = (req, res, next) => {
  console.log('verifyUser triggered:', req.session.userId);

  if (!req.session.userId) {
    console.log('User not logged in, redirecting to login');
  
    return res.redirect('/auth/login');
  }

  next();
};

export const redirectAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    console.log('User already logged in, redirecting to home');
    return res.redirect('/api/home');
  }

  next();
};


