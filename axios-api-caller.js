const axios = require("axios").default;
//part of node
const fs = require("fs");

// https://redcapes.se
// http://hammarby.local

//Site info for home page
module.exports.getSiteInfo = async function () {
  //Creating cache file
  const cacheFileName = "cache/getSiteInfo";

  let content = undefined;

  //if the cache file already exists
  if (fs.existsSync(cacheFileName)) {
    //variable for the file's content
    const fileContent = fs.readFileSync(cacheFileName);
    const fileData = JSON.parse(fileContent);

    const oneHrAgo = Date.now() - 60 * 60 * 1000;

    // if time since file was saved is greater than one hour
    if (oneHrAgo < fileData.time) {
      content = fileData.content;
    }
  }
  //if the file doesnt exist (if content is still undefined)
  if (!content) {
    const response = await axios.get(process.env.BASE_URL);
    const time = Date.now();

    //have to convert otherwise [object] [object]
    const data = JSON.stringify({
      time: time,
      content: response.data,
    });
    //sending the name of the file, and what is saved in the file
    fs.writeFileSync(cacheFileName, data);

    content = response.data;
  }

  return content;
};

//base setting that are used for every call
function api() {
  return axios.create({
    baseURL: process.env.BASE_URL + "/wp/v2",
  }); //using built in process to reach my env url
}

//GET all posts
module.exports.getPosts = async function (pageNr) {
  //will create a cache file for each page
  const cacheFileName = "cache/getPosts" + pageNr;

  let content = undefined;

  if (fs.existsSync(cacheFileName)) {
    const fileContent = fs.readFileSync(cacheFileName);
    const fileData = JSON.parse(fileContent);

    const oneHrAgo = Date.now() - 60 * 60 * 1000;

    if (oneHrAgo < fileData.time) {
      content = {
        response: fileData.content,
        headers: fileData.headers,
      };
    }
  }
  if (!content) {
    const response = await api().get("/posts", {
      params: {
        per_page: 2,
        page: pageNr,
      },
    });
    const time = Date.now();

    const data = JSON.stringify({
      time: time,
      content: response.data,
      headers: response.headers,
    });

    fs.writeFileSync(cacheFileName, data);

    content = {
      response: response.data,
      headers: response.headers,
    };
  }

  return content;
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
