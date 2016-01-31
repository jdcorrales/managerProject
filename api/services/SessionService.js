// SessionService.js
var bcrypt   = require('bcrypt');

module.exports = {
  sesionCreate : function(req, user)
  {
  	var token_session = bcrypt.genSaltSync(user.id);                    

    req.session.authenticated = true;               
    req.session.User = {
        "username" : user.username,
        "token_session" : bcrypt.hashSync("B4c0/\/", token_session),
        "id" : user.id
    };
  }
}