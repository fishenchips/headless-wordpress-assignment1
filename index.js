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

// Set up styling
app.use(express.static("public"));

/* --------- HOME PAGE ------ */
app.get("/", async (req, res) => {
  const pagesResponse = await api.getPages();
  const pages = pagesResponse.data;

  const postsResponse = await api.getPosts();
  const posts = postsResponse.data;

  res.render("home", {
    pages,
    posts,
    title: "Home",
    style: "home.css",
  });
});

/* ------- POST pages -------- */
app.get("/posts/:id", async (req, res) => {
  const postResponse = await api.getPostById(req.params.id);
  const post = postResponse.data;
  const postContent = post.content.rendered;
  const postTitle = post.title.rendered;
  res.render("post", {
    postContent,
    postTitle,
    style: "posts.css",
  });
});

/* --------- PAGE pages --------- */
app.get("/pages/:id", async (req, res) => {
  const pageResponse = await api.getPagesById(req.params.id);
  const page = pageResponse.data;
  const pageContent = page.content.rendered;
  const pageTitle = page.title.rendered;
  res.render("page", {
    pageContent,
    pageTitle,
    style: "pages.css",
  });
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
