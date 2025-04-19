const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
  let userWithSameName = users.filter((user)=>{
    return user.username === username;
});
return userWithSameName.length>0;
};

const authenticatedUser = (username,password)=>{ //returns boolean
  console.log("Users array:", users);  // Debugging
  let validusers = users.filter((user)=>{
    return user.username === username && user.password === password;
  });
  console.log("Found matching users:", validusers);  // Debugging
return validusers.length >0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in; both username & password are required" });
  }

  if (authenticatedUser(username, password)) {
    console.log("Authentication successful for user:", username); // Debugging
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Get username from session (set during login)
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or modify the review
  if (books[isbn].reviews[username]) {
    // If a review from the same user exists, modify it
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review updated successfully",
      reviews: books[isbn].reviews
    });
  } else {
    // If no review exists from this user, add it
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added successfully",
      reviews: books[isbn].reviews
    });
  }
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username; // Get username from session

  if (!username) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists and belongs to the logged-in user
  if (books[isbn].reviews[username]) {
      // Delete the review for the logged-in user
      delete books[isbn].reviews[username];
      return res.status(200).json({
          message: "Review deleted successfully",
          reviews: books[isbn].reviews
      });
  } else {
      return res.status(404).json({ message: "Review not found for this user" });
  }
});








module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
