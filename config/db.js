require("dotenv").config();
const mongoose = require("mongoose");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}.oox9s59.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;