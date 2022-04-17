const axios = require("axios").default;

//Site info for home page
module.exports.getSiteInfo = async function () {
  const response = await axios.get(process.env.BASE_URL);

  return response;
};

//base setting that are used for every call
function api() {
  return axios.create({
    baseURL: process.env.BASE_URL + "/wp/v2",
  }); //using built in process to reach my env url
}

//GET all posts
module.exports.getPosts = async function (pageNr) {
  return await api().get("/posts", {
    params: {
      per_page: 2,
      page: pageNr,
    },
  });
};

//GET a post by id
module.exports.getPostById = async function (postId) {
  return await api().get("/posts/" + postId);
};

module.exports.getPages = async function () {
  return await api().get("/pages");
};

module.exports.getPagesById = async function (pageId) {
  return await api().get("/pages/" + pageId);
};
