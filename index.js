require("dotenv").config();

const express = require("express");

const exphbs = require("express-handlebars");

//api caller via axios
const api = require("./axios-api-caller.js");

const app = express();

//Setup handlebars
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs", //so we can name our files .hbs
  })
);

//view through handlebars
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  const pagesResponse = await api.getPosts();
  const pages = pagesResponse.data;

  const postsResponse = await api.getPosts();
  const posts = postsResponse.data;

  res.render("home", { pages });
});

app.get("/posts/:id", async (req, res) => {
  const postResponse = await api.getPostById(req.params.id);
  const post = postResponse.data;
  const postContent = post.content.rendered;
  const postTitle = post.title.rendered;
  res.render("post", { post, postContent, postTitle });
});

//testing that call for api calls work
/* async function Main() {
  const postsResponse = await api.getPosts();
  const posts = postsResponse.data;
  console.log(posts);


    place in another page later
        const postsResponse = await api.getPosts();
        const posts = postsResponse.data;
        res.render("home", { posts });



  const postId = posts[0].id;
  const postResponse = await api.getPostById(postId);
  const post = postResponse.data;
  console.log(post.title.rendered);
} 

Main();*/

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
