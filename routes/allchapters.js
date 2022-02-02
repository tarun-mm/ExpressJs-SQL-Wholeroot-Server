var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { subj_name, inst_name } = req.body
  
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
    var request = new Request("exec chapterselector @institutename='"+inst_name+"',@subjectname='"+subj_name+"';", function (
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
      console.log(rows.length);
      if(rows.length !== 0) res.send({ rows: rows });
      // connection.close();
      console.log("Close");
    });
    
    connection.execSql(request);
  });

  connection.connect();
});

module.exports = router;
