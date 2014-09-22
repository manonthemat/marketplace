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

---
# flash notices on signup
Next up, we'll be implementing some flash notices on our sign-up form.

Modify the UserController's new action and add the create function:

    module.exports = {
      'new': function(req, resp) {
        resp.locals.flash = _.clone(req.session.flash);
        resp.view();
        req.session.flash = {};
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

In the new.ejs (the view of the user signup form), add some ejs for the flash notices.

---
# flash.js now middleware/policy
Create a new file api/policies/flash.js:

    module.exports = function(req, resp, next) {
      resp.locals.flash = {};

      // if there's no flash message, give control to the next middleware
      if (!req.session.flash) return next();

      // using underscore's clone function, cause req.session.flash by itself is a reference
      resp.locals.flash = _.clone(req.session.flash);

      // clear flash
      req.session.flash = {};

      next();
    };

Then remove anything flash-related in the new action of the UserController, so that the only thing that's left inside is the call to render the response view.

Next up: The config/policies.js needs adjustments.
Add this line in the right place:

    '*': 'flash'

---
# user show
Create a show function in the UserController and modify the create function to redirect to the show view of the created user.

After that, create the views/user/show.ejs.

Note: Anything between <%= %> in the view gets escaped, while <%- %> gets run (potentially harmful scripts for example).

---
# user index, edit and update
Add the edit, update and index action in the UsersController, then add the views.

There's plenty of to be refactored code, but it's good enough for now.

---
# switching to mongodb
Now lets just switch out our database to MongoDB.
Using the 'someMongodbServer' defined in the connections.js, we set it as a default in the models.js.

We also have to

    npm install sails-mongo --save

and start mongod. The --save flag adds the dependency to the package.json.

---
# bcrypt
First:

    npm install bcrypt --save

Add a model method for User

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

---
# authentication
Start by creating a new controller

    sails generate controller session

Add a new action to the SessionController

    module.exports = {
      'new': function(req, resp) {
        resp.view();
      }
    };

Create a directory for the session views

    mkdir views/session

and a new template (new.ejs) within that newly created directory.
Within that template, create a simple form that holds email, password and (hidden) csrf token. It should post to /session/create on submit.

Next up, create the create action in the SessionController.

- Check for email and password in params sent via form, if they aren't present, redirect to the login page (session/new)
- try to find the user by email, if there's no match, return a generic error as flash message and redirect to session/new
- if password doesn't match, redirect to session/new
- otherwise login and redirect to user page

---