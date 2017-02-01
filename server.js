/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-undef */

/**
 * Node program to initialize the server and register the routers to serve REST calls.
 * @author Rama Raju Vatsavai <rrv.atwork@gmail.com>
 */

/** Import the middleware */
var restify = require('restify');
var SwaggerRestify = require('swagger-restify-mw');

/** Get the Router instance for weather api */
var weatherRouter = require('./scripts/routes/weatherRoute.js').route;
var authRouter = require('./scripts/routes/authRoute.js').route;

/** Create a server */
var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0',
  url: 'localhost'
});

var config = {
  appRoot: __dirname // required config
};

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(function(req, res, next) {
  console.log('------- http header response for CORS ----------');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

/** Add router to the server program */
weatherRouter.applyRoutes(server);
authRouter.applyRoutes(server);

/** Redirect root context to static index.html file */
server.get(/.*/, restify.serveStatic({
  directory: './app',
  default: 'index.html'
}));


/*
server.listen(PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});
*/

SwaggerRestify.create(config, function(err, swaggerRestify) {
  if (err) { throw err; }

  swaggerRestify.register(server);

/** Set the application PORT number to an input value or default to 8000 */
  var PORT = Number(process.argv[2]) || 8000;
  server.listen(PORT);

  console.log('-------- SwaggerRestify.create ----------');
  console.log(swaggerRestify.runner.swagger.paths);
  if (swaggerRestify.runner.swagger.paths['/auth/users']) {
    console.log('try this:\ncurl http://127.0.0.1:' + PORT + '/auth/users');
  }
});

module.exports = server;
