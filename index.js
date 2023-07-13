const express = require('express');
const app = express();
const config = require("platformsh-config").config();


app.use('/', express.static('dist/quote'))
// Get PORT and start the server
app.listen(config.port, function() {
  console.log(`Listening on port ${config.port}`)
});
