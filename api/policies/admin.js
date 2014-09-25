module.exports = function(req, resp, ok) {

  if (req.session.user && req.session.user.admin) return ok();

  // User is not allowed
  req.session.flash = { err: ["Only admins are allowed here."] };
  return resp.redirect('/session/new');
};
