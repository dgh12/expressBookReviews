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
  res.send(JSON.stringify(books,null,4) + os.EOL);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the email parameter from the request URL and send the corresponding friend's details
  const ISBN = req.query.isbn;
  const book = books.filter(book => book.isbn === ISBN);
  res.send(book);
 });
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const Author = req.query.author
  const book = books.filter(book => book.author === Author);
  res.send(book);
  res.send(os.EOL);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const Title = req.query.title
  const book = books.filter(book => book.title === Title);
  res.send(book);
  res.send(os.EOL);
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 // Retrieve the email parameter from the request URL and send the corresponding friend's details
 const ISBN = req.query.isbn;
 const book = books.filter(book => book.isbn === ISBN);
 const review = book.map(Book => Book.reviews);
 res.send(review);
 res.send(os.EOL);
});


module.exports.general = public_users;

