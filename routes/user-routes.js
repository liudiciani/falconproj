var express = require('express');

// This gives us access to the user "model".
var model = require('../lib/user');
var team = require('../lib/team.js');
var url_generator = require('../lib/url_generator.js');
// This creates an express "router" that allows us to separate
// particular routes from the main application.
var router = express.Router();

// A list of users who are online:
var online = require('../lib/online').online;


/************************************************************************************
*********************************| mainHome ROUTE |************************************
************************************************************************************
    If user is logged in, then reroute to user home or admin home
    depending on whether or not the user is an admin. If user is not logged in, then
    redirect to the mainHome page.*/

   router.get('/mainHome', (req, res) => {
        // Grab the session if the user is logged in.
        var user = req.session.user;

        //if session and user is online:
        if (user && online[user.uid]) {
        //check if user is an admin. If so, redirect to AdminHome, if not redirect to User Home
          if(user.admin === 'yes'){
              req.flash('admin','You are now logged in as an admin.');
              res.redirect('/user/admin');
          }
          else{
              req.flash('userhome','Welcome to your user home.');
              res.redirect('/user/userhome');
          }
        }
        else {//if user is not logged in, render the mainHome page
          // Grab any messages being sent to us from redirect:
          var message = req.flash('mainHome') || '';
          res.render('mainHome', {
            message : message });
        }
});

/************************************************************************************
*********************************| LOGIN ROUTE |*************************************
************************************************************************************/

    router.get('/login', (req, res) => {
          // Grab the session if the user is logged in.
          var user = req.session.user;

           // if session exists and user is online, then check if user is an admin.
           //if user is an admin, redirect to admin home, else redirect to userhome.
           if (user && online[user.email]) {
               if(user.admin === 'yes'){
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


/************************************************************************************
*********************************| AUTH ROUTE |*************************************
************************************************************************************
                    Performs **basic** user authentication.*/

    router.post('/auth', (req, res) => {
          // Grab the session if the user is logged in.
          var user = req.session.user;

          // if session exists and user is online, then check if user is an admin.
          //if user is an admin, redirect to admin home, else redirect to userhome.
          if (user && online[user.email]) {
              if(user.admin === 'yes'){
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
                    // Note from andrew: all users will return true to user.admin,
                    //you need to check to see if it is 'yes' or 'no'.
                    if(user.admin === 'yes'){
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


/************************************************************************************
*********************************| LOGOUT ROUTE |************************************
*************************************************************************************
                    Performs logout functionality - it does nothing!*/


    router.get('/logout', function(req, res) {
          // Grab the user session if logged in.
          var user = req.session.user;

          // If the client has a session, but is not online it
          // could mean that the server restarted, so we require
          // a subsequent login.
          if (user && !online[user.email]) {
            delete req.session.user;
          }
          // Otherwise, we delete both.
          else if (user) {
            delete online[user.email];
            delete req.session.user;
          }

          // Redirect to mainHome page regardless.
          req.flash('mainHome','Successful log out.')
          res.redirect('/user/mainHome');
    });


/************************************************************************************
*********************************| ABOUT ROUTE |*************************************
************************************************************************************/

    router.get('/about', (req, res) => {
          var user = req.session.user;
          var isAdmin;
          var isLoggedIn;

          //If not a user and not logged in, render about page with both
          //values set to false
          if(!user){
            res.render('about', {
              isLoggedIn: false,
              isAdmin: false
            });
          }

          //If session has expired, render about page with both values
          //set to false
          if(user && !online[user.email]){
            res.render('about', {
              isLoggedIn: false,
              isAdmin: false
            });
          }

          //If user is online, check if admin and show links accordingly
          if(user && online[user.email]){
            res.render('about', {
              isLoggedIn: true,
              isAdmin: (user.admin === 'yes')
            });
          }
    });

/************************************************************************************
*********************************| ADD ROUTE |*************************************
************************************************************************************
        This is the route that handles adding a new user to the database
                       when they sign up for a new account.*/


    router.post('/add', (req, res) => {
          //grab the input values from the sign up form.
          var fname = req.body.fname;
          var lname = req.body.lname;
          var phone = req.body.phone;
          var email = req.body.email;
          var password = req.body.password;
          var admin = 'no';  //default new users to not be admins

          if(!fname || !password || !lname || !phone || !email ){
              req.flash('signup','did not complete the information');
              res.redirect('/user/signup');
          }
          else{
            var uurl = url_generator.generateURL();
            model.add({fname,lname,phone,email,password,uurl,admin},function(error,newUser){
            if(error){
              req.flash('signup',error);
              res.redirect('/user/signup');
            }
            else{
              req.flash('login','User Addition Successful!');
              res.redirect('/user/login');
            }
          });
        }
    });


/************************************************************************************
*********************************| SIGNUP ROUTE |************************************
************************************************************************************/

    router.get('/signup', (req, res) => {
          var message = req.flash('signup') || 'Welcome to the Sign Up Page.';
          res.render('signup', {
            title: "Sign Up Page",
            message:message
          });
    });


/************************************************************************************
*********************************| UURL ROUTE |***************************************
************************************************************************************/


        router.get('/user-profile', (req, res) => {
            var user = req.session.user;

            //grab the uurl value from the form on the mainHome page
            var uurl = req.query.uurl;

            var isAdmin;
            var isLoggedIn;

 //If there is no user session, this is likely a visitor typing in the direct uurl for that user
            if(!user){
              model.search(uurl,function(error,userSearched){
                if(error){
                  req.flash('mainHome','No user found with that unique URL');
                  res.redirect('/user/mainHome');
                }
                else{
                  res.render('user-profile', {
                    isLoggedIn: false,
                    isAdmin: false,
                    name:userSearched.fname+" "+userSearched.lname,
                    email:userSearched.email
                  });
                }
              });
            }

//If session has expired, render about page with both values set to false
            if(user && !online[user.email]){
            //grab the uurl value from the form on the mainHome page
            var uurl = req.body.uurl;
            model.search(uurl,function(error,user){
                if(error){
                  req.flash('mainHome','No user found with that unique URL');
                  res.redirect('/user/mainHome');
                }
                else{
                  res.render('user-profile', {
                    isLoggedIn: false,
                    isAdmin: false,
                    name:user.fname+" "+user.lname,
                    email:user.email
                  });
                }
             });
            }

//If user is online, check if admin and show links accordingly
            if(user && online[user.email]){
                res.render('user-profile', {
                isLoggedIn: true,
                isAdmin: (user.admin === 'yes'),
                name:user.fname+" "+user.lname,
                phone:user.phone,
                email:user.email
              });
            }
        });


/************************************************************************************
*********************************| USERHOME ROUTE |**********************************
************************************************************************************/

    router.get('/userhome', function(req, res) {
      // Grab the user session if it exists:
      var user = req.session.user;

      // If no session, redirect to mainHome.
      if (!user) {
        req.flash('mainHome', 'Not logged in');
        res.redirect('/user/mainHome');
      }
      else if (user && !online[user.email]) {
        req.flash('login', 'Login Expired');
        delete req.session.user;
        res.redirect('/user/login')
      }
      else {
        var message = req.flash('userhome') || 'Welcome back';
        res.render('userhome', { title   : 'User Home Page',
          message : message,
          fname    : user.fname ,
          admin: user.admin,
          name: user.fname+" "+user.lname,
          email:user.email,
          uurl: user.uurl,
          isAdmin: (user.admin === 'yes'),
          phone: user.phone,
          isLoggedIn: true
          });
      }
    });
/************************************************************************************
*********************************| ADMIN ROUTE |***************************************
************************************************************************************/

router.get('/admin', (req, res) => {
      //grab the user session
      var user = req.session.user;

      if (!user) {
        req.flash('mainHome', 'Not logged in');
        res.redirect('/user/mainHome');
      }
      else if (user && !online[user.email]) {
        req.flash('login', 'Login Expired');
        delete req.session.user;
        res.redirect('/user/login')
      }
      else if (user && online[user.email] && user.admin === 'no') {
        res.redirect('/user/userhome');
      }
      else {//if the user session exists, user is logged in, and user is an admin.
        model.list(function (error, userList) {

           /*If there is an error in querying the database for all users' info, capture
           that error message and render the admin home page with no user data and the
           appropriate error message.
           */
        if (error) {
            var message = error;
            res.render('admin', {
                    message: message,
                    title: 'Admin Home',
                    fname: user.fname,
                    name: user.fname+user.lname,
                    email: user.email,
                    uurl: user.uurl,
                    isAdmin: (user.admin === 'yes'),
             });
          }
        else {

            /*If there wasn't an error in querying the database for all users' info, we render the
             admin home page with all the data from 'userList'.
             */

            var message = req.flash('admin') || 'Welcome back';
            res.render('admin', {
              message: message,
              title: 'Admin Home',
              fname: user.fname,
              name: user.fname+" "+user.lname,
              email: user.email,
              uurl: user.uurl,
              isAdmin: (user.admin === 'yes'),
              users: userList
            });
          }
        });
      }
  });

/************************************************************************************
*********************************| TEAM ROUTE |*************************************
************************************************************************************/

    router.get('/team', (req, res) => {
        var query = req.query;
        //grab the user session which will be used to determine which links show up on the 'team' page.
        var user = req.session.user;

        /*Test to see if the path includes a querystring:
         *  'query' is an OBJECT.  If it has no keys,
         *  it is the EMPTY OBJECT, thus there is NO
         *  querystring.
         *
         *  If a querystring exists, it will be ?user=...
         *  Look up the user accordingly and display their page.*/

        if(Object.keys(query).length !== 0) {
          var result = team.one(req.query.user)
          if (!result.success){
            notFound404(req, res);
          }
          else {
            if(user){//if the user session exists
              //grab the admin data from the user and check if the user is online.
              //These values will be passed to the 'team' handlebars and will decide
              //what links will render on the 'team' page
              var isAdmin = (user.admin==='yes');
              var isLoggedIn = online[user.email];
            res.render('team', {
              members: result.data,
              pageTestScript: 'qa/tests-team.js',
              isAdmin:isAdmin,
              isLoggedIn:isLoggedIn
            });
            }
            else{
              //if there is no user session, pass false in for the 'isAdmin'
              // and 'isLoggedIn' parameters of the 'team' handlebars.
              res.render('team', {
                members: result.data,
                pageTestScript: 'qa/tests-team.js',
                isAdmin:false,
                isLoggedIn:false
              });
            }
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
          }
          else {
            if(user){//if the user session exists
              //grab the admin data from the user and check if the user is online.
              //These values will be passed to the 'team' handlebars and will decide
              //what links will render on the 'team' page
              var isAdmin = (user.admin==='yes');
              var isLoggedIn = online[user.email];
            res.render('team', {
              members: result.data,
              pageTestScript: '/qa/tests-team.js',
              isAdmin:isAdmin,
              isLoggedIn:isLoggedIn
            });
            }
            else{
              //if there is no user session, pass false in for the 'isAdmin'
              // and 'isLoggedIn' parameters of the 'team' handlebars.
              res.render('team', {
                members: result.data,
                pageTestScript: 'qa/tests-team.js',
                isAdmin:false,
                isLoggedIn:false
              });
            }
          }
        }
    });


/************************************************************************************
*********************************| DYNAMIC ROUTE |***********************************
************************************************************************************/

    router.get('/:uuid', (req, res) => {
          var result = user_profile.fetch(req.params.uuid);
          if(!result.success) {
            notFound404(req, res);
          } else {
            res.render('user-profile', {
              message: 'Thanks for finding our users item!',
              name: result.uuid.fname + ' ' + result.uuid.lname,
              email: result.uuid.email,
              phone: result.uuid.phone,
              isAdmin:isAdmin,
              isLoggedIn:isLoggedIn
            })
      }});



/************************************************************************************
**************************************| MISC. |*************************************
************************************************************************************/

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