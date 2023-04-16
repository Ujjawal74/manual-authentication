const mongoose = require("mongoose");

const connectDB = () => {
  // handle initial err.
  try {
    mongoose
      .connect("mongodb://localhost:27017/users", {
        useNewUrlParser: true,
      })
      .then(
        () => {
          console.log("connected!");
        },
        (err) => {
          console.log("error in connection!", err);
        }
      );

    // To handle errors after initial connection was established
    mongoose.connection.on("error", (err) => {
      console.log("error in running db connection", err);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
