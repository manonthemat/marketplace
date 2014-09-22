# marketplace

Before we actually create our sails app, we gotta upgrade node

    npm cache clean -f
    npm update
    npm install -g n
    n stable
    npm install sails -g

Remember: If you do changes to your sails app, you may have to restart the server.

This app has been created with

    sails new marketplace --linker

--

For some housekeeping, we add *.swp to the .gitignore, so our temporary files created by vim don't get pushed to the git repository.

Next, we add the twitter bootstrap cdn to our layout.ejs.

Up next, we're creating a static homepage in views/static/index.ejs and link to that in our routes.

    '/': {
        view: 'static/index'
    }
