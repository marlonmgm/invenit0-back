module.exports = async function (req, res, proceed) {

  // Si no existe la variable req.user no es un usuario logueado
  if (!req.user || !req.user.id) {
    req.logout();
    return res.send(500, new Error('req.user is not set'));
  }

  if ('POST' === req.method) {
    req.body.usuarioCreacion = req.user.id;
    req.body.propietario = req.user.id;
    if (!req.body.group) {
      req.body.group = req.user.group;
    }
    return proceed();
  } else {
    return proceed();
  }

};
