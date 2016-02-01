// AuthService.js
var flashService = require('./FlashService.js'),
	sessionService  = require('./SessionService.js'),
	validator       = require('sails-validation-messages');

module.exports = {
  passportAuthenticate : function (req, res, err, user, provider)
  {
  	if(err){
		var errorObject = validator(User, err.invalidAttributes),
            validationFields = Object.keys(errorObject);
        
        validationFields.forEach(function(field) {    
            if(errorObject[field]) {                    
                 flashService.setMessage('warning',errorObject[field]);
            }
        }); 

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