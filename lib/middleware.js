export const verifyUser = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  next();
};

export const redirectAuthenticated = (req, res, next) => {
  if (req.session.userId) return res.redirect('/home');
  next();
};


