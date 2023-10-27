const express = require("express");
const app = express();
const port = 8000;
const path = require("path");
const publicPath = path.join(__dirname,"views");
const db = require("./configs/mongoose");

app.use(express.json());

// Then serve other static assets
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "./assets")));
app.use(express.static('views'));


// EJS Layouts
 
// Router
app.use("/", require("./router"));

app.set("view engine", "ejs");
app.listen(port,(err)=>{
    if (err) {
        console.log(`err at loading application`);
      }
      console.log(`Server is running at port ${port}`);
})