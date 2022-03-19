/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  jwtExpires: (6*60*60*1500),
  baseUrl: 'http://localhost',
  jwtHeader: 'x-token',
  adminUser: {
    username: 'admin',
    email: 'marlon93gm@gmail.com',
    password: 'P4zzw0rd_89'
  }

};
