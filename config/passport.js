let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt-nodejs');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ id: id } , (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  (username, password, done) => {

    User.findOne({ username: username })
    .populate('group')
    .exec((err, user) => {
      if (err) {
        sails.log.error(err);
        return done(err);
      }
      if (!user) {     
        //return done(null, false, { message: sails.i18n('passport.bad_login') });                
        return done(null, false, { message: 'passport.bad_login' });                        
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          console.error(err);
        }
        if (!res){
          return done(null, false, {
            message: 'passport.bad_login'            
          });
        }
        if (!user.group) {
          return done(null, false, {
            message: 'passport.group_not_found'
          });
        }
        if (!user.activo) {
          return done(null, false, {
            message: 'passport.disabled_user'
          });
        }
        sails.helpers.jwt(user.username, user.group.name)
        .then(token => {
          return done(null, user, {
            message: 'passport.success',
            token: token
          });
        });
      });
    });
  }
));
