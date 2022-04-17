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

app.get("/posts", async (req, res) => {
  // page is page number (params {page: pagenr}
  let page = parseInt(req.query.page);

  console.log({ page });

  //going automatically to page 1 if the page doenst exist
  if (isNaN(page)) {
    page = 1;
  }

  //try catch so site doesnt crash
  try {
    //adding pages for header
    const pagesRespone = await api.getPages();
    const pages = pagesRespone.data;

    const postsResponse = await api.getPosts(page);
    const posts = postsResponse.data;

    //inside postResponse we have access to headers -> "x-wp-totalpages"
    console.log(postsResponse);

    const totalPages = parseInt(postsResponse.headers["x-wp-totalpages"]);

    const nextPageNr = page + 1;
    const prevPageNr = page - 1;

    res.render("posts", {
      title: "Posts",
      posts,
      pages,
      page,
      nextPageNr,
      prevPageNr,
      firstPage: page == 1,
      lastPage: page == totalPages,
    });
  } catch (error) {
    res.render("error", {
      title: "Error | 404",
      errorMsg: "Page doesn't exist.",
    });
  }
});

/* ------- POST pages -------- */
app.get("/posts/:id", async (req, res) => {
  const pagesResponse = await api.getPages();
  const pages = pagesResponse.data;

  const postResponse = await api.getPostById(req.params.id);
  const post = postResponse.data;
  const postContent = post.content.rendered;
  const postTitle = post.title.rendered;
  res.render("post", {
    pages,
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
