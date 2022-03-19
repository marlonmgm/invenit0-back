module.exports = {


  friendlyName: 'Jwt',


  description: 'Genera un json web token del usuario logueado',


  inputs: {
    username: {type: 'string', required: true},
    role: {type: 'string', required: true}
  },


  exits: {
    success: {
      outputFriendlyName: 'JWT',
      outputDescription: `JWT Token`,
      outputType: ['string']
    },
    notFound: {
      description: 'No se generó el token.'
    }
  },


  fn: async function (inputs, exits) {
    let nJwt = require('njwt');

    let claims = {
      iss: sails.config.custom.baseUrl,  // URL de servicio
      sub: inputs.username,    // Nombre de usuario
      group: inputs.group     //Grupo al que pertenece
    };

    let jwt = nJwt.create(claims, sails.config.session.secret);
    jwt.setExpiration(new Date().getTime() + sails.config.custom.jwtExpires);
    let token = jwt.compact();

    // All done.
    return exits.success(token);

  }


};
