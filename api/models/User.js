/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true, // this way, only listed attributes will be saved into the model

  attributes: {
    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      email: true, // email should be email
      required: true,
      unique: true
    },

    encryptedPassword: {
      type: 'string'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }
  },

  beforeCreate: function(values, next) {
    // checks for set password
    if (!values.password) return next({ err: ["No password set."] });
    else if(values.password != values.confirmation) return next({ err: ["Password confirmation doesn't match password"] });

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);

      values.encryptedPassword = encryptedPassword;
      next();
    });
  }
};

