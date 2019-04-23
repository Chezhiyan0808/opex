let pgModel = require('../postgres_model/postgres');
let strings = require('../config/strings');
let fs = require("fs");
let path = require('path');
let _ = require('lodash');

let data = {};
let internal = {};
data.createTable = async(request, h) => {
   const res = await pgModel.createTable(strings.Query.CREATE_CONFIG_TABLE);
   return res
};


data.uploadConfig =  async(request, h) => {
  const payload = request.payload
  const file = fs.readFileSync(path.resolve(payload.path));
  let config = JSON.parse(file.toString('utf8'));
  config = config.loadMaster[0];
  await pgModel.createTable(strings.Query.CREATE_CONFIG_TABLE, "circle_config");
  await pgModel.excuteQuery(strings.Query.DELETE_ROW);
  await pgModel.excuteQuery(strings.Query.INSERT_CONFIG,[1, config.table, config["master circle"],
    config["parent circle"], config ["children circle"], config["parent size"], config["children size"],
    config["parent tooltip"], config["children tooltip"]]);
  return 'Received your data'
};

data.generateChart = async(request, h) => {
  let query = JSON.parse(JSON.stringify(strings.Query.GETDATA)).replace("$tablename$", "circle_config");

 let config = await pgModel.excuteQuery(query, null)
  if(!config || config.length < 1){
   return {statusCode: 207, message: "Please upload the circle config file before proceeding further"};
  }
  config = config[0];
  query = JSON.parse(JSON.stringify(strings.Query.CREATE_DATA_TABLE)).replace("$tablename$", config.tablename);
  let response = await pgModel.createTable(query);
  await internal.importCSV(response, config.tablename)
  query = JSON.parse(JSON.stringify(strings.Query.GETDATA)).replace("$tablename$", config.tablename);
  let tableData = await pgModel.excuteQuery(query);
  internal.generateChartDataJSON(tableData);
  let filePath = path.join(__dirname,"..",'view','packingchart.html');
   return  h.file(filePath);
};

data.chartData = async(request, h)=>{
  let data= fs.readFileSync('./view/d3data.json');
  data = JSON.parse(data);
  return data;
};

internal.importCSV = async(response, tablename) => {
  if(response.statusCode === 200) {
    let importQuery = JSON.parse(JSON.stringify(strings.Query.IMPORT_CSV)).replace("$tablename$", tablename);
    let filePath = path.join(__dirname,"..",'data','ShipmentData.csv');
    importQuery = importQuery.replace("$path$", filePath);
    await pgModel.excuteQuery(importQuery)
    return {};
  } else{
    return {}
  }
};

internal.generateChartDataJSON = function(data)  {
  let result = [];
  let masterGroup = _.groupBy(data, "source_id");
  let masterGroupKeys = Object.keys(masterGroup);
  _.each(masterGroupKeys, function (masterGroupKey) {
    let masterObjs = masterGroup[masterGroupKey];
    let masterO = {};
    masterO.name = masterGroupKey;
    masterO.children=[];
    let parentGroup = _.groupBy(masterObjs, "new_shipment_id");
    let parentGroupKeys = Object.keys(parentGroup);
    _.each(parentGroupKeys, function (parentGroupKey) {
      let parentO = {};
      let parentGroupObjs = parentGroup[parentGroupKey];
      parentO.name = parentGroupObjs[0].new_shipment_id;
      parentO.size = parentGroupObjs[0].new_weight;
      parentO.tooltip = parentGroupObjs[0].new_cost;
      parentO.children=[];
      let childGroup = _.groupBy(parentGroupObjs, "shipment_id");
      let childGroupKeys = Object.keys(childGroup);
      _.each(childGroupKeys, function (childGroupKey) {
        let childO = {};
        let childGroupObjs = childGroup[childGroupKey];
        childO.name = childGroupObjs[0].shipment_id;
        childO.size = childGroupObjs[0].weight;
        childO.tooltip = childGroupObjs[0].cost;
        parentO.children.push(childO);
      });
      masterO.children.push(parentO);
    });
    result.push(masterO);
  });
  fs.writeFileSync("./view/d3data.json", JSON.stringify(result[0],null, 4));
  return null;
};
module.exports = data;