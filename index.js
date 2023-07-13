const app = require('express')();
const config = require("platformsh-config").config();
const mysql = require("mysql2/promise");

function openConnection() {
  const credentials = config.credentials("database");
  return mysql.createConnection({
    host: credentials.host,
    port: credentials.port,
    user: credentials.username,
    password: credentials.password,
    database: credentials.path
  });
}

function createTable(connection) {
  return connection.execute(
    `CREATE TABLE IF NOT EXISTS platforminfo (
      uid INT(10) NOT NULL AUTO_INCREMENT,
      username VARCHAR(64) NULL DEFAULT NULL,
      departname VARCHAR(128) NULL DEFAULT NULL,
      created DATE NULL DEFAULT NULL,
      PRIMARY KEY (uid)
    ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;`
  );
}

function insertData(connection) {
  return connection.execute(
    "INSERT INTO platforminfo (username, departname, created) VALUES ('platform', 'Deploy Friday', '2019-06-17')"
  );
}

function readData(connection) {
  return connection.query("SELECT * FROM platforminfo");
}

function dropTable(connection) {
  return connection.execute("DROP TABLE platforminfo");
}

const root = path.join(__dirname, 'dist', 'quote');


app.get('*' ,function(req, res) {
  fs.stat(root + req.path, function(err){
    if(err){
      res.sendFile("index.html", { root });
    }else{
      res.sendFile(req.path, { root });
    }
  })
});

// Get PORT and start the server
app.listen(config.port, function() {
  console.log(`Listening on port ${config.port}`)
});
