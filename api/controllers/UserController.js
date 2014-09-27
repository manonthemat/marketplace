/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  'new': function(req, resp) {
    resp.view();
  },

  create: function(req, resp, next) {
    var userObj = {
      name: req.param('name'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    };

    User.create(userObj, function userCreated(err, user) {
      if (err) {
        console.log(err);
        req.session.flash = { err: err };
        return resp.redirect('/user/new');
      }

      // Log user in
      req.session.authenticated = true;
      req.session.user = user;
      resp.redirect('/user/show/' + user.id);
    });
  },

  show: function(req, resp, next) {
    User.findOne(req.param('id'), function userFound(err, user) {
      if (err) return next(err);
      if (!user) return next();

      resp.view({ user: user });
    });
  },

  // render the edit view
  edit: function(req, resp, next) {
    User.findOne(req.param('id'), function userFound(err, user) {
      req.session.flash = { };
      if (err) return next(err);
      if (!user) return next();

      resp.view({ user: user });
    });
  },

  // process the info from the edit view
  update: function(req, resp, next) {
    if (req.session.user.admin) {
      var user = {
        name: req.param('name'),
        email: req.param('email'),
        admin: req.param('admin')
      };
    } else {
      var user = {
        name: req.param('name'),
        email: req.param('name'),
        admin: false
      };
    }

    User.update(req.param('id'), user, function userUpdated(err) {
      if (err) return resp.redirect('/user/edit/' + req.param('id'));

      resp.redirect('/user/show/' + req.param('id'));
    });
  },

  index: function(req, resp, next) {
    User.find(function usersFound(err, users) {
      if (err) return next(err);

      resp.view({ users: users });
    });
  }
};

