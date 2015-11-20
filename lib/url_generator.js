var Chance = require('chance');

var user = require('user');

var chance = new Chance();

var exports = module.exports = {};

function verify(url, err){
  //Call the verifyurl function from user.exports
  //and pass it a callback to make sure it succeeded
  user.verifyurl(url, function(err, data){
  if(err){
    return err;
  }
    
  //User.verifyurl returns an empty object (aka {})
  //if it succeeds
  if(data !== {}){
    return "Couldn't verify unique url";
  }
  return data;
  });
}

//Returns a new, verified unique url.
exports.generateURL = function() {
  var s = chance.string({
  length: 5,
  pool: "abcdefghijklmnopqrstuvwxyz0123456789"
  });
  var verified = verify(s, err);
  if(verified === {}) return s;
  else generateURL();
};