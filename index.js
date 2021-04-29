const express = require("express");
const path = require("path");
require('dotenv').config();
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//server config
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false })); // <--- middleware configuration


//start the server
app.listen(3000, () => { {
    console.log("Server started (http://localhost:3000/) !");
  }});

// GET /
app.get("/", (request, response) => {
    // res.send("Hello world...");
    response.render("index");
  });


//about
app.get("/about", (req, res) => {
    res.render("about");
  });

  //data
  app.get("/data", (req, res) => {
    const test = {
      title: "Test",
      items: ["one", "two", "three"]
    };
    res.render("data", { model: test });
  });

  app.get("/books", (req, res) => {
    const sql = "SELECT * FROM Books ORDER BY Title"
    pool.query(sql, [], (err, result) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("books", { model: result.rows });
    });
  });

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = $1";
  pool.query(sql, [id], (err, result) => {
    // if (err) ...
    res.render("edit", { model: result.rows[0] });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.title, req.body.author, req.body.comments, id];
  const sql = "UPDATE Books SET Title = $1, Author = $2, Comments = $3 WHERE (Book_ID = $4)";
  pool.query(sql, book, (err, result) => {
    // if (err) ...
    res.redirect("/books");
  });
});

// GET /create
app.get("/create", (req, res) => {
  const book = {
    Author: "Victor Hugo"
  }
  res.render("create", { model: book });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Books (Title, Author, Comments) VALUES ($1, $2, $3)";
  const book = [req.body.title, req.body.author, req.body.comments];
  pool.query(sql, book, (err, result) => {
    // if (err) ...
    res.redirect("/books");
  });
});

// // GET /delete/5
// app.get("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "SELECT * FROM Books WHERE Book_ID = $1";
//   pool.query(sql, [id], (err, result) => {
//     // if (err) ...
//     res.render("delete", { model: result.rows[0] });
//   });
// });

// // POST /delete/5
// app.post("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "DELETE FROM Books WHERE Book_ID = $1";
//   pool.query(sql, [id], (err, result) => {
//     // if (err) ...
//     res.redirect("/books");
//   });
// });