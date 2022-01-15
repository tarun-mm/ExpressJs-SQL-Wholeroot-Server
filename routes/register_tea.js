var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { username, pass, inst_name, clas, subjects } = req.body
  
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

    var request3 = new Request("UPDATE allteachers  SET registeration_no = allusers.registeration_no FROM allteachers, allusers WHERE allusers.usertype='teacher' AND allteachers.username=allusers.username;", function (
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

    var request2 = new Request("INSERT INTO allteachers (username, passwords, institutionname, class, subjects) VALUES ('"+username+"', '"+pass+"', '"+inst_name+"', '"+clas+"', '"+subjects+"');", function (
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

    var request1 = new Request("INSERT INTO allusers (username, usertype, passwords, institutionname, class, subjects) VALUES ('"+username+"', 'teacher', '"+pass+"', '"+inst_name+"', '"+clas+"', '"+subjects+"');", function (
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
