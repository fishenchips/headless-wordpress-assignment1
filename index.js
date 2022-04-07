const express = require("express");

const exphbs = require("express-handlebars");

const app = express();

app.engine(
  "hbs",
  hbs.engine({
    defaultLayout: "main",
    extname: ".hbs", //so we can name our files .hbs
  })
);

//view through handlebars
app.set("view engine", "exphbs");

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
