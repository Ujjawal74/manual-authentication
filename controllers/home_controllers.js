const { createToken } = require("../config/utils");
const User = require("../models/user");

const homeController = (req, res) => {
  let isLogged = false;
  if (req.cred != undefined) {
    isLogged = true;
    res.render("index", {
      user: req.cred.name,
      isLogged,
    });
  } else {
    res.render("index", {
      user: "",
      isLogged,
    });
  }
};

const generateToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const token = createToken({ email: email });
      return res.status(200).json({
        status: "ok",
        token,
      });
    } else {
      return res.status(404).json({
        status: 404,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
    });
  }
};

module.exports = { homeController, generateToken };


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
