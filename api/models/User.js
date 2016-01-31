/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {   

   attributes: {
   		name : {
  			type : 'string',
  			required : true,  		
  			defaultsTo : 'Jhon'
  		},
  		last_name : {
  			type : 'string',
  			required : true,
  			defaultsTo: 'Doe'
  		},
  		username : {
  			type : 'string',
  			required : true,
  			unique : true,  		
	  	},
	  	email : {
	  		type : 'email',
	  		required : true
	  	},
	  	provider: {
	  		type : 'string',
	      	required : true     
	  	},
	  	providerid : {
	  		type : 'string',
	  		require : false
	  	},	  	
	    password : {
	      type : 'string',
	      required : true
	    },    
	    passwordconfirmation : {
	      type : 'string'
	    },
	    toJSON: function() {
	      var obj = this.toObject();
	      delete obj.passwordconfirmation;      
	      return obj;
	    }
	},
	beforeCreate : function (values, next) 
  	{
	    var password = values.password;
	    var passwordconfirmation = values.passwordconfirmation;

	    if (!password || !passwordconfirmation || password != passwordconfirmation) {
	      var passwordDoesNotMatchError = [{
	        name : 'passwordDoesNotMatch',
	        message : 'Las Contraseñas deben Coincidir'
	      }];

	      return next({
	        err : passwordDoesNotMatchError
	      });
	    }	    

	    require('bcrypt').hash(values.password, 10, function passwordEncrypted (err, encryptedpassword) {      
	    	values.password = encryptedpassword;
	     	values.passwordconfirmation = null;
		  	
		  	if (values.providerid) {
			  	require('bcrypt').hash(values.providerid, 10, function passwordEncrypted (err, encryptedproviderid) { 
			    		values.providerid = encryptedproviderid;	      
			    		next();
			  	});		  		
		  	} else {
		  		next();
		  	}
	    });

  	}
};
