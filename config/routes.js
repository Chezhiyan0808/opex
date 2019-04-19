
const joi = require('joi');
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
    }
  ];

  return routeTable;
};
