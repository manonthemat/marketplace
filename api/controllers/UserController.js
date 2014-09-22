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
    User.create(req.params.all(), function userCreated(err, user) {
      if (err) {
        console.log(err);
        req.session.flash = { err: err };
        return resp.redirect('/user/new');
      }

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
      if (err) return next(err);
      if (!user) return next();

      resp.view({ user: user });
    });
  },

  // process the info from the edit view
  update: function(req, resp, next) {
    User.update(req.param('id'), req.params.all(), function userUpdated(err) {
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

