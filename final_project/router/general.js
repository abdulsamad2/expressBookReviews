const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    } else if (!isValid(req.body.username)) {
      return res
        .status(400)
        .json({ message: "Username already exists create new one " });
    } else {
      users.push(req.body);
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    if (!books)
      return res.status(500).json({ message: "There is no book in database" });
    return res.status(201).json(books);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    if (!isbn) return res.status(400).json({ message: "ISBN is required" });

    const filteredBook = Object.values(books).find(
      (book) => book.isbn === isbn
    );
    if (!filteredBook)
      return res.status(404).json({ message: "Book not found" });

    return res.status(200).json({ book: filteredBook });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    if (!author) return res.status(400).json({ message: "Author is required" });

    const authorBooks = Object.values(books).filter(
      (book) => book.author === author
    );
    return res.status(200).json({ books: authorBooks });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const titleBooks = Object.values(books).filter(
      (book) => book.title === title
    );
    return res.status(200).json({ books: titleBooks });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book review
public_users.get("/review/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    if (!isbn) return res.status(400).json({ message: "ISBN is required" });

    const filteredBook = Object.values(books).find(
      (book) => book.isbn === isbn
    );
    if (!filteredBook)
      return res.status(404).json({ message: "Book not found" });

    return res.status(200).json({ review: filteredBook.reviews });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.general = public_users;
