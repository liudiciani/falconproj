var express = require('express');

// This gives us access to the user "model".
var model = require('../lib/user');

// A list of users who are online:
var online = require('../lib/online').online;

// This creates an express "router" that allows us to separate
// particular routes from the main application.
var router = express.Router();

router.get('/list', (req, res) => {
  // The admin list route lists the current users in the system and
  // provides a form to add a new user. You must make sure you do
  // the following in this route:

        var usr = req.session.user;
         if(!usr){
                  req.flash('login', 'User does not exist!');
                  res.redirect('/user/login');
                  }
         else if(!usr && !online[usr.name]){
                    req.flash('login', 'Login expired');
                    res.redirect('/user/login');
                    }
         else if(!usr.admin){
                       req.flash('login', 'Access requires admin credentials');
                       res.redirect('/user/login');
                    }
         else{
                 model.list(function(error,user){
                     console.log(user);
                     var msg = req.flash('user-list');
                     res.render('user-list', {
                     message: msg,
                     users: user
                });
             });
            }
         }

  //   (2) Test that the user session object exists. If not, a redirect
  //       back to the login view is necessary with a proper flash message.



  //   (3) Test if the user session exists and they are not online. If
  //       the user session exists and they are not online it means the
  //       server has been restarted and their session has expired. If
  //       this is the case you will need to redirect back to login with
  //       a proper flash message (e.g., login expired).



  //   (4) Test is the user is an admin. If they are not you need to
  //       redirect back to main with a proper flash message - indicate
  //       that the user needs admin credentials to access this route.



  //   (5) If the user is logged in, is online, and is an admin then
  //       you want to retrieve the list of users from the `lib/user.js`
  //       library and render the `user-list` view. The `user-list` view
  //       expects an array of users and a message. You should grab the
  //       flash message - if one exists, and pass it to the view template.
  //       A flash message will exist if the user tried to create a new
  //       user that already exists in our mock database.



router.post('/user', (req, res) => {
        //all steps described below function
        //step 1
        var usr = req.session.user;
        //step 2
        if(!usr){
          req.flash('login', "Session expired");
          res.redirect('/user/login');
          }
        //step 3
        else if(!usr && !online[usr.name]){
          req.flash('login', 'Login expired');
          res.redirect('/user/login');
          }
        //step 4
        else if(!usr.admin){
          req.flash('main', 'Access requires admin credentials');
          res.redirect('/user/main');
          }
        //step 5 & 6
         else {
          for(var elem in req.body){
            if(!elem){
              req.flash('./list', 'Error receiving user data');
              res.redirect('/user/login');
            }
          }
          //check if admin, assign proper boolean accordingly
           var a;
           if(req.body.admin === 'yes'){
            a = true;
           }
           else{
            a = false;
           }

           var newUser = {
             fname: req.body.fname,
             lname: req.body.lname,
             email : req.body.email,
             pass : req.body.pass,
             admin : a
           };


           model.add(newUser, function(error, user) {
           if(error){
             req.flash('user-list', error);
             res.redirect('/admin/list');
           }
           else{
             req.flash('user-list', 'Success!');
             res.redirect("/admin/list");
           }
         });
         }

  // This route is similar to the /user/auth route in that it does not
  // have an associated view. Rather, its job is to add a new user and
  // redirect to /admin/list. Its job is to add a new user if the user
  // does not already exist in our model. You must make sure you do
  // the following in this route:
  //   (1) Grab the user session object.
  //   (2) Test that the user session object exists. If not, a redirect
  //       back to the login view is necessary with a proper flash message.
  //   (3) Test if the user session exists and they are not online. If
  //       the user session exists and they are not online it means the
  //       server has been restarted and their session has expired. If
  //       this is the case you will need to redirect back to login with
  //       a proper flash message (e.g., login expired).
  //   (4) Test is the user is an admin. If they are not you need to
  //       redirect back to main with a proper flash message - indicate
  //       that the user needs admin credentials to access this route.
  //   (5) If the user is logged in, they are online, and they are an
  //       admin then you need to grab the form variables from the
  //       `req.body` object. Test to make sure they all exist. If they
  //       do not then you need to redirect back to the `/list` route
  //       defined above with a proper flash message.
  //   (6) If you have received the proper form variables then you must
  //       create a new user using the `model.add` function. If an error
  //       message is returned in the callback you should flash that message
  //       to the `list` route above passing it the error message returned
  //       from the `model.add` function and redirect to `list`.
  //       Otherwise, you should flash to `list` that the user has
  //       been added and redirect back to the `list` route.

});

module.exports = route