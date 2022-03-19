/**
 * Geopoints.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    altitud : {
      required : true,
      type : 'number',
      columnType : 'float',
    },  //Datos obligatorios que envia cada tracker
    longitud : {
      required : true,
      type : 'number',
      columnType : 'float',
    },  //Datos obligatorios que envia cada tracker
    latitud : {
      required : true,
      type : 'number',
      columnType : 'float',
    },  //Datos obligatorios que envia cada tracker
    
    // La fecha/hora de registros se crea automaticamente en todos los registros en : createdAt & updatedAt

    dispositivo : {
      model : 'tracker'
    },
      
  },

};

