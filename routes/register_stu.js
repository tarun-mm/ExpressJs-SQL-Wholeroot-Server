var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { username, pass, inst_name, clas, section } = req.body
  
  var Connection = require("tedious").Connection;
  var config = {
    server: "wholeroot.database.windows.net", //update me
    authentication: {
      type: "default",
      options: {
        userName: "darshag", //update me
        password: "qwerty@123", //update me
      },
    },
    options: {
      // If you are on Microsoft Azure, you need encryption:
      encrypt: true,
      database: "attendees", //update me
      rowCollectionOnDone: true
    },
  };
  var connection = new Connection(config);

  var Request = require("tedious").Request;

  connection.on("connect", function (err) {
    if (err) {
      console.log(err);
    }
    // If no error, then good to proceed.
    console.log("Connected");

    // sql

    var request3 = new Request("UPDATE allstudents  SET registeration_no = allusers.registeration_no FROM allstudents, allusers WHERE allusers.usertype='student' AND allstudents.username=allusers.username;", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      }    
    }).on("requestCompleted", function () {
      res.send({ msg: "success"})
    })

    var request2 = new Request("INSERT INTO allstudents (username, passwords, institutionname, class, section) VALUES ('"+username+"', '"+pass+"', '"+inst_name+"', '"+clas+"', '"+section+"');", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      }    
    }).on("requestCompleted", function () {
      connection.execSql(request3);
    });

    var request1 = new Request("INSERT INTO allusers (username, usertype, passwords, institutionname, class, section) VALUES ('"+username+"', 'student', '"+pass+"', '"+inst_name+"', '"+clas+"', '"+section+"');", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      }    
    }).on("requestCompleted", function () {
      connection.execSql(request2);
    });
    
    connection.execSql(request1);

    
  });

  connection.connect();
});

module.exports = router;
