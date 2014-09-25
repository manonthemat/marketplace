module.exports = function(req, resp, next) {

  if (req.session.user && req.session.user.admin) return next();

  // User is not allowed
  req.session.flash = { err: ["Only admins are allowed here."] };
  return resp.redirect('/session/new');
};
