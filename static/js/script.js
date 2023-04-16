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

// Global Toaster Setting
toastr.options = {
  closeButton: true,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: "2000",
};

async function handleCredentialResponse(response) {
  const res = await PostReqGetRes("/users/auth/google/signup", {
    token: response.credential,
  });
  console.log(res);
  if (res.status == 200) {
    toastr.success("Redirecting", "Registration Success");
    setTimeout(() => {
      window.location.replace("/");
    }, 2000);
  }
  if (res.status == 302) {
    toastr.info("Redirecting", "Already logged in!");
    setTimeout(() => {
      window.location.replace("/");
    }, 2000);
  }
  if (res.status == 409) {
    toastr.info("Redirecting", "Logging You In!");
    setTimeout(() => {
      window.location.replace("/");
    }, 2000);
  }
  if (res.status == 500) {
    toastr.error("Error", "Something went Wrong!");
  }
  if (res.status == 11000) {
    toastr.error("User Exists", "User With Same Email Exists!");
  }
}
window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "945771274748-lfdftfor3tagi4gjn4ldq6741b4jlmdc.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(document.getElementById("google-signin"), {
    theme: "outline",
    size: "large",
  });
  google.accounts.id.prompt();
};

const GetReqGetRes = async (uri) => {
  try {
    const res = await fetch(uri);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const PostReqGetRes = async (uri, obj) => {
  try {
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const homeLoginBtn = document.getElementById("login");
const homeLogoutBtn = document.getElementById("logout");

if (homeLoginBtn) {
  homeLoginBtn.addEventListener("click", function () {
    window.location.href = "/users/login";
  });
}

if (homeLogoutBtn) {
  homeLogoutBtn.addEventListener("click", function () {
    window.location.href = "/users/logout";
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", async function () {
    try {
      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      const res = await PostReqGetRes("/users/signup", {
        name,
        email,
        password,
      });
      console.log(res);
      if (res.status == 200) {
        toastr.success("Redirecting", "Registration Success");
        setTimeout(() => {
          // redirect with clear back
          window.location.replace("/");
        }, 2000);
      }
      if (res.status == 302) {
        toastr.info("Redirecting", "Already logged in!");
        setTimeout(() => {
          window.location.replace("/");
        }, 2000);
      }
      if (res.status == 500) {
        toastr.error("Error", "Something went Wrong!");
      }
      if (res.status == 11000) {
        toastr.error("User Exists", "User With Same Email Exists!");
      }
    } catch (error) {
      console.log(error);
    }
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", async function () {
    try {
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      const res = await PostReqGetRes("/users/login", {
        email,
        password,
      });
      console.log(res);
      if (res.status == 200) {
        toastr.success("Redirecting", "Login Success");
        setTimeout(() => {
          window.location.replace("/");
        }, 2000);
      }
      if (res.status == 302) {
        toastr.info("Redirecting", "Already Logged In");
        setTimeout(() => {
          window.location.replace("/");
        }, 2000);
      }
      if (res.status == 404) {
        toastr.error("Not Found!", "No user found!");
      }
      if (res.status == 401) {
        toastr.warning("Something Went Wrong", "Invalid Credentials!");
      }
    } catch (error) {
      console.log(error);
    }
  });
}
