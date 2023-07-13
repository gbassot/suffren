const app = require('express')();
const config = require("platformsh-config").config();
const mysql = require("mysql2/promise");

const root = path.join(__dirname, 'dist', 'quote');


app.use('/', express.static('dist/quote'))
// Get PORT and start the server
app.listen(config.port, function() {
  console.log(`Listening on port ${config.port}`)
});
