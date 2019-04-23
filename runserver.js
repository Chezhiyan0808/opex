/***
 *
 */
const Hapi = require('hapi');
const appConfig = require('./config/appConfig')();

const server = new Hapi.Server(appConfig.server);

let routes = require('./config/routes')(server);


const init = async () => {
  await server.register(require('inert'));
  await server.start();
  server.route(routes);
  console.log('server running at: ' + server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);


});

init()
  .catch((err) => {

    console.error(err);
    process.exit(1);
  });

