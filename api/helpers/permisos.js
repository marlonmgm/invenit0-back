
module.exports = {


  friendlyName: 'Permisos',


  description: 'Validación de permisos',


  inputs: {
    groupId: { type: 'string', required: true },
    model: { type: 'string', required: true },
    method: { type: 'string', required: true },
  },


  exits: {
    success: {
      outputFriendlyName: 'Permisos',
      outputDescription: `Permisos de usuario en el sistema`
    },
    modelNotFound: {
      description: 'No existe el Modelo.'
    }
  },


  fn: async function (inputs, exits) {
    let action;
    switch (inputs.method) {
      case 'POST':
        action = 'CREATE';
        break;
      case 'GET':
        action = 'READ';
        break;
      case 'PATCH':
        action = 'UPDATE';
        break;
      case 'DELETE':
        action = 'DELETE';
        break;
      default: break;

    }
    let model = await Model.findOne({ where: {identity: inputs.model}, select: ['id', 'name'] });
    if (!model) {
      exits.modelNotFound();
    }
    let permiso = await Permission.findOne({ where: { group: inputs.groupId, model: model.id, action: action },
      select: ['relation'] });
    return exits.success(permiso);

  }


};
