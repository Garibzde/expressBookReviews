const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Missing username or password." });
});

public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks.then((bks) => {
        res.status(200).send(JSON.stringify(bks, null, 4));
    }).catch((err) => {
        res.status(500).json({ message: "Error fetching books list" });
    });
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const findBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    findBookByISBN.then((book) => {
        res.status(200).send(JSON.stringify(book, null, 4));
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {
        let booksByAuthor = {};
        for (let key in books) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                booksByAuthor[key] = books[key];
            }
        }
        if (Object.keys(booksByAuthor).length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("No books found for this author");
        }
    });

    getBooksByAuthor.then((matchingBooks) => {
        res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
        let booksByTitle = {};
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                booksByTitle[key] = books[key];
            }
        }
        if (Object.keys(booksByTitle).length > 0) {
            resolve(booksByTitle);
        } else {
            reject("No books found with this title");
        }
    });

    getBooksByTitle.then((matchingBooks) => {
        res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;