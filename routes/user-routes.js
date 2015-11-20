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
  // @TODO: Do we need to grab the user from the db?
  // Grab the session if the user is logged in.
  var user = req.session.user;

//if session and user is online:
if (user && online[user.uid]) {
  //check if user is an admin. If so, redirect to AdminHome, if not redirect to User Home
  if(user.admin){
    res.redirect('/admin');
  }
  else{
    res.redirect('/userhome');
  }
  res.redirect('/user/');
}
else {//if user is not logged in, render the splash page
  // Grab any messages being sent to us from redirect:
  var message = req.flash('splash') || '';
  res.render('splash', {
    message : message });
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

router.get('/login', (req, res) => {
  res.render('login', {
    });
});

router.get('/a-user-id', (req, res) => {
  res.render('a-user-id', {
    });
});

router.get('/userhome', (req, res) => {
  res.render('userhome', {
    });
});

router.get('/admin', (req, res) => {
  res.render('admin', {
    });
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
//router.get('/main', function(req, res) {
//  // Grab the user session if it exists:
//  var user = req.session.user;
//
//  // If no session, redirect to login.
//  if (!user) {
//    req.flash('login', 'Not logged in');
//    res.redirect('/user/login');
//  }
//  else if (user && !online[user.name]) {
//    req.flash('login', 'Login Expired');
//    delete req.session.user;
//    res.redirect('/user/login')
//  }
//  else {
//    // capture the user object or create a default.
//    var message = req.flash('main') || 'Login Successful';
//    res.render('user', { title   : 'User Main',
//                         message : message,
//                         name    : user.name });
//  }
//});
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