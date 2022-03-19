/**
 * Tracker.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    nombre : {
      type : 'string',
      required : true,
    },    // Nombre general para facil identificacion del cliente
    imei :{
      type : 'string',
    },  //Requerido para administrar los dispositivos asociados a cada cliente y acceder al GPRS de cada dispositivo
    device : {
      model: 'device'
    },   //Pertenece a un modelo especifico de rastrador
    GSM : {
      model: 'GSM'
    },  //Pertenece a un numero celular, incluye la compañia movil ese modelo.
    cliente : {
      model : 'user'      
    }, //Pertenece a un cliente
    
  },

};

