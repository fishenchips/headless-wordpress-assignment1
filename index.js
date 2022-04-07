require("dotenv").config();

const express = require("express");

const exphbs = require("express-handlebars");

//api caller via axios
const api = require("./axios-api-caller.js");

const app = express();

//Setup handlebars
app.engine(
  "exphbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs", //so we can name our files .hbs
  })
);

//view through handlebars
app.set("view engine", "exphbs");

//testing that call for api calls work
async function Main() {
  const postsResponse = await api.getPosts();
  const posts = postsResponse.data;
  console.log(posts);

  const postId = posts[0].id;
  const postResponse = await api.getPostById(postId);
  const post = postResponse.data;
  console.log(post);
}

Main();

/* app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
 */
