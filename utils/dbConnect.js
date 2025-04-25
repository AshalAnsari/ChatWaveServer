const mongoose = require("mongoose")

const dbConnect = async () => {
    await mongoose
      .connect(
        "mongodb://127.0.0.1:27017/ChatWave"
      )
      .then(() => {
        console.log("Database connection established");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

module.exports = dbConnect