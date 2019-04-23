let requiredirectory = require('require-directory');

module.exports = function (server) {
  let controller = requiredirectory(module, '../controller');
  let routeTable = [
    {
      method: 'GET',
      path: '/test',
      config: {
        tags: ['api'],
        handler: (request, h) => {
          return 'Hello, world!';
        }
      }
    },
    {
      method: 'PUT',
      path: '/uploadConfig',
      config: {
        handler: controller.data.uploadConfig,
        payload: {
          maxBytes: 209715200,
          output: 'file',
          parse: true
        }
      }
    },
    {
      method: 'GET',
      path: '/chart',
      config: {
        tags: ['api'],
        handler: controller.data.generateChart
      }
    },
    {
      method: 'GET',
      path: '/chartData',
      config: {
        tags: ['api'],
        handler: controller.data.chartData
      }
    },
  ];

  return routeTable;
};
