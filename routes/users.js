var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Student = require('../models/student');
var Instructor = require('../models/instructor');

/* GET users listing. */

// Sign up
router.get('/signup', function(req, res, next) {
  res.render('user/signup', {title: 'Sign Up'});
});

router.post('/signup', function(req, res, next) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var type = req.body.type;

  // Validation with Express Validator
  req.checkBody('first_name', 'First name required.').notEmpty();
  req.checkBody('last_name', 'Last name required.').notEmpty();
  req.checkBody('email', 'Email required').notEmpty();
  req.checkBody('email', 'It must be a valid email address.').isEmail();
  req.checkBody('username', 'Username required.').notEmpty();
  req.checkBody('password', 'Password field is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

  errors = req.validationErrors();

  if(errors) {
    res.render('user/signup', {
      errors: errors
    });
  } else {
    // Create a user
    var newUser = new User({
      email: email,
      username: username,
      password: password,
      type: type
    });

    // Check type instructor or student, create users
    if(type == 'student') {
      console.log('Registering as student...');
      var newStudent = new Student({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username
      });
      console.log(newUser);
      // Save student in the user collection
      User.saveStudent(newUser, newStudent, function(err, user) {
        console.log('Student created!');
      });
    } else {
      console.log('Registering as instructor...');
      var newInstructor = new Instructor({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username
      });

      // Save instructor in the user collection
      User.saveInstructor(newUser, newInstructor, function(err, user) {
        console.log('Instructor created!');
      });
    }
    // Flash message
    req.flash('success', 'User added');
    res.redirect('/');
  }
});


// Sign in
router.get('/signin', function(req, res, next) {
  res.render('user/signin', {title: 'Sign In'});
});

module.exports = router;
