module.exports = async function (req, res, proceed){
  //sails.log("all params");
  //sails.log(req.allParams());
  //sails.log("all params");
  //sails.log(req.headers);
  if(req.headers[sails.config.custom.jwtHeader]){
    req.token = req.headers[sails.config.custom.jwtHeader];
  } else {
    if(req.query.token){
      req.token = req.query.token;
    }
  }

  if(!req.token){
    return res.status(403).json({error: 'No se recibió token de acceso'});
  }

  return proceed();
};
