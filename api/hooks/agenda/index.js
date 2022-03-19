let Agenda = require('agenda');
const fs = require('fs');
const jobsPath = './api/jobs';
let scheduler = {
  jobs : []
};

function iniciar(){
  if(scheduler.jobs.length) {
    scheduler.agenda.on('ready', () => {
      scheduler.agenda.start();
      sails.log.info('[✓] Agenda iniciada, jobs: ', scheduler.jobs);
      sails.agenda = scheduler.agenda;
    });

    scheduler.agenda.on('complete', (job) => {
      sails.log('Job %s finished', job.attrs.name);
    });
  }
}

function inicializar(connectionString){
  scheduler.agenda = new Agenda({db: {
    address: connectionString
  },
  maxConcurrency: 20
  });

  fs.readdir(jobsPath, (err, files) => {
    if (err) {
      sails.log.error(err);
      return err;
    }
    let i = 0;
    files.forEach((job) => {
      scheduler.jobs.push(job);
      require('../../.' + jobsPath + '/' + job)(scheduler.agenda);
      if (i === (files.length -1)) {
        iniciar();
        return scheduler;
      }
      i++;
    });

  });

}

module.exports = function agendaHook(sails) {

  return {
    initialize: async function (next){
      sails.after('hook:orm:loaded', async () => {
        inicializar(sails.config.datastores.default.url);
      });

      next();
    }
  };

};
