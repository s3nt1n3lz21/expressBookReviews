const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let match = false;
    console.log(users)
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        if (user.username == username && user.password == password) {
            return true;
        }
    }
    return match;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password,
            username,
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in, token: " + accessToken);
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log(req)
  console.log(req.user)

  if (!req.user || !req.user.username) {
    return res.status(200).json({ message: "No username found" });
  }

  const username = req.user.username;
  const query = req.query;
  const review = query.review;
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!review) {
    return res.status(200).json({ message: "Please enter a review" });
  }

  if (!book) {
    return res.status(200).json({ message: "Book not found" });
  }

  const newBook = {...book}

  newBook.reviews[username] = review;
  books[isbn] = newBook;
  return res.status(200).json({ message: `Updated review of book with ISBN ${isbn} for user ${username}` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
