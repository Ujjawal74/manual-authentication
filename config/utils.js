const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const MY_SECRET_KEY_SIGN = process.env.ENV_MY_SECRET_KEY_SIGN;
const CLIENT_ID = process.env.ENV_CLIENT_ID;

// verify google generated token
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

// hash new password
const hashPassword = async (password) => {
  const passHash = await bcrypt.hash(password, 10);
  return passHash;
};

// compare hash with user password
const compareHash = async (pass, hash) => {
  const isMatch = await bcrypt.compare(pass, hash);
  return isMatch;
};

// create jwt token
const createToken = (obj) => {
  const token = jwt.sign(obj, MY_SECRET_KEY_SIGN, {
    expiresIn: "600 seconds",
  });
  return token;
};

// verify jwt token
const verifyToken = (token) => {
  try {
    const obj = jwt.verify(token, MY_SECRET_KEY_SIGN);
    return {
      status: "ok",
      data: obj,
    };
  } catch (error) {
    return {
      status: -1,
      error: error.name,
    };
  }
};

// Create Session
const createSession = (res, token) => {
  res.cookie("my_session", token, {
    expires: new Date(Date.now() + 6000 * 100),
    httpOnly: true,
  });
};

// destroy session
const destroySession = (res) => {
  res.clearCookie("my_session");
};

// check if loggedIn
const isLoggedIn = async (req) => {
  try {
    const token = req.cookies.my_session;
    if (!token) {
      return {
        status: -1,
      };
    }

    const result = verifyToken(token, MY_SECRET_KEY_SIGN);
    // console.log("recieved obj is: ", result);
    if (result.status == "ok") {
      // check if its a valid token matches with database user or not
      const user = await User.findOne({ _id: result.data.id });
      if (user) {
        return {
          status: "ok",
          user,
          token,
        };
      } else {
        return {
          status: -1,
        };
      }
    } else {
      return {
        // jwt expired
        status: 440,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: -1,
    };
  }
};

// create new user
const createNewUser = async (obj) => {
  try {
    const user = new User(obj);
    const data = await user.save();
    if (data) {
      return {
        status: "ok",
        data,
      };
    } else {
      return { status: 500 };
    }
  } catch (error) {
    console.log(error);
    return { status: error.code };
  }
};

const checkAuth = async (req, res, next) => {
  try {
    req.cred = undefined;
    req.statusCode = undefined;
    req.user_token = undefined;

    const result = await isLoggedIn(req);
    if (result.status === "ok") {
      req.cred = result.user;
      req.statusCode = result.status;
      req.user_token = result.token;
      return next();
    } else {
      req.statusCode = result.status;
      return next();
    }
  } catch (error) {
    next();
    return;
  }
};

module.exports = {
  hashPassword,
  compareHash,
  createToken,
  verifyToken,
  checkAuth,
  verify,
  createSession,
  destroySession,
  isLoggedIn,
  createNewUser,
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
