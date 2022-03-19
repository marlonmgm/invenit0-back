/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/
  AuthController: {
    login: true
  },
  /*AlmacenController: {
    show: true
  },
  VentasController: {
    Pedidos: true
  },
  ProductoController: {
    Productos: true
  },*/
  
  'v1/TrackerController': {
    //emmitLocation : true
    emmitLocation : 'trackerPermisos'
  },
  'v1/GeopointsController': {
    '*': true
  },
  UserController: {
    register: 'trackerPermisos'
  },
  '*': ['parseJWT',
    'validateJWT',
    'checkPermisos',
    'propietario',
    'fechas']

};
