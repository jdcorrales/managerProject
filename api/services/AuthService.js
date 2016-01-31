// AuthService.js
var flashService = require('./FlashService.js'),
	sessionService  = require('./SessionService.js');

module.exports = {
  passportAuthenticate : function (req, res, err, user, provider)
  {
  	if(err){
		flashService.getMessage(req);
	    return res.redirect('/login');
	}

	req.logIn(user, function (err) {                
	    if (err) {	    	
	    	flashService.getMessage(req);
	        return res.redirect('/login');                                        
	    }
	    sessionService.sesionCreate(req, user);
	    res.redirect('/');
	    return;
	});
  }  
}