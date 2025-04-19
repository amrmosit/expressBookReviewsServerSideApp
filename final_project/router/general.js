const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  // Check is the username or password are missing
  if (!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  // Check if the username already exists
  if (users[username]){
    return res.status(409).json({ message: "Username already exists." });
  }
  // Register the user
  users.push({ username, password });
  console.log("Current users:", users);  // Debugging
  return res.status(201).json({ message: "User registered successfully."});
});
/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify({books}), null, 4);
});
*/
// or using async/await
/*
public_users.get('/', async function (req, res) {
  try {
    const data = await new Promise((resolve, reject) => {
      resolve(books);
    });

    res.status(200).send(JSON.stringify({ books: data }, null, 4));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
});
*/
// or using Promise
function getBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

public_users.get('/', function (req, res) {
  getBooks()
    .then(data => {
      res.status(200).send(JSON.stringify({ books: data }, null, 4));
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to fetch books", error: err.message });
    });
});

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Extract the isbn parameter from the request parameters
  const isbn = req.params.isbn;
  // Access the book using the ISBN key
  const book = books[isbn];
  if (book){
    //if the book exists, send it as the response
    res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  } 
 });
 */
// or using Async/Await 
// Get book details based on ISBN using async/await
/*
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const book = await new Promise((resolve, reject) => {
      const found = books[isbn];
      if (found) {
        resolve(found);
      } else {
        reject(new Error("Book not found"));
      }
    });

    res.status(200).send(JSON.stringify(book, null, 4));
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});
*/
// or Promise Callback Version
// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => {
    res.status(200).send(JSON.stringify(book, null, 4));
  })
  .catch(err => {
    res.status(404).json({ message: err });
  });
});


// Get book details based on author
/*
public_users.get('/author/:author',function (req, res) {
  // Extract the Author parameter from the request parameters
  const author = req.params.author;
  // Create an array of books that match the author
  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  if (filteredBooks.length>0){
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  } 
});
*/
// or rewrite the route using async/await and a Promise
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
    const data = await new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === author
      );

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("Book not found"));
      }
    });

    res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Get all books based on title
/*
public_users.get('/title/:title',function (req, res) {
  // Extract the title parameter from the request parameters
  const title = req.params.title;
  // Create an array of books that match the title
  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (filteredBooks.length>0){
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  } 
});
*/
// or rewritten using async/await with a Promise
// Get all books based on title using async/await and Promise
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const data = await new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        book => book.title.toLowerCase() === title
      );

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("Book not found"));
      }
    });

    res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Extract the isbn parameter from the request parameters
    const isbn = req.params.isbn;
    // Find the book with the corresponding ISBN
    const book = books[isbn];
    // Check if the book exists
    if (book){
      //check if the book has reviews
      if (Object.keys(book.reviews).length >0){
        // Send the reviews as the response 
        res.status(200).send(JSON.stringify(book.reviews, null, 4));
      } else {
        // If there is no reviews available
        res.status(404).json({message: "no reviews found for this book"});
      }

    } else {
      // if the book is not found
      res.status(404).json({message: "Book not found"});
    } 
});









module.exports.general = public_users;
