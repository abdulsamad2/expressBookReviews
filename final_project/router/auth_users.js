const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require("express-session");

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const existUser = users.some((user) => user.username === username);
  if (existUser) return false;
  return true;
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  if (!user) return false;
  if (user.password !== password) return false;
  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  if (!authenticatedUser(username, password))
    return res.status(401).json({ message: "Invalid username or password" });
  const token = jwt.sign({ username }, "fingerprint_customer");
  req.session.token = token;
  req.session.username = username;
  req.session.save();

  return res.status(201).json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.session.username)
    return res.status(401).json({ message: "Unauthorized" });
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.username;

  if (!isbn) return res.status(400).json({ message: "ISBN is required" });
  if (!review) return res.status(400).json({ message: "Review is required" });

  // convert book objec to array
  const book = Object.keys(books).find((book) => books[book].isbn === isbn);

  if (!book) return res.status(404).json({ message: "Book not found" });
  Object.values(books)[book].reviews.push({
    user: username,
    rating: review.rating,
    comment: review.comment,
  });

  res.status(201).json({ message: "Review added successfully" });
  console.log(books);
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.session.username)
    return res.status(401).json({ message: "Unauthorized" });
  const { isbn } = req.params;
  const username = req.session.username;

  if (!isbn) return res.status(400).json({ message: "ISBN is required" });

  // convert book objec to array
  const book = Object.keys(books).find((book) => books[book].isbn === isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  //Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
  const filteredReviews = books[book].reviews.filter(
    (user) => user.user !== username
  );
  //now push this new reviews array to the books object
  books[book].reviews = filteredReviews;
  res.status(201).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
