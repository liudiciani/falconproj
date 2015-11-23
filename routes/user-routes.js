var express = require('express');

// This gives us access to the user "model".
var model = require('../lib/user');
var team = require('../lib/team.js');
var user_profile = require('../lib/user_profile.js');
// This creates an express "router" that allows us to separate
// particular routes from the main application.
var router = express.Router();

// A list of users who are online:
var online = require('../lib/online').online;


/*
route for splash page. If user is logged in, then reroute to user home or admin home
depending on whether or not the user is an admin. If user is not logged in, then
redirect to the splash page.
 */
router.get('/splash', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

//if session and user is online:
if (user && online[user.uid]) {
  //check if user is an admin. If so, redirect to AdminHome, if not redirect to User Home
  if(user.admin){
    req.flash('admin','You are now logged in as an admin.');
    res.redirect('/user/admin');
  }
  else{
    req.flash('userhome','Welcome to your user home.');
    res.redirect('/user/userhome');
  }
}
else {//if user is not logged in, render the splash page
  // Grab any messages being sent to us from redirect:
  var message = req.flash('splash') || '';
  res.render('splash', {
    message : message });
}
});

// Provides a login view
router.get('/login', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

// if session exists and user is online, then check if user is an admin.
//if user is an admin, redirect to admin home, else redirect to userhome.
if (user && online[user.email]) {
  if(user.admin){
    res.redirect('/user/admin');
  }
  else {
    res.redirect('/user/userhome');
  }
}
else {
  // Grab any messages being sent to us from redirect:
  var message = req.flash('login') || '';
  res.render('login', {
    title: 'User Login',
    message: message
  });
}

});

// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

// if session exists and user is online, then check if user is an admin.
//if user is an admin, redirect to admin home, else redirect to userhome.
if (user && online[user.email]) {
  if(user.admin){
    res.redirect('/user/admin');
  }
  else {
    res.redirect('/user/userhome');
  }
}
else {
  // Pull the values from the form:
  var email = req.body.email;
  var pass = req.body.pass;

  if (!email || !pass) {
    req.flash('login', 'did not provide the proper credentials');
    res.redirect('/user/login');
  }
  else {
    model.lookup(email, pass, function(error, user) {
      if (error) {
        // Pass a message to login:
        req.flash('login', error);
        res.redirect('/user/login');
      }
      else {
        // add the user to the map of online users:
        online[user.email] = user;

        // create a session variable to represent stateful connection
        req.session.user = user;
        //now check if the user is an admin, and depending on that, redirect to
        //either user home or admin home.
        if(user.admin){
          // Pass a message to admin home:
          req.flash('admin', 'authentication successful');
          res.redirect('/user/admin');
        }
        else{
          // Pass a message to user home:
          req.flash('userhome', 'authentication successful');
          res.redirect('/user/userhome');
        }


      }
    });
  }
}
});

router.get('/about', (req, res) => {
  res.render('about', {
    });
});

router.get('/signup', (req, res) => {
  res.render('signup', {
    });
});


router.get('/a-user-id', (req, res) => {
  res.render('a-user-id', {
    });
});

router.get('/userhome', function(req, res) {
  // Grab the user session if it exists:
  var user = req.session.user;

  // If no session, redirect to splash.
  if (!user) {
    req.flash('splash', 'Not logged in');
    res.redirect('/user/splash');
  }
  else if (user && !online[user.email]) {
    req.flash('login', 'Login Expired');
    delete req.session.user;
    res.redirect('/user/login')
  }
  else {
    //check if the user is an admin. This will decide whether or not the user home page will have a link to the admin home page
    var isAdmin = user.admin;
    // capture the user object or create a default.
    var message = req.flash('userhome') || 'Welcome back';
    res.render('userhome', { title   : 'User Home Page',
      message : message,
      fname    : user.fname ,
      isAdmin: isAdmin,
      name: user.fname+user.lname,
      email:user.email,
      uurl: user.uurl});
  }
});

router.get('/admin', (req, res) => {
  //grab the user session
  var user = req.session.user;

if (!user) {
  req.flash('splash', 'Not logged in');
  res.redirect('/user/splash');
}
else if (user && !online[user.email]) {
  req.flash('login', 'Login Expired');
  delete req.session.user;
  res.redirect('/user/login')
}
else if (user && online[user.email] && !user.admin) {
  res.redirect('/user/userhome');
}
else {//if the user session exists, user is logged in, and user is an admin.
  model.list(function (error, userList) {
    /*
     If there is an error in querying the database for all users' info, capture
     that error message and render the admin home page with no user data and the
     appropriate error message.
     */
    if (error) {
      var message = error;
      res.render('admin', {
        title: 'Admin Home',
        message: message,
        fname: user.fname
      });
    }
    else {
      /*
       If there wasn't an error in querying the database for all users' info, we render the
       admin home page with all the data from 'userList'.
       */
      var message = req.flash('admin') || 'Welcome back';
      res.render('admin', {
        message: message,
        title: 'Admin Home',
        fname: user.fname,
        users: userList
      });
    }
  });
}
});


router.get('/contact', (req, res) => {
  res.render('contact', {
    });
});

router.get('/team', (req, res) => {

  var query = req.query;


/*
 * Test to see if the path includes a querystring:
 *  'query' is an OBJECT.  If it has no keys,
 *  it is the EMPTY OBJECT, thus there is NO
 *  querystring.
 *
 *  If a querystring exists, it will be ?user=...
 *  Look up the user accordingly and display their page.
 */
if(Object.keys(query).length !== 0) {
  var result = team.one(req.query.user)
  if (!result.success){
    notFound404(req, res);
  } else {
    res.render('team', {
      members: result.data,
      pageTestScript: 'qa/tests-team.js'
    });
  }
}
/*
 * If there is NO querystring,
 * print out the info for all
 * users.
 *
 * Should we encounter an error getting
 * all the info, throw a 404.
 */
else {

  var result = team.all();
  if (!result.success) {
    notFound404(req, res);
  } else {
    ;
    res.render('team', {
      members: result.data,
      pageTestScript: '/qa/tests-team.js'
    });
  }
}

});

router.get('/:uuid', (req, res) => {
  var result = user_profile.fetch(req.params.uuid);
if(!result.success) {
  notFound404(req, res);
} else {
  res.render('a-user-id', {
    message: result.uuid
  })
}
});

// Provides a login view

//
//// Performs **basic** user authentication.
//router.post('/auth', (req, res) => {
//  // Grab the session if the user is logged in.
//  var user = req.session.user;
//
//  // Redirect to main if session and user is online:
//  if (user && online[user]) {
//    res.redirect('/user/main');
//  }
//  else {
//    // Pull the values from the form:
//    var name = req.body.name;
//    var pass = req.body.pass;
//
//    if (!name || !pass) {
//      req.flash('login', 'did not provide the proper credentials');
//      res.redirect('/user/login');
//    }
//    else {
//      model.lookup(name, pass, function(error, user) {
//        if (error) {
//          // Pass a message to login:
//          req.flash('login', error);
//          res.redirect('/user/login');
//        }
//        else {
//          // add the user to the map of online users:
//          online[user.name] = user;
//
//          // create a session variable to represent stateful connection
//          req.session.user = user;
//
//          // Pass a message to main:
//          req.flash('main', 'authentication successful');
//          res.redirect('/user/main');
//        }
//      });
//    }
//  }
//});
//
//// Performs logout functionality - it does nothing!
//router.get('/logout', function(req, res) {
//  // Grab the user session if logged in.
//  var user = req.session.user;
//
//  // If the client has a session, but is not online it
//  // could mean that the server restarted, so we require
//  // a subsequent login.
//  if (user && !online[user.name]) {
//    delete req.session.user;
//  }
//  // Otherwise, we delete both.
//  else if (user) {
//    delete online[user.name];
//    delete req.session.user;
//  }
//
//  // Redirect to login regardless.
//  res.redirect('/user/login');
//});
//
//// Renders the main user view.

//
//// Renders the users that are online.
//router.get('/online', function(req, res) {
//  // Grab the user session if it exists:
//  var user = req.session.user;
//
//  // If no session, redirect to login.
//  if (!user) {
//    req.flash('login', 'Not logged in');
//    res.redirect('/user/login');
//  }
//  else {
//    res.render('online', {
//      title : 'Online Users',
//      online: online
//    });
//  }
//});

module.exports = router;