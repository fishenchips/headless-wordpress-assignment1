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
    title: `${postTitle}`,
  });
});

/* --------- PAGE pages --------- */
app.get("/pages/:id", async (req, res) => {
  const pagesRespone = await api.getPages();
  const pages = pagesRespone.data;

  const pageResponse = await api.getPagesById(req.params.id);
  const page = pageResponse.data;
  const pageContent = page.content.rendered;
  const pageTitle = page.title.rendered;
  res.render("page", {
    pages,
    pageContent,
    pageTitle,
    style: "pages.css",
    title: `${pageTitle}`,
  });
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
