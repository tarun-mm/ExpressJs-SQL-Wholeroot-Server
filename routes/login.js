var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { usertype, username, pass } = req.body
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
    var request = new Request("SELECT username, passwords, usertype FROM [dbo].[allusers] WHERE EXISTS(SELECT username FROM [dbo].[allusers] WHERE username='"+username+"')", function (
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
      console.log(username, pass, usertype)
      if(rows.length === 0 || rows[0][1]["value"] != pass || rows[0][2]["value"] != usertype) res.send({ auth: "False" }); 
      else res.send({ auth: "True" })
      // connection.close();
      console.log("Close");
    });
    
    connection.execSql(request);
  });

  connection.connect();
});

module.exports = router;
