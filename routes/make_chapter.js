var express = require("express");
const { resolveScale } = require("tedious/lib/data-types/decimal");
var router = express.Router();

router.post("/", function (req, res, next) {
  const { chap_name, subj_name, inst_name } = req.body

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
    var request1 = new Request("exec [dbo].[resourcemaker] @TableName='"+chap_name+"', @institutename='"+inst_name+"',@subjectname='"+subj_name+"';", function (err) {
      if (err) {
        console.log(err);
      } 
      // console.log(rows)     
    }).on("requestCompleted", function () {
      res.send({ msg: "success" })
    });
    
    connection.execSql(request1);
  });

  connection.connect();
});

module.exports = router;
