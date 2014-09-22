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
  }
};

