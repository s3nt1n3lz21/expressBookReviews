const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username) {
    return res.status(400).json({message: "Please enter a username"});
  }

  if (!password) {
    return res.status(400).json({message: "Please enter a password"});
  }

  if (users.includes(username)) {
    return res.status(409).json({message: "User with this username already exists"});
  } else {
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  return res.send(JSON.stringify(book, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let keys = Object.keys(books)
  let matchingBooks = []
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const item = books[key];
    if (item.author == author) {
        matchingBooks.push(item);
    }
  }
  return res.send(JSON.stringify(matchingBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let keys = Object.keys(books)
    let matchingBooks = []
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const item = books[key];
      if (item.title.includes(title)) {
          matchingBooks.push(item);
      }
    }
    return res.send(JSON.stringify(matchingBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    return res.send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
