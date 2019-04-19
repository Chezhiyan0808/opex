let Confidence = require('confidence');
let store = new Confidence.Store();

let doc = {
  "$filter": "env",
  "dev": {},
  "$default": {
    server: {
      "host": "localhost",
      "port": 80,
      routes: {
        cors: true
      }
    },
    defaultStorage: "FS",
    database: {
      couchbase: {
        host: 'localhost',
        port: 8901,
        bucket: 'user'
      }
    },
    baseServerUrl: "http://localhost:3000",
  }
};

store.load(doc);

module.exports = function (criteria) {

  return store.get('/', {"env": "default"});
};