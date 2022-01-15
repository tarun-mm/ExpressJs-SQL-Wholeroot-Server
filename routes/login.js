var express = require("express");
var router = express.Router();

// request = new Request("EXEC intitutiontablebuilderteachers @TableName='test';", function(err){
//     if (err){
//         console.log(err);
//     }
// })
// connection.execSql(request);

router.get("/", function (req, res, next) {
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
    var request = new Request("SELECT * from allusers;", function (
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
      // connection.close();
      console.log("Close");
    });
    
    connection.execSql(request);
  });

  connection.connect();
  res.send("HI");
});

module.exports = router;
