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

  const siteInfo = await api.getSiteInfo();

  res.render("home", {
    pages,
    posts,
    title: "Home",
    style: "home.css",
    siteInfo,
  });
});

app.get("/posts", async (req, res) => {
  // page is page number (params {page: pagenr}
  let page = parseInt(req.query.page);

  //going automatically to page 1 if the page doenst exist
  if (isNaN(page)) {
    page = 1;
  }

  //try catch so site doesnt crash
  try {
    //adding pages for header
    const pagesResponse = await api.getPages();
    const pages = pagesResponse.data;

    const posts = await api.getPosts(page);
    //const posts = postsResponse.data;

    //inside posts we have access to headers -> "x-wp-totalpages"
    const totalPages = parseInt(posts.headers["x-wp-totalpages"]);

    const nextPageNr = page + 1;
    const prevPageNr = page - 1;

    //for the header
    const siteInfo = await api.getSiteInfo();

    res.render("posts", {
      title: "Posts",
      posts,
      pages,
      page,
      nextPageNr,
      prevPageNr,
      firstPage: page == 1,
      lastPage: page == totalPages,
      siteInfo,
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

  const post = await api.getPostById(req.params.id);

  const siteInfo = await api.getSiteInfo();

  res.render("post", {
    pages,
    post,
    style: "posts.css",
    //everything is now in the new object response
    title: post.response.title.rendered,
    siteInfo,
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

  const siteInfo = await api.getSiteInfo();

  res.render("page", {
    pages,
    pageContent,
    pageTitle,
    style: "pages.css",
    title: `${pageTitle}`,
    siteInfo,
  });
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
