var express = require("express");
const { request } = require("../app");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { inst_name, email, pass, plan_opted } = req.body
  
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
    
    var request5 = new Request("UPDATE institutions SET registeration_no = allusers.registeration_no FROM institutions, allusers WHERE allusers.usertype='institution' AND institutions.InstitutionName=allusers.institutionname;", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      }    
    }).on("requestCompleted", function () {
      res.send({ msg: "success"})
    });

    var request4 = new Request("INSERT into institutions (InstitutionName, passwords, planopted, emailid) VALUES ('"+inst_name+"', '"+pass+"', '"+plan_opted+"', '"+email+"');", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      }    
    }).on("requestCompleted", function () {
      connection.execSql(request5);
    });

    var request3 = new Request("INSERT INTO allusers (username, usertype, passwords, institutionname) VALUES ('"+inst_name+"', 'institution', '"+pass+"', '"+inst_name+"');", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      }    
    }).on("requestCompleted", function () {
      connection.execSql(request4);
    });

    var request2 = new Request("EXEC institutiontablebuilderstudents @TableName='"+inst_name+"';", function (
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

    var request1 = new Request("EXEC institutiontablebuilderteachers @TableName='"+inst_name+"';", function (
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
    
    if(plan_opted === "free") connection.execSql(request3);
    else connection.execSql(request1);
  });

  connection.connect();
});

module.exports = router;
