const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
var os = require("os");


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).send( "User successfully registered. Now you can login" + os.EOL);
        } else {
            return res.status(404).send( "User already exists!" + os.EOL);
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user." + os.EOL});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  const get_books = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books,null,4) + os.EOL)
  })
  get_books.then((successMessage) => {
    res.send(successMessage)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const get_books_by_isbn = new Promise((resolve,reject) => {
    const ISBN = req.query.isbn
    // Retrieve the email parameter from the request URL and send the corresponding friend's details
   resolve(books.filter(book => book.isbn === ISBN))
 })
  get_books_by_isbn.then((successMessage) => {
    res.send(successMessage)
  })
 });
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const get_books_by_author = new Promise((resolve,reject) => {
    const Author = req.query.author
    resolve(books.filter(book => book.author === Author))
  })
  get_books_by_author.then((successMessage) => {
  res.send(successMessage)
  })
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const get_books_by_title = new Promise((resolve,reject) => {
    const Title = req.query.title
    resolve(books.filter(book => book.title === Title))
  })
  get_books_by_title.then((successMessage) => {
    res.send(successMessage)
  })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 // Retrieve the email parameter from the request URL and send the corresponding friend's details
 const get_reviews = new Promise((resolve,reject) => {
  const ISBN = req.query.isbn;
  resolve(books.filter(book => book.isbn === ISBN).map(Book => Book.reviews))
 })
 get_reviews.then((successMessage) => {
  res.send(successMessage)
 })
});


module.exports.general = public_users;

