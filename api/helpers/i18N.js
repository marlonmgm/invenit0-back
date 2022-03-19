module.exports = {


  friendlyName: 'i18n',


  description: 'reemplaza el i18n por defecto de sailsjs debido a fallos de la version actual (enero/2019) de SailsJS',


  inputs: {
    idioma  : {type: ['string'], required: true},
    mensaje : {type: 'string', required: true}
  },


  exits: {
    success: {
      outputFriendlyName: 'Internacionalizacion',
      outputDescription: `Mensajes multi-idiomas`
    },
    modelNotFound: {
      description: 'traduccion no encontrada.'
    } 
  },


  fn: async function (inputs, exits) {
    let i18n = new (require('i18n-2'))({     
      locales: ['en', 'es'],
      directory : './config/locales'
    });
    // la variable locales debe poseer lo mismo que la el constructor de i18n
    let locales = ['en', 'es'];
    //Colocamos el idioma a la primera preferencia del navegador    
    inputs.idioma =_.head(inputs.idioma);    
    if(typeof inputs.idioma !== 'undefined'){ 
    //comprueba que este en la lista de idiomas disponibles
      inputs.idioma = locales.find(function(obj){ 
        return obj === inputs.idioma;
      });
    }    
    if(typeof inputs.idioma !== 'undefined'){
      i18n.setLocale(inputs.idioma);    
    }
    let mensaje = i18n.__(inputs.mensaje); //Se devuelve el mensaje en el idioma seleccionado               
    // All done.
    return exits.success(mensaje);

  }
};

