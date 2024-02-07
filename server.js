'use strict';

// express
const express = require('express');
const request = require('request');
const path = require(`path`);
const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));

// handlebars
const handlebars = require('express-handlebars');
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts/',
    extName: 'hbs'}));

// sqlite
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':recipefinder', (err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');
  // create tables if needed
  db.run('CREATE TABLE IF NOT EXISTS Users (username TEXT UNIQUE, password TEXT, PRIMARY KEY(username));'), (err) => {
    if (err) {
      throw err;
    }
    else {
      console.log('Users table created successfully.');
    }
  }
  console.log('Users table ready for use.')
  db.run('CREATE TABLE IF NOT EXISTS Recipes (id INT, username TEXT, rating INT, PRIMARY KEY(id));'), (err) => {
    if (err) {
      throw err;
    }
    else {
      console.log('Recipes table created successfully.');
    }
  }
  console.log('Recipes table ready for use.');
});

// // close the database connection
// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Closed the database connection.');
// });


/* ------------- Begin Controller Functions ------------- */

app.get("/", (req, res) => {
  var login = undefined;
  if (req.query.login) {
    login = req.query.login;
  }
  res.render('home.hbs', {layout: 'base.hbs', login: login});
});

app.get("/login", (req, res) => {
  var login = undefined;
  if (req.query.login) {
    login = req.query.login;
  }
  res.render('login.hbs', {layout: 'base.hbs', login: login});
})

app.get("/verify-login", (req, res) => {
  var username, password;
  username = req.query.loginuser;
  password = req.query.loginpassword;
  // missing field
  if (!username || !password) {
    res.redirect('/error?error=err4');
  }
  else {
    let sql = `SELECT username, password FROM Users WHERE username = ?;`
    db.get(sql, [username], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      if (row) {
        // successful login, redirect to home page
        if (row.password == password) {
          res.redirect(`/?login=${username}`);
        }
        else {
          // incorrect password
          res.redirect('/error?error=err2');
        }
      } else {
        // username does not exist
        res.redirect('/error?error=err1');
      }
    });
  }
})

app.post("/register", (req, res) => {
  var username, password;
  username = req.body.registeruser;
  password = req.body.registerpassword;
  // missing field
  if (!username || !password) {
    res.redirect('/error?error=err4');
  }
  else {
    let sql = `SELECT username, password FROM Users WHERE username = ?;`
    db.get(sql, [username], (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      if (row) {
        // user exists, redirect to error page
        res.redirect('/error?error=err3');
      } else {
        // add new username, password to Users
        let sql = `INSERT INTO Users(username, password) VALUES(?, ?);`
        db.run(sql, [username, password], (err) => {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Added ${username} with password ${password} to Users table.`);
          res.redirect(`/?login=${username}`);
        })
      }
    });
  }
})

app.get("/error", (req, res) => {
  var login = undefined;
  if (req.query.login) {
    login = req.query.login;
  }
  // err1: username not found
  // err2: incorrect password
  // err3: user already exists
  // err4: empty field
  var error = req.query.error;
  if (req.query.error == 'err1') {
    error = "ERROR! Username does not exist. Please try again.";
  } 
  if (req.query.error == 'err2') {
    error = "ERROR! Password is incorrect. Please try again.";
  }
  if (req.query.error == 'err3') {
    error = "ERROR! Username is taken. Please try again.";
  }
  if (req.query.error == 'err4') {
    error = "ERROR! One or more empty fields. Please try again.";
  }
  res.render('error.hbs', {layout: 'base.hbs', error: error, login: login});
})

app.get("/search", (req, res) => {
  var login = undefined;
  if (req.query.login) {
    login = req.query.login;
  }
  res.render('search.hbs', {layout: 'base.hbs', login: login});
})

app.get("/my-recipes", (req, res) => {
  var login = undefined;
  if (req.query.login) {
    login = req.query.login;
  }
  res.render('myrecipes.hbs', {layout: 'base.hbs', login: login});
})

app.get("/surprise-me", (req, res) => {
  var login = undefined;
  if (req.query.login) {
    login = req.query.login;
  }
  res.render('surprise.hbs', {layout: 'base.hbs', login: login});
})

/* ------------- End Controller Functions ------------- */

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

