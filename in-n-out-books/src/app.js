/**

* Author: Boyd Vigness
* Date: 6/21/2026
* File Name: app.js
* Description: Express server for the In-N-Out-Books application.
  */

const express = require("express");
const app = express();

app.use(express.json());

const books = require("../database/books");
// Root route
app.get("/", function (req, res) {
  const page =
    "<!DOCTYPE html>" +
    "<html lang='en'>" +
    "<head>" +
    "<meta charset='UTF-8'>" +
    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
    "<title>In-N-Out-Books</title>" +
    "<style>" +
    "body { font-family: Arial, sans-serif; margin: 0; background-color: lightgray; color: black; }" +
    "header { background-color: navy; color: white; text-align: center; padding: 30px; }" +
    "main { width: 80%; margin: 20px auto; }" +
    "section { background-color: white; padding: 20px; margin-bottom: 20px; border: 1px solid gray; border-radius: 8px; }" +
    "footer { background-color: navy; color: white; text-align: center; padding: 15px; }" +
    "ul { list-style-type: square; }" +
    "</style>" +
    "</head>" +
    "<body>" +

    "<header>" +
    "<h1>Welcome to In-N-Out-Books</h1>" +
    "</header>" +

    "<main>" +

    "<section>" +
    "<h2>Introduction</h2>" +
    "<p>In-N-Out-Books is an online platform where readers can organize, manage, and keep track of their favorite books. Whether you are an avid reader or part of a book club, this application makes it easy to manage your book collection.</p>" +
    "</section>" +

    "<section>" +
    "<h2>Top Selling Books</h2>" +
    "<ul>" +
    "<li>The Great Gatsby</li>" +
    "<li>Harry Potter</li>" +
    "<li>The Hobbit</li>" +
    "</ul>" +
    "</section>" +

    "<section>" +
    "<h2>Hours of Operation</h2>" +
    "<p>Monday - Friday: 9:00 AM - 6:00 PM</p>" +
    "<p>Saturday: 10:00 AM - 4:00 PM</p>" +
    "<p>Sunday: Closed</p>" +
    "</section>" +

    "<section>" +
    "<h2>Contact Information</h2>" +
    "<p>Email: support@innoutbooks.com</p>" +
    "<p>Phone: (402) 123-4567</p>" +
    "</section>" +

    "</main>" +

    "<footer>" +
    "<p>&copy; 2025 In-N-Out-Books</p>" +
    "</footer>" +

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