// FlashService.js

var messages =  { success: [], error: [], warning: [] };

module.exports = {
	
	setMessage : function(key, message){
		messages[key].push(message);
	},

	getMessage : function(req){
		req.session.messages = messages;
	},

	success: function(req, message) {
    req.session.messages['success'].push(message);
	},
	
	warning: function(req, message) { 
  	req.session.messages['warning'].push(message);
	},   
	
	error: function(req, message) {
  	req.session.messages['error'].push(message);
	}
}