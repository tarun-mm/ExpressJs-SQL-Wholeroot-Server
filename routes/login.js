var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { usertype, username, pass } = req.body

  var auth = "False";

  // console.log(email)
  // console.log(pass)
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
    var request2 = new Request("SELECT institutionname, passwords, planopted FROM [dbo].[institutions] WHERE institutionname='"+username+"' AND passwords='"+pass+"';", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      }    
    }).on("doneInProc", function (rowCount, more, rows) {
      console.log(rowCount);
      console.log(rows);
      if(auth === "True") res.send({ plan: rows[0][2]["value"], auth: auth })
      else res.send({ auth: auth })
      // connection.close();
      console.log("Close");
    });

    var request1 = new Request("SELECT username, passwords, usertype FROM [dbo].[allusers] WHERE EXISTS(SELECT username FROM [dbo].[allusers] WHERE username='"+username+"' AND passwords='"+pass+"')", function (
      err,
      rowCount,
      rows
    ) {
      if (err) {
        console.log(err);
      } 
      // console.log(rows)     
    }).on("doneInProc", function (rowCount, more, rows) {
      console.log(rowCount);
      console.log(rows);
      console.log(rows.length)
      console.log(username, pass, usertype)

      if(rows.length === 0) auth = "False"; 
      else auth = "True";
      
      console.log("Close");
    }).on("requestCompleted", function () {
      connection.execSql(request2);
    });
    
    connection.execSql(request1);
  });

  connection.connect();
});

module.exports = router;
