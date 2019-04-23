let postgresClient = require('../config/postgresClient');
let strings = require('../config/strings');
let pgModel = {};
let internal = {};

pgModel.createTable = async(queryString, tableName) => {
  let isTableExists = await internal.checkTableExists(tableName);
  if (!isTableExists){
    await postgresClient.query(queryString)
      .catch((error) => {
        console.log(error.toString())
        return error.toString()
      });
    return {statusCode:200,message: "SUCCESS"};
  }else{
    return {statusCode: 301, message: "Table already exists"};
  }
};

pgModel.excuteQuery = async(queryString, params) => {
  let result = await postgresClient.query(queryString, params)
    .catch((error) => {
      return {rows: []}
    });
  return result.rows
};


internal.checkTableExists = async(tableName) => {
 let exists = await postgresClient.query(strings.Query.CHECK_TABLE_PRESENT, [tableName])
   .catch((error) => {
     console.log(error.toString())
     return error.toString()
   });
  return exists.rows[0].exists;
};

module.exports = pgModel;