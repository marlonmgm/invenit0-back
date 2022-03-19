module.exports = async function (req, res, proceed){

  if (!req.options.model) {
    return proceed();
  }
  let permiso = await sails.helpers.permisos(req.user.group, req.options.model, req.method)
  .intercept('modelNotFound', 'badRequest');

  if (!permiso) {
    return res.status(403).json({error: 'No tiene permisos para esta solicitud'});
  }

  switch (permiso.relation) {
    case 'GROUP':
      req.query.group = req.user.group;
      break;
    case 'OWNER':
      req.query.propietario = req.user.id;
      break;
    default:break;
  }

  return proceed();

};
