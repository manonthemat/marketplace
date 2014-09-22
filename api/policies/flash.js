module.exports = function(req, resp, next) {
  resp.locals.flash = {};

  // if there's no flash message, give control to the next middleware
  if (!req.session.flash) return next();

  // using underscore's clone function, cause req.session.flash by itself is a reference
  resp.locals.flash = _.clone(req.session.flash);

  // clear flash
  req.session.flash = {};

  next();
};
