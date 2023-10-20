require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = require('./app')
const mongoose = require('./config/db');

// Puerto
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server raised on port: ${PORT || 5000}`);
});