module.exports = function(req, resp, next) {

  console.log(req.allParams());
  console.log(req.session);
  if(!(req.session.user.id === req.param('id') || req.session.user.admin)) {
    req.session.flash = { err: ["Access denied"] };
    return resp.redirect('/session/new');
  }
  next();
};
