var express = require("express");
const { resolveScale } = require("tedious/lib/data-types/decimal");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { inst_name } = req.body

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
    var request1 = new Request("exec subjectselector @institutename='"+inst_name+"'", function (err) {
      if (err) {
        console.log(err);
      } 
      // console.log(rows)     
    }).on("doneInProc", function (rowCount, more, rows) {
      console.log(rowCount);
      console.log(rows);
      console.log(rows.length);
      if(rows.length !== 0) res.send({ rows: rows });
      // connection.close();
      console.log("Close");
    });
    
    connection.execSql(request1);
  });

  connection.connect();
});

module.exports = router;
