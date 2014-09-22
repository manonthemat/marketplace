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

      resp.json(user);
      req.session.flash = {};
    });
  }
};

