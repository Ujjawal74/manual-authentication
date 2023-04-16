const express = require("express");
const router = express.Router();
const { checkAuth } = require("../config/utils");
const {
  userHome,
  loginController,
  registerController,
  loginPostController,
  registerPostController,
  googleSignUp,
  userProfile,
  forgotPassword,
  logout,
} = require("../controllers/user_controllers");



router.get("/", userHome);
router.get("/login", loginController);
router.post("/login", checkAuth, loginPostController); // protected route
router.get("/signup", registerController);
router.post("/signup", checkAuth, registerPostController); // protected route
router.post("/auth/google/signup", checkAuth, googleSignUp); // protected route
router.get("/logout", logout);
router.get("/profile", checkAuth, userProfile); // protected route
router.get("/forgot-password/:token/reset", checkAuth, forgotPassword); // protected route

module.exports = router;


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
