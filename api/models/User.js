/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let bcrypt = require('bcrypt-nodejs');
module.exports = {

  tableName: 'users',

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    avatar: {
      type: 'string'
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },

    email: {
      type: 'string',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      minLength: 8,
      required: true
    },

    activo: {
      type: 'boolean',
      defaultsTo: true
    },

    ultimoAcceso: {
      type: 'number'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    group:{
      model:'group',
      columnName: 'groupId'
    },
    tracker : {
      model : 'tracker'      
    }, //tiene un tracker

  },

  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error(err);
        return cb(err);
      }
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) {
          console.log(err);
          return cb(err);
        } else {
          user.password = hash;
          return cb();
        }
      });
    });
  },

  afterCreate: async function(user, next){
    await User.update({ id: user.id }, { propietario: user.id });
    return next();
  },

  customToJSON: function() {
    return _.omit(this, ['password']);
  }

};
