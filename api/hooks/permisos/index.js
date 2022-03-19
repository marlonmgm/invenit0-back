var grants = {
  admin: [
    { action: 'CREATE' },
    { action: 'READ' },
    { action: 'UPDATE' },
    { action: 'DELETE' }
  ],
  registered: [
    { action: 'CREATE' },
    { action: 'READ' }
  ],
  public: [
    { action: 'READ' }
  ]
};

var modelRestrictions = {
  registered: [
    'Role',
    'Permission',
    'User',
    'Passport'
  ],
  public: [
    'Role',
    'Permission',
    'User',
    'Model',
    'Passport'
  ]
};
var models;

module.exports = function myBasicHook(sails) {

  return {
    initialize: async function (next){

      sails.after('hook:orm:loaded', async () => {

        createModels()
        .then(models => {
          this.models = models;
          return createGroups();
        })
        .then(groups => {
          this.groups = groups;
          let adminGroup = _.find(groups, { name: 'admin' });
          return createAdmin(adminGroup);
        })
        .then(async (adminUser) => {
          await sails.models.user.update({ username: sails.config.custom.adminUser.username },
            { usuarioCreacion : adminUser.id,
              propietario : adminUser.id });

          return createPermissions(this.groups, this.models, adminUser, {});
        })
        .catch(err => {
          sails.log.error(err);
        });


      });
      next();
    }
  };

  function dropModels(){
    return sails.models.model.destroy({});
  }

  function createModels() {
    sails.log.verbose('sails-permissions: Sincronizando modelos de waterline');

    models = _.compact(_.map(sails.models, (model, name) => {
      return model && model.globalId && model.identity && {
        name: model.globalId,
        identity: model.identity,
        attributes: _.omit(model.attributes, _.functions(model.attributes))
      };
    }));

    return Promise.all(_.map(models, (model) => {
      return sails.models.model.findOrCreate({ name: model.name }, model);
    }));
  }

  function createGroups() {
    return Promise.all([
      sails.models.group.findOrCreate({ name: 'admin' }, { name: 'admin' }),
      //sails.models.group.findOrCreate({ name: 'registered' }, { name: 'registered' }),
      //sails.models.group.findOrCreate({ name: 'public' }, { name: 'public' })
    ]);
  }

  function createAdmin(adminGroup) {
    sails.config.custom.adminUser.group = adminGroup.id;
    sails.log.verbose('Creando usuario admin', sails.config.custom.adminUser);
    return sails.models.user.findOrCreate({email: sails.config.custom.adminUser.email}, sails.config.custom.adminUser);
  }

  function installModelOwnership() {
    var models = sails.models;

    if(sails.config.models.autoCreatedBy === false){ return; }

    _.each(models, model => {
      if (model.autoCreatedBy === false) {return; }

      _.defaults(model.attributes, sails.config.custom.ownershipAttributes);
    });
  }

  function createPermissions(groups, models, admin, config) {
    return Promise.all([
      grantAdminPermissions(groups, models, admin, config),
      //grantRegisteredPermissions(groups, models, admin, config)
    ])
    .then((permissions) => {
      //sails.log.verbose('created', permissions.length, 'permissions');
      return permissions;
    });
  }

  function grantAdminPermissions (groups, models, admin, config) {
    var adminGroup = _.find(groups, { name: 'admin' });
    var permissions = _.flatten(_.map(models, (modelEntity) => {
      //var model = sails.models[modelEntity.identity];
      grants.admin = _.get(config, 'grants.admin') || grants.admin;

      return _.map(grants.admin, (permission) => {
        var newPermission = {
          model: modelEntity.id,
          action: permission.action,
          group: adminGroup.id,
          relation: 'ALL',
          usuarioCreacion: admin.id,
          propietario: admin.id
        };
        return sails.models.permission.findOrCreate(newPermission, newPermission);
      });
    }));

    return Promise.all(permissions);
  }

  function grantRegisteredPermissions (groups, models, admin, config) {
    var registeredGroup = _.find(groups, { name: 'registered' });
    var basePermissions = [
      {
        model: _.find(models, { name: 'Permission' }).id,
        action: 'READ',
        group: registeredGroup.id,
        relation: 'ALL'
      },
      {
        model: _.find(models, { name: 'Model' }).id,
        action: 'READ',
        group: registeredGroup.id,
        relation: 'ALL'
      },
      {
        model: _.find(models, { name: 'User' }).id,
        action: 'UPDATE',
        group: registeredGroup.id,
        relation: 'OWNER'
      },
      {
        model: _.find(models, { name: 'User' }).id,
        action: 'READ',
        group: registeredGroup.id,
        relation: 'OWNER'
      }
    ];

    // XXX copy/paste from above. terrible. improve.
    var permittedModels = _.filter(models, (model) => {
      return !_.contains(modelRestrictions.registered, model.name);
    });
    var grantPermissions = _.flatten(_.map(permittedModels, (modelEntity) => {

      grants.registered = _.get(config, 'grants.registered') || grants.registered;

      return _.map(grants.registered, (permission) => {
        return {
          model: modelEntity.id,
          action: permission.action,
          group: registeredGroup.id,
          relation: 'ALL',
          propietario: admin.id
        };
      });
    }));


    return Promise.all(
      [ ...basePermissions, ...grantPermissions ].map(permission => {
        return sails.models.permission.findOrCreate(permission, permission);
      })
    );
  }

};
