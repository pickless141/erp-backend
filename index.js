require('dotenv').config();
const PORT = process.env.PORT;
const app = require('./app')
const mongoose = require('./config/db');

// Puerto
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server raised on port: ${PORT}`);
});