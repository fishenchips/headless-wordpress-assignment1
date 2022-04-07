const axios = require("axios").default;

//base setting that are used for every call
function api() {
  return axios.create({
    baseURL: process.env.BASE_URL,
  }); //using built in process to reach my env url
}

//GET all posts
module.exports.getPosts = async function () {
  return await api().get("/posts");
};

//GET a post by id
module.exports.getPostById = async function (postId) {
  return await api().get("/posts/" + postId);
};
