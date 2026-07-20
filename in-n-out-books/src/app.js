/**
* Author: Boyd Vigness
* Date: 7/19/2026
* File Name: app.js
* Description: Express server for the In-N-Out-Books application.
*/

const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

const books = require("../database/books");
const users = require("../database/users");


// Root route
app.get("/", function (req, res) {
  const page =
    "<!DOCTYPE html>" +
    "<html lang='en'>" +
    "<head>" +
    "<meta charset='UTF-8'>" +
    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
    "<title>In-N-Out-Books</title>" +
    "</head>" +
    "<body>" +
    "<h1>Welcome to In-N-Out-Books</h1>" +
    "</body>" +
    "</html>";

  res.send(page);
});


// GET all books
app.get("/api/books", async (req, res) => {
  try {
    const bookList = await books.find();
    res.status(200).json(bookList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET one book by id
app.get("/api/books/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Book id must be a number."
      });
    }

    const book = await books.findOne({ id });

    res.status(200).json(book);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST a new book
app.post("/api/books", async (req, res) => {
  try {
    const { id, title, author } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Book title is required."
      });
    }

    const newBook = { id, title, author };

    await books.insertOne(newBook);

    res.status(201).json(newBook);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// PUT update a book
app.put("/api/books/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Input must be a number"
      });
    }

    if (!req.body.title) {
      return res.status(400).json({
        message: "Bad Request"
      });
    }

    await books.updateOne(
      { id },
      {
        $set: {
          title: req.body.title,
          author: req.body.author
        }
      }
    );

    res.sendStatus(204);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// DELETE a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await books.deleteOne({ id });

    res.sendStatus(204);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


// POST login authentication route
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      throw {
        status: 400,
        message: "Bad Request"
      };
    }


    const user = users.data.find((user) => user.email === email);


    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw {
        status: 401,
        message: "Unauthorized"
      };
    }


    res.status(200).json({
      message: "Authentication successful"
    });


  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error"
    });
  }
});


// 404 middleware
app.use(function (req, res) {
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});


// 500 middleware
app.use(function (err, req, res, next) {
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});


module.exports = app;


// Start server
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log("Application started and listening on port " + PORT);
  });
}