/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */
let db ={protocol: 'mongodb', user : 'sails_user', password: 'P4zzw0rd_89',
          host: 'ds121135.mlab.com', port: '21135', storage:'invenit_location'}
module.exports.datastores = {


  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, follow the directions below.     *
  * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  default: {

    adapter: 'sails-mongo',
    //url: 'mongodb://@127.0.0.1:27017/location',     
    url: 'mongodb://invenitadmin:mn-X-96r@cluster0-shard-00-00.clq9n.mongodb.net:27017,cluster0-shard-00-01.clq9n.mongodb.net:27017,cluster0-shard-00-02.clq9n.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ic8b97-shard-0&authSource=admin&retryWrites=true&w=majority',
    //url: 'mongodb://sails_user:P4zzw0rd_89.@ds121135.mlab.com:21135/invenit_location', 
    //url: db.protocol+'://'+db.user+':'+db.password+'@'+db.host+':'+db.port+'/'+db.storage, 

  },


};
