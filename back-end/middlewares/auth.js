module.exports = {
  isAuthenticated: function(req, res, next) {
    if (localStorage.getItem('authUser') && JSON.parse(localStorage.getItem('authUser'))['token'] === req.header('X-OBSERVATORY-AUTH')) {
      return next();
    }
    return res.sendStatus(401);
  },
  isNotAuthenticated: function(req, res, next) {
    if (localStorage.getItem('authUser')) {
      return res.sendStatus(400);
    }
    return next();
  },
  isAdmin: function(req, res, next) {
    if (JSON.parse(localStorage.getItem('authUser'))['Admin'] ) {
      return next();
    }
    return res.sendStatus(401);
  }
};
