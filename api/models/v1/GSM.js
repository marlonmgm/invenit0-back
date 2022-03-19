/**
 * GSM.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    numero : {
      type : 'string',
      required : true
    },
    operadora : {
      type : 'string',
      //isIN : ['ATT','TELCEL','MOVISTAR'],
      required : true
    },
    APN : { //Se elimina?
      type : 'string',
      required : true
    }, // APN de la operadora, debe ser igual al APN de la configuracion 
    propietario : {
      model : 'user'
    }
    
  },

};

