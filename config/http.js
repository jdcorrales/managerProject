/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */
 var passport = require('passport'),
     LocalStrategy = require('passport-local').Strategy,
     DropboxStrategy = require('passport-dropbox').Strategy,
     GitHubStrategy = require('passport-github').Strategy,
     GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
     FacebookStrategy = require('passport-facebook').Strategy,
     configStrategies = require('./env/development.js'),
     bcrypt = require('bcrypt'),
     flashService = require('../api/services/FlashService.js');

var verifyHandlerLocal = function(username, password, done) {  
  process.nextTick(function () {    
    User.findOne({username:username}).exec(function (err, userfind) {        
        if (userfind) {
          bcrypt.compare(password, userfind.password, function (err, res) {
            if (!res) {              
              flashService.setMessage('warning','Usuario o contraseña invalida');
              return done(false,false);
            } else {
              return done(null, userfind);
            }            
          });          
        } else {          
          flashService.setMessage('warning','Usuario o contraseña invalida');
          return done(false, false);
        }       
    });
  });  
}

var verifyHandlerGoogle = function (token, tokenSecret, profile, done) {
  process.nextTick(function () {        
    var username = profile.emails[0].value.split('@');        
        username = username[0];       
    User.findOne({username:username}).exec(function (err, userfind) {        
        if (userfind) {
          bcrypt.compare(profile.id.toString(), userfind.providerid, function (err, res) {
            if (!res) {
              flashService.setMessage('warning','El nombre de usuario ya se en cuentra registrado');
              return done(null, null);
            } else {
              return done(null, userfind);
            }            
          });          
        } else {
          var password = Math.random().toString(36).substr(2);
          var providerUserProfile = {
            name : profile.name.givenName,
            last_name : profile.name.familyName,          
            username : username,
            email : profile.emails[0].value,
            provider : profile.provider,
            providerid : profile.id,
            password : password,
            passwordconfirmation : password
          };
          User.create(providerUserProfile, function (err, user) {                
            if(err){
              flashService.setMessage('warning','Error al crear el usuario.');
              return done(null, false);
            }else{
              return done(null, user);              
            }
          });
        }       
    });
  });
};

var verifyHandlerGithub = function (token, tokenSecret, profile, done) {
  process.nextTick(function () {      
    User.findOne({username:profile.username}).exec(function (err, userfind) {
        if (userfind) {
          bcrypt.compare(profile.id.toString(), userfind.providerid, function (err, res) {
            if (!res) {              
              flashService.setMessage('warning','El nombre de usuario ya se en cuentra registrado');
              return done(null, false);
            } else {
              return done(null, userfind);
            }            
          });          
        } else {          
          var name,
              last_name, 
              probableName = profile.displayName.split(' ');          
          switch (probableName.length) {
            case 1 : 
              name = probableName[0];
              last_name =  profile.provider;
            break;
            case 2 : 
              name = probableName[0];
              last_name =  probableName[1];
            break;
            case 3 : 
              name = probableName[0]+' '+probableName[1];
              last_name =  probableName[2];
            break;
            case 4 : 
              name = probableName[0]+' '+probableName[1];
              last_name =  probableName[2]+' '+probableName[3];
            break;
          } 
          var password = Math.random().toString(36).substr(2);          
          var providerUserProfile = {
            name : name,
            last_name : last_name,
            username : profile.username,
            email : profile.emails[0].value,
            provider : profile.provider,
            providerid : profile.id,
            password : password,
            passwordconfirmation : password
          };
          User.create(providerUserProfile, function (err, user) {
            if(err){              
              flashService.setMessage('warning','Error al crear el usuario.');
              return done(null, false);
            }else{
              return done(null, user);              
            }
          });
        }
    });
  });
};

var verifyHandlerDropbox = function (token, tokenSecret, profile, done) { 
  process.nextTick(function () {      
    var username = profile.emails[0].value.split('@'),        
        provider  = profile.provider;
        username = username[0];
    User.findOne({username:username}).exec(function (err, userfind) {        
        if (userfind) {
          bcrypt.compare(profile.id.toString(), userfind.providerid, function (err, res) {
            if (!res) {              
              flashService.setMessage('warning','El nombre de usuario ya se en cuentra registrado');
              return done(null, false);
            } else {
              return done(null, userfind);
            }            
          });          
        } else {  
          var providerData = profile._json;                   
          var password = Math.random().toString(36).substr(2);          
          var providerUserProfile = {
            name : providerData.name_details.familiar_name,
            last_name : providerData.name_details.surname,
            username : username,
            email : providerData.email,
            provider : provider,
            providerid : providerData.uid,
            password : password,
            passwordconfirmation : password
          };          
          User.create(providerUserProfile, function (err, user) {
            if(err){              
              flashService.setMessage('warning','Error al crear el usuario.');
              return done(null, false);
            }else{
              return done(null, user);              
            }
          });
        }
    });
  });
};

var verifyHandlerFacebook = function (token, tokenSecret, profile, done) { 

  process.nextTick(function () {      
    var probableName = profile.displayName.split(' '),
        username,
        email;

    switch (probableName.length) {
      case 1 : 
        name      = probableName[0];
        last_name =  profile.provider;
        username  = probableName[0]+'.'+profile.provider;
        email     = probableName[0]+'@'+profile.provider+'.dev';
      break;
      case 2 : 
        name      = probableName[0];
        last_name =  probableName[1];
        username  = probableName[0]+'.'+probableName[1];
        email     = probableName[0]+'.'+probableName[1]+'@'+profile.provider+'.dev';
      break;
      case 3 : 
        name      = probableName[0]+' '+probableName[1];
        last_name =  probableName[2];
        username  = probableName[0]+'.'+probableName[2];
        email     = probableName[0]+'.'+probableName[2]+'@'+profile.provider+'.dev';
      break;
      case 4 : 
        name      = probableName[0]+' '+probableName[1];
        last_name =  probableName[2]+' '+probableName[3];
        username  = probableName[0]+'.'+probableName[2];
        email     = probableName[0]+'.'+probableName[2]+'@'+profile.provider+'.dev';
      break;
    }
        
    User.findOne({username:username.toLowerCase()}).exec(function (err, userfind) {      
      if (userfind) {
        bcrypt.compare(profile.id.toString(), userfind.providerid, function (err, res) {
          if (!res) {            
            flashService.setMessage('warning','El nombre de usuario ya se en cuentra registrado');
            return done(null, false);
          } else {
            return done(null, userfind);
          }            
        });          
      } else {
        var password = Math.random().toString(36).substr(2);          
        var providerUserProfile = {
          name : name.toLowerCase(),
          last_name : last_name.toLowerCase(),
          username : username.toLowerCase(),
          email : email.toLowerCase(),
          provider : profile.provider,
          providerid : profile.id,
          password : password,
          passwordconfirmation : password
        };         

        User.create(providerUserProfile, function (err, user) {
          if(err){
            flashService.setMessage('warning','Error al crear el usuario.');
            return done(null, false);
          }else{
            return done(null, user);              
          }
        });
      }
    });
  });
};

passport.serializeUser(function (user, done) {    
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({id: id}).exec(function (err, user) {          
        var token_session = bcrypt.genSaltSync(user.id);
        var userData = {
          id : user.id,
          name : user.name,
          last_name : user.last_name,
          username : user.username,
          token_session: bcrypt.hashSync("B4c0/\/", token_session)
        };
        done(err, userData);
    });
});

module.exports.http = {
	customMiddleware: function (app) {

    passport.use(new LocalStrategy(
      verifyHandlerLocal
    ));

    passport.use(new GoogleStrategy({
        clientID: configStrategies.authenticate.google.clienteID,
        clientSecret: configStrategies.authenticate.google.clienteSecret,
        callbackURL: configStrategies.authenticate.google.callbackURL,
        provider : 'google'
      },
      verifyHandlerGoogle
    ));

    passport.use(new GitHubStrategy({
        clientID: configStrategies.authenticate.github.clienteID,
        clientSecret: configStrategies.authenticate.github.clienteSecret,                
        callbackURL: configStrategies.authenticate.github.callbackURL,
        provider : 'github'
      },
      verifyHandlerGithub
    ));

    passport.use(new DropboxStrategy({
        consumerKey: configStrategies.authenticate.dropbox.clienteID,
        consumerSecret: configStrategies.authenticate.dropbox.clienteSecret,
        callbackURL: configStrategies.authenticate.dropbox.callbackURL,
        provider : 'dropbox'
      },
      verifyHandlerDropbox
    ));        

    passport.use(new FacebookStrategy({
        clientID: configStrategies.authenticate.facebook.clienteID,
        clientSecret: configStrategies.authenticate.facebook.clienteSecret,
        callbackURL: configStrategies.authenticate.facebook.callbackURL,            
        provider : 'facebook'
      },
      verifyHandlerFacebook
    ));

    app.use(passport.initialize());
    app.use(passport.session());
  }

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  //middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    // order: [
    //   'startRequestTimer',
    //   'cookieParser',
    //   'session',
    //   'myRequestLogger',
    //   'bodyParser',
    //   'handleBodyParserError',
    //   'compress',
    //   'methodOverride',
    //   'poweredBy',
    //   '$custom',
    //   'router',
    //   'www',
    //   'favicon',
    //   '404',
    //   '500'
    // ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


  /***************************************************************************
  *                                                                          *
  * The body parser that will handle incoming multipart HTTP requests. By    *
  * default as of v0.10, Sails uses                                          *
  * [skipper](http://github.com/balderdashy/skipper). See                    *
  * http://www.senchalabs.org/connect/multipart.html for other options.      *
  *                                                                          *
  ***************************************************************************/

    // bodyParser: require('skipper')

  // },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
