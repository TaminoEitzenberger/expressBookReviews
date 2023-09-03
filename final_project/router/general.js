const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // Taks 6: done and tested
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Task 1: Done and tested
    //return res.status(200).send(books);
    // Task 11:

    async function getAllBooks() {
        const result = books;
        res.status(200).send(books);
    }
    getAllBooks();
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    /*// Task 2: Done and tested
    isbn = parseInt(req.params.isbn);
    book = books[isbn];
    if (book) {
        return res.status(200).send(book);
    }
    return res.status(300).json({message: `Book with the isbn ${req.params.isbn} not found in data base`});*/
    
    // Taks 11:
    
    let getBookByISBN = new Promise((resolve, reject) => {
        isbn = parseInt(req.params.isbn);
        book = books[isbn];
        if (book) {
            resolve(book);
        }
        else {
            reject(new Error(`Book with the isbn ${req.params.isbn} not found in data base`))
        }
    })

    getBookByISBN.then((book) => {
        res.status(200).send(book);
    })
    .catch(err => {
        res.status(500).send(err.message);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    /*// Task 3: done and tested
    author = req.params.author;
    filtered_books = {};
    for (let isbn in books) {
        if (books[isbn].author == author) {
            filtered_books[isbn] = books[isbn];
        }
    }
    return res.status(200).send(filtered_books);*/

    // Task 12:
    let getBooksByAuthor = new Promise((resolve, reject) => {
        author = req.params.author;
        filtered_books = {};
        for (let isbn in books) {
            if (books[isbn].author == author) {
                filtered_books[isbn] = books[isbn];
            }
        }
        if (Object.keys(filtered_books).length > 0) {
            resolve(filtered_books);
        }
        else {
            reject(new Error(`No books with the author ${author} in data base`))
        }
    })

    getBooksByAuthor.then((book) => {
        res.status(200).send(book);
    })
    .catch(err => {
        res.status(500).send(err.message);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    /*// Task 4: done and tested
    title = req.params.title;
    filtered_books = {};
    for (let isbn in books) {
        if (books[isbn].title == title) {
            filtered_books[isbn] = books[isbn];
        }
    }
    return res.status(200).send(filtered_books);*/

    // Taks 13:
    let getBookByTitle = new Promise((resolve, reject) => {
        title = req.params.title;
        filtered_books = {};
        for (let isbn in books) {
            if (books[isbn].title == title) {
                filtered_books[isbn] = books[isbn];
            }
        }
        if (Object.keys(filtered_books).length > 0) {
            resolve(filtered_books);
        }
        else {
            reject(new Error(`No books with the title ${title} in data base`))
        }
    })

    getBookByTitle.then((book) => {
        res.status(200).send(book);
    })
    .catch(err => {
        res.status(500).send(err.message);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Taks 5: Done and tested
  isbn = parseInt(req.params.isbn);
    book = books[isbn];
    if (book) {
        return res.status(200).send(book.reviews);
    }
    return res.status(300).json({message: `Book with the isbn ${req.params.isbn} not found in data base`});
});

module.exports.general = public_users;
