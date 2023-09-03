const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Task 7:
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      //data: password
      //password : password,
      username: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Task 8: done and tested
    isbn = parseInt(req.params.isbn);
    review = req.body.review;
    username = req.user.username;
    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).send(`The review for the isbn ${req.params.isbn} has been added/updated`);
    }
    return res.status(300).json({message: `Book with the isbn ${req.params.isbn} not found in data base`});
  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Task 9: 
    isbn = parseInt(req.params.isbn);
    username = req.user.username;
    if (books[isbn]) {
        delete books[isbn].reviews[username];
        return res.status(200).send(`The review for the isbn ${req.params.isbn} has been deleted`);
    }
    return res.status(300).json({message: `Book with the isbn ${req.params.isbn} not found in data base`});
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
