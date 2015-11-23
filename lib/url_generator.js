var Chance = require('chance');

var user = require('./user');

var chance = new Chance();

var exports = module.exports = {};

/********************************
 * @function generateString()
 * 
 * generateString() is a helper function to
 * the generateURL() export below.  It should
 * never be called anywhere else in this application
 * for the purpose of generating unique user IDs.
 *
 * It uses the Chance library to randomly
 * generate strings.
 *
 * @params: none
 * @return: a random, 5 character,
 * alphanumeric string.
 **********************************/

function generateString(){
  return chance.string({
  length: 5,
  pool: "abcdefghijklmnopqrstuvwxyz0123456789"
  });
}

/******************************************
 * @function generateURL()
 *
 * Generates a 5 char alphanumeric string.
 *
 * This string is then verified using the user model's
 * verifyurl function to ensure that the generated
 * string is not in use as a current user's unique ID.
 *
 * If it cannot ever create a url that's not in use,
 * this function hang forever, indicating that
 * the application will accept no more new users
 * until major database changes are undertaken.
 *
 * This function should only ever be called when
 * creating a new user.
 *
 * Takes no parameters.
 *
 * @return one String whose contents
 * are the new, unique URL that it generated.
 **********************************************/
exports.generateURL = function() {
  var url = generateString();

  var check = false;

  while(check === false){
    user.verifyurl(url, function(err, data){
      //verifyurl() in user.js calls a callback
      //that we define here and pass to it.
      if(err){
        return;
      }
      else {
        //Assuming nothing went wrong,
        //set 'check' = data, which *should be* the
        //original string we passed to verifyurl.
        check = data;
      }
    }); // end verifyurl
  } //end while
  return check;
}; //end generateURL()