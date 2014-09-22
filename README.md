# marketplace

Before we actually create our sails app, we gotta upgrade node

    npm cache clean -f
    npm update
    npm install -g n
    n stable
    npm install sails -g

Remember: If you do changes to your sails app, you may have to restart the server.

---
# sails new marketplace --linker
This app has been created with

    sails new marketplace --linker
---
# static homepage
For some housekeeping, we add *.swp to the .gitignore, so our temporary files created by vim don't get pushed to the git repository.

Next, we add the twitter bootstrap cdn to our layout.ejs.

Up next, we're creating a static homepage in views/static/index.ejs and link to that in our routes.

    '/': {
        view: 'static/index'
    }
---
# generate user
Now let's create a user model and controller. This command combines both actions in one step:

    sails generate api user
---

# user validations
Add some attributes and validations for the user model.

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
    }

Restart the server and create a few users.

    http://localhost:1337/user/create?name=Matthias+Sieber&email=matze@matzeone.com
    
Adding a user with a non-unique email address should result in an error.


Create some more users and then check for their existence by browsing to http://localhost:1337/user/

---

# user new
Let's extend our UserController

	module.exports = {
      'new': function(req, resp) {
        resp.view();
      }
    };

Create a new views/user directory and create a new.ejs with a simple form in it.

---
# csrf
Activate csrf protection in csrf.js

    module.exports.csrf = true;
    
And add a hidden field in views/user/new.ejs.

---
# User model toJSON function
to prevent that password and csrf token get returned, overwrite the toJSON function in the user model.

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }

---
# set schema to true
in the user model, set the schema to true.
That way, only listed attributes will be saved into the model.