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
      postgres: {
        user: 'postgres',
        database: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        max: 10, // max number of connection can be open to database
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
      }
    },
    baseServerUrl: "http://localhost:3000",
  }
};

store.load(doc);

module.exports = function (criteria) {
 let storeData = store.get('/', {"env": "default"});
  return storeData
};