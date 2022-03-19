module.exports = async function (req, res, proceed) {

  // If `req.me` is set, then we know that this request originated
  // from a logged-in user.  So we can safely proceed to the next policy--
  // or, if this is the last policy, the relevant action.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  if (!req.user || !req.user.id) {
    req.logout();
    return res.send(500, new Error('req.user is not set'));
  }

  if ('PATCH' === req.method) {
    //req.body || (req.body = { });
    delete req.body.fechaCreacion;
    delete req.body.fechaActualizacion;
    return proceed();
  } else {
    return proceed();
  }

};
