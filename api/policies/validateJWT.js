module.exports = async function (req, res, proceed){  
  let nJwt = require('njwt');
  nJwt.verify(req.token,sails.config.session.secret, async (err,verifiedJwt) => {
    if(err){      
      return res.status(403).json({error: err.message});
    } else {
      let user = await User.findOne({username: verifiedJwt.body.sub});
      if (!user) {
        return res.status(403).json({error: 'Token no válido'});
      } else {
        req.user = user;
        return proceed();
      }
    }
  });

};
