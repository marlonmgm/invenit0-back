/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getLoggedUser: async function (req, res) {
    let usuario = await User.findOne({id: req.user.id});
    return res.json(usuario);
  },
  register : function(req, res){
    console.log(req.body);

    User.create(req.body).exec(
      function(err, res1) {
        console.log(res1);
        //return res.json(res1);
        return res.ok();
      }
    );
  }

};
