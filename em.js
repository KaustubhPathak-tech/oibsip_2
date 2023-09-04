// data.js
let sharedData = {};

function setEmail(email) {
  sharedData.email = email;
}

function getEmail() {
  return sharedData.email;
}


module.exports = {
  setEmail,
  getEmail,
};

