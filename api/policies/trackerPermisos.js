module.exports = async function (req,res,proceed){    
    imei = req.param('username');
    let search = await Tracker.findOne({imei : imei})
    .intercept((err)=>{
        sails.log('access error');
        sails.log(err);
        return res.status(404).view('404');
    });
    if(!search){
        if(req.wantsJSON){
            return res.status(403).json({error : await sails.helpers.i18N(req.acceptsLanguages(),"policies.trackerPermisos_error")});            
        }
        else{            
            return res.status(404).view('404');
        }
    }  
    else{
        return proceed();
    }         

}