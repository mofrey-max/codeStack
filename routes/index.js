  var express = require('express');
  var router = express.Router();
  var User = require('../models/user');

  router.get('/index', function(req, res, next) {
      return res.render('index.ejs');
  });


  router.post('/index', function(req, res, next) {
      console.log(req.body);
      var personInfo = req.body;


      if (!personInfo.email || !personInfo.username || !personInfo.fullName || !personInfo.phoneNumber || !personInfo.address || !personInfo.password || !personInfo.passwordConf) {
          res.send();
      } else {
          if (personInfo.password == personInfo.passwordConf) {

              User.findOne({ email: personInfo.email }, function(err, data) {
                  if (!data) {
                      var c;
                      User.findOne({}, function(err, data) {

                          if (data) {
                              console.log("if");
                              c = data.unique_id + 1;
                          } else {
                              c = 1;
                          }

                          var newPerson = new User({
                              unique_id: c,
                              email: personInfo.email,
                              username: personInfo.username,
                              fullName: personInfo.fullName,
                              phoneNumber: personInfo.phoneNumber,
                              address: personInfo.address,
                              password: personInfo.password,
                              passwordConf: personInfo.passwordConf
                          });

                          newPerson.save(function(err, Person) {
                              if (err)
                                  console.log(err);
                              else
                                  console.log('Success');
                          });

                      }).sort({ _id: -1 }).limit(1);
                      res.send({ "Success": "You are registered,You can login now." });
                  } else {
                      res.send({ "Success": "Email is already used." });
                  }

              });
          } else {
              res.send({ "Success": "password is not matched" });
          }
      }
  });

  router.get('/', function(req, res, next) {
      return res.render('login.ejs');
  });

  router.post('/', function(req, res, next) {
      //console.log(req.body);
      User.findOne({ username: req.body.username }, function(err, data) {
          if (data) {

              if (data.password == req.body.password) {
                  //console.log("Done Login");
                  req.session.userId = data.unique_id;
                  //console.log(req.session.userId);
                  res.send({ "Success": "Success!" });

              } else {
                  res.send({ "Success": "Wrong password!" });
              }
          } else {
              res.send({ "Success": "Invalid Invalid Username!" });
          }
      });
  });

  router.get('/profile', function(req, res, next) {
      console.log("profile");
      User.findOne({ unique_id: req.session.userId }, function(err, data) {
          console.log("data");
          console.log(data);
          if (!data) {
              res.redirect('/');
          } else {
              //console.log("found");
              return res.render('dashboard.ejs', {
                  "fullName": data.fullName,
                  "name": data.username,
                  "email": data.email,
                  "phoneNumber": data.phoneNumber,
                  "address": data.address,
              });
          }
      });
  });

  function updateRecord(req, res) {
      User.findOne({ _id: req.body.id }, (err, doc) => {
          //this will give you the document what you want to update.. then 
          doc.name = req.body.name;

          // then save that document
          doc.save(callback);

      });

  }

  router.get('/logout', function(req, res, next) {
      console.log("logout")
      if (req.session) {
          // delete session object
          req.session.destroy(function(err) {
              if (err) {
                  return next(err);
              } else {
                  return res.redirect('/');
              }
          });
      }
  });

  router.get('/forgetpass', function(req, res, next) {
      res.render("forget.ejs");
  });

  router.post('/forgetpass', function(req, res, next) {
      //console.log('req.body');
      //console.log(req.body);
      User.findOne({ email: req.body.email }, function(err, data) {
          console.log(data);
          if (!data) {
              res.send({ "Success": "This Email Is not registered!" });
          } else {
              // res.send({"Success":"Success!"});
              if (req.body.password == req.body.passwordConf) {
                  data.password = req.body.password;
                  data.passwordConf = req.body.passwordConf;

                  data.save(function(err, Person) {
                      if (err)
                          console.log(err);
                      else
                          console.log('Success');
                      res.send({ "Success": "Password changed!" });
                  });
              } else {
                  res.send({ "Success": "Password does not matched! Both Password should be same." });
              }
          }
      });

  });






  module.exports = router;