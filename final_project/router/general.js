const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  if (!books)
    return res.status(500).json({ message: "There is no book in databse" });
  return res.status(201).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  //books is object i need to filter it
  const filteredBook = Object.keys(books).filter(
    (key) => books[key].isbn === isbn
  );
  return res.status(201).json({ book: books[filteredBook] });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (!author) return res.status(400).json({ message: "Author is required" });
  //Write your code here
  const authorBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  return res.status(201).json({ books: authorBooks });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  if (!title) return res.status(400).json({ message: "title is required" });
  //Write your code here
  const titleBooks = Object.values(books).filter(
    (book) => book.title === title
  );
  return res.status(201).json({ books: titleBooks });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  //books is object i need to filter it
  const filteredBook = Object.keys(books).filter(
    (key) => books[key].isbn === isbn
  );
  console.log(filteredBook);
  return res.status(201).json({ review: books[filteredBook].reviews });
});

module.exports.general = public_users;
