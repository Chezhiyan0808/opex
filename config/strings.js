let query = {};

query.CREATE_DATA_TABLE = "CREATE TABLE $tablename$(shipment_id INT PRIMARY KEY, source_id VARCHAR(40) NOT NULL,destination_id VARCHAR(40) NOT NULL, date VARCHAR(40) NOT NULL, weight INT not null, cost INT not null, new_shipment_id INT not null, new_weight INT not null, new_cost INT not null, total_tls INT not null)";
query.CREATE_CONFIG_TABLE = "CREATE TABLE circle_config(id INT PRIMARY KEY, tablename VARCHAR(40) NOT NULL, master_circle VARCHAR(40) NOT NULL," +
  " parent_circle VARCHAR(40) NOT NULL, children_circle VARCHAR(40) NOT NULL, parent_size VARCHAR(40) NOT NULL, children_size VARCHAR(40) NOT NULL, " +
  "parent_tooltip VARCHAR(40) NOT NULL, children_tooltip VARCHAR(40) NOT NULL)";
query.CHECK_TABLE_PRESENT = "SELECT EXISTS (SELECT 1 FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = $1 )";
query.GETDATA = "SELECT * FROM $tablename$";
query.DELETE_ROW = "DELETE FROM circle_config WHERE id = 1;"
query.INSERT_CONFIG = "INSERT INTO circle_config (id, tablename,master_circle,parent_circle,children_circle,parent_size,children_size,parent_tooltip,children_tooltip) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9)";
query.IMPORT_CSV = "COPY $tablename$ FROM '$path$' DELIMITER ',' CSV HEADER;";

module.exports = {
  Query: query
};