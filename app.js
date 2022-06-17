const express = require("express");
const app = express();
const PORT = 8000;
const fs = require("fs");

//setting pug for frontend
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Running ${PORT}`);
});
