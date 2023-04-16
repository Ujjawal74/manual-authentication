// importing all required modules
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

// importing database connection && initialize express middlewares
const connectDB = require("./db/database");
connectDB();
// setting templating engine as ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// getting json from front end in readable format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// static files directory set
app.use(express.static("static"));

// import routers for complete app
const homeRouter = require("./routes/home");
app.use("/", homeRouter);

app.listen(PORT, (err) => {
  if (err) {
    return console.log("Error in running the server");
  }
  console.log(`Server is listening at the port ${PORT}`);
});


/*
Created By: Connect/Follow me on LinkedIn.
=> https://www.linkedin.com/in/ujjawal-biswas-b40611142/
          _   _                         _  _      _                           
  _   _  (_) (_)  __ _ __      __ __ _ | || |__  (_) ___ __      __ __ _  ___ 
 | | | | | | | | / _` |\ \ /\ / // _` || || '_ \ | |/ __|\ \ /\ / // _` |/ __|
 | |_| | | | | || (_| | \ V  V /| (_| || || |_) || |\__ \ \ V  V /| (_| |\__ \
  \__,_|_/ |_/ | \__,_|  \_/\_/  \__,_||_||_.__/ |_||___/  \_/\_/  \__,_||___/
       |__/|__/                                                                                                                                                                               
*/
