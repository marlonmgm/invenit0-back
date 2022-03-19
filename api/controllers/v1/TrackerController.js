/**
 * TrackerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 function isOwner(id){
    let def = require("q").defer();

    return def.promise();
 };
module.exports = {    
    //Regresa los puntos de un GPS si es propietario de el
    allpoints: async function(req,res){        
        let TrackPoint = [];
        let owner =  req.body.id;
        let all_Tracks = await Tracker.find({propietario : owner})
        .intercept((err)=>{
            sails.log(sails.helpers.i18N(
                req.acceptsLanguages(),
                "Tracker.search_error"
                )
            );
            sails.log(err);
        });
        sails.log("Tracks totales: "+ all_Tracks.length);        
        Ciclo(all_Tracks,TrackPoint,0).then(function(ok){
            return res.json(ok);
        }).catch(function(err){
            return res.json(err);
        });        
        ///Falso ForEach con Promesas
        function Ciclo(datos,vector,posicion){
            "use strict";
            const def = require("q").defer();
            sails.log("******************************");
            sails.log("Track: "+datos[posicion].nombre);
            Geopoints.find({dispositivo : datos[posicion].id})
            .then(function(ok){
                let tracker_markers = {tracker : datos[posicion], points : ok };
                vector.push(tracker_markers);
                sails.log("Marcadores Totales: "+ ok.length);
                //sails.log("Posicion:"+posicion+" | "+(parseInt(datos.length)-1));                
                if(posicion == (parseInt(datos.length) - 1)){                    
                    def.resolve({ok: true, response: vector});
                }
                else
                    Ciclo(datos,vector,posicion+1).then(function(ok){
                        if(ok.ok)
                            def.resolve({ok: true, response : vector});
                        else
                            def.reject({ok:false, response : vector});
                    });
            }).catch(function(err){
                sails.log("err");
                sails.log(err);
                def.reject({ok : false});
            });
            return def.promise;
        };
        ///
    },
    //Devuelve una cantidad definida de puntos totales bajo ciertas condiciones.
    points: async function(req,res){
        //let owner =  req.body.id;        // id del cliente
        let tracker = req.params.device; // id del tracker                
        let total = [];
        if(typeof req.body.limite == 'undefined'){ //Si no se recibe el parametro se devuelven todos
        //verificamos que sea propietario del tracker              
            total = await Geopoints.find({dispositivo : tracker}).populate("dispositivo");            
        }else
            total= await Geopoints.find({dispositivo : tracker}).populate("dispositivo").limit(req.body.limite);            
        return res.json(total);
    },
    //Debido a que los trackers solo acceden por TCP puro no es posible usar este metodo
    mobileLocation : async function(req,res){
        //sails.log(req.allparam());
        let imei = req.param("username");                
        //identificamos el tipo de dispositivo
        //Se elige de un switch para ordenar la informacion
        let Data = await Tracker.findOne({imei : imei});
        let newData = {
            altitud : 0,
            longitud : req.param("longitude"),
            latitud : req.param("latitude"),
            dispositivo : Data.id
        }        
        let point = await Geopoints.create(newData).fetch()
        .intercept((err)=>{
            // En caso de errores se imprime el mensaje almacenado en la internacionalizacion
            sails.log(
                    sails.helpers.i18N(
                    req.acceptsLanguages(),
                    "Tracker.TK_insert_error"
                )                
            );
            sails.log(err);
        });        
        //Mensaje de consola de prueba
        let device = await Device.findOne({id: Data.device});                        
        sails.log("ID/IMEI:"+imei+" Tracker: "+device.modelo+" lat: "+newData.latitud+" long: "+newData.longitud);        
        return res.json(point);
    }
};