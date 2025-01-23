const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const os = require("os");

let users = [];

const isValid = (username)=>{ 
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" + os.EOL});
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in" + os.EOL + accessToken + os.EOL);
    } else {
        return res.status(208).send( "Invalid Login. Check username and password" + os.EOL);
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const ISBN = req.query.isbn;
    const Isbn = ISBN -1;
    const username = req.body.username;
    if(ISBN){
      let review_posted = req.body.review;
        if(review_posted){
            const book = books.filter(book => book.isbn === ISBN);
            book.forEach(function (book) {
                book["reviews"][username] =  review_posted;
                books[Isbn] = book;
            });
        }
        return res.status(200).send( "review successfuly added" + os.EOL);
    }

});

regd_users.delete("/auth/delete_review/:isbn", (req, res) => {

    const ISBN = req.query.isbn;
    const Isbn = ISBN -1;
    const username = req.query.username;
    if(ISBN){
        if(username){
            const book = books.filter(book => book.isbn === ISBN);
            book.forEach(function (book) {
                delete book["reviews"][username];
                books[Isbn] = book;
            });
        }
        return res.status(200).send( "review successfuly deleted" + os.EOL);
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
