/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let passport = require('passport');
module.exports = {
  login: async function (req, res) {      
    passport.authenticate('local', async (err, user, info) => {
      if ((err) || (!user)) {
        return res.send({
          ok: false,
          message: await sails.helpers.i18N(req.acceptsLanguages(),info.message)
          //message: info.message          
        });
      }
      await User.update({id: user.id}, {ultimoAcceso: Date.now()});
      req.logIn(user, (err) => {
        if (err){ res.send(err); }
        return res.json({
          ok: true,
          //message: sails.helpers.i18N(req.acceptsLanguages(),info.message),
          //message: info.message,
          //message: sails.i18n('Welcome'),
          user: user,
          token: info.token
        });
      });

    })(req, res);
  },

  /**
   * `AuthController.logout()`
   */
  logout: async function (req, res) {
    req.logout();
    return res.json({
      ok: true,
      message : await sails.helpers.i18N(req.acceptsLanguages(),'logout')
    });
  }

};
