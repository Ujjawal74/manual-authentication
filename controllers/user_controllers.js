const {
  hashPassword,
  compareHash,
  createToken,
  verifyToken,
  verify,
  createSession,
  destroySession,
  createNewUser,
} = require("../config/utils");
const User = require("../models/user");
const passGen = require("generate-password");

const userHome = (req, res) => {
  res.status(200).json({ status: "user home!" });
};

const loginController = (req, res) => {
  let isLogged = false;
  if (req.cred != undefined) {
    isLogged = true;
  }
  res.render("login", {
    isLogged,
  });
};

const registerController = (req, res) => {
  let isLogged = false;
  if (req.cred != undefined) {
    isLogged = true;
  }
  res.render("signup", {
    isLogged,
  });
};

const loginPostController = async (req, res) => {
  try {
    if (req.statusCode == 440) {
      destroySession(res);
    }
    if (req.statusCode == "ok" && req.cred != undefined) {
      return res.status(302).json({ status: 302 });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const isMatch = await compareHash(req.body.password, user.password);
      if (isMatch) {
        const token = createToken({ id: user.id });
        createSession(res, token);
        res.status(200).json({ status: 200 });
      } else {
        res.status(401).json({ status: 401 });
      }
    } else {
      res.status(404).json({ status: 404 });
    }
  } catch (error) {
    console.log(error);
  }
};

const registerPostController = async (req, res) => {
  try {
    if (req.statusCode == 440) {
      destroySession(res);
    }
    if (req.statusCode == "ok" && req.cred != undefined) {
      return res.status(302).json({ status: 302 });
    }
    req.body.password = await hashPassword(req.body.password);
    const response = await createNewUser(req.body);
    if (response.status == "ok") {
      const token = createToken({ id: response.data.id });
      createSession(res, token);
      return res.status(200).json({ status: 200 });
    } else {
      return res.status(500).json({ status: response.status });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500 });
  }
};

const googleSignUp = async (req, res) => {
  try {
    if (req.cred != undefined) {
      return res.status(302).json({ status: 302 });
    }
    const data = await verify(req.body.token);
    const user = await User.findOne({ email: data.email });
    if (user) {
      const token = createToken({ id: user.id });
      createSession(res, token);
      return res.status(409).json({ status: 409 });
    } else {
      if (data.email_verified) {
        let pass = passGen.generate({
          length: 12,
        });
        pass = await hashPassword(pass);

        const obj = {
          name: data.name,
          email: data.email,
          password: pass,
        };
        const response = await createNewUser(obj);
        if (response.status == "ok") {
          const token = createToken({ id: response.data.id });
          createSession(res, token);
          return res.status(200).json({ status: 200 });
        } else {
          return res.status(500).json({ status: 500 });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500 });
  }
};

// user Profile
const userProfile = (req, res) => {
  if (req.statusCode == "ok") {
    res.render("profile", {
      name: req.cred.name,
      email: req.cred.email,
      user_token: req.user_token,
    });
  } else {
    res.render("profile", {
      name: "Eobard Thawne",
      email: "unknown@nowhere.com",
      user_token: undefined,
    });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    if (req.method == "GET") {
      res.render("reset_pass");
    } 
    else if (req.method == "POST" && req.statusCode == "ok") {
      const token = req.params.token;
      const obj = verifyToken(token);
      const newPass = await hashPassword(req.body.newPass);
      if (obj.status == "ok") {
        const result = await User.findOneAndUpdate(
          { _id: obj.data.id },
          { password: newPass }
        );
        if (result) {
          res.status(200).json({
            status: "ok",
          });
        }
      }
    } 
    else if (req.method == "POST") {
      const token = req.params.token;
      const obj = verifyToken(token);
      const newPass = await hashPassword(req.body.newPass);
      if (obj.status == "ok") {
        const result = await User.findOneAndUpdate(
          { email: obj.data.email },
          { password: newPass }
        );
        if (result) {
          res.status(200).json({
            status: "ok",
          });
        }
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

const logout = (req, res) => {
  destroySession(res);
  res.redirect("/");
};

module.exports = {
  userHome,
  loginController,
  registerController,
  loginPostController,
  registerPostController,
  googleSignUp,
  userProfile,
  forgotPassword,
  logout,
};


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
