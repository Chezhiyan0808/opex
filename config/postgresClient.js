
let appConfig = require('./appConfig')();
const Pool = require('pg').Pool

const pool = new Pool({
  user:appConfig.database.postgres.user,
  host: appConfig.database.postgres.host,
  database: appConfig.database.postgres.database,
  password: appConfig.database.postgres.password,
  port: 5432,
});

pool.on('connect', () => {
  console.log('connected to the db');
});
module.exports=pool;
