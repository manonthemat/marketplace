/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  'new': function(req, resp) {
    resp.view();
  },

  create: function(req, resp, next) {
    // check for email and password in params sent via form
    // if they aren't present, redirect to the login page (session/new)
    if (!req.param('email') || !req.param('password')) {
      req.session.flash = { err: ["Enter email and password for login."] };
      return resp.redirect('/session/new');
    }

    // try to find the user by email
    User.findOneByEmail(req.param('email'), function userFound(err, user) {
      var genericLoginError = { err: ["Login error." ] };
      if (err) return next(err);

      if (!user) {
        // generic error, because we don't want to tell the user that there's no record with the given email address
        req.session.flash = genericLoginError;
        return resp.redirect('/session/new');
      }

      require('bcrypt').compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) return next(err);

        if (!valid) {
          // if entered password doesn't match
          req.session.flash = genericLoginError;
          return resp.redirect('/session/new');
        }

        // otherwise login and redirect to user page
        req.session.authenticated = true;
        req.session.user = user;
        resp.redirect('/user/show/' + user.id);
      });
    });

  },

  destroy: function(req, resp, next) {
    req.session.destroy();
    resp.redirect('/session/new');
  }
};

