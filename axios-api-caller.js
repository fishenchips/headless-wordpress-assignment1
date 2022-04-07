const axios = require("axios").default;

//base setting that are used for every call
function api() {
  return axios.create({
    baseURL: process.env.BASE_URL,
  }); //using built in process to reach my env url
}
