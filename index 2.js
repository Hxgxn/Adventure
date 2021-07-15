var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var url = require("url");

function registerUser(name, password) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "adventure",
      });

    var current_date = new Date().getTime()
    var hash = require("crypto").createHash("sha256").update(password).digest("hex");

      con.connect(function(err) {
        if (err) throw err;
        var sql = "INSERT INTO user (name, passwort, created_at, last_login, aktiv, level) VALUES ('"+ name +"', '" + hash + "', '" + current_date + "', '" +  current_date + "', True,  1);";
        con.query(sql, function(err, result) {
            if (err) throw err;
        });
      });
}

function makeLogin(name, password) {
  console.log("Doing Login!");
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "adventure",
  });

  var current_date = new Date().getTime()
  var hash = require("crypto").createHash("sha256").update(password).digest("hex");

  con.connect(function(err) {
    if (err) throw err;
    // var sql = "UPDATE user SET last_login = '" + current_date + "' WHERE (name='" + name + "' AND passwort='" + hash + "');";
    var sql = "SELECT * FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');";
    console.log(sql);
    con.query(sql, function(err, result) {
        console.log(result.length);
        if (err) throw err;
        if (result.length > 0) {
          console.log("Login erfolgreich!")
          var sql2 = "UPDATE user SET last_login = '" + current_date + "' WHERE (name='" + name + "' AND passwort='" + hash + "');";
          con.query(sql2, function(error, results) {
            if (error) throw error;
            console.log(results);
          })
        } else {
          console.log("Login falsch!")
        }
    });
  });
}

function addResource(name, password, resource_id, value, qualified=false) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "adventure",
  });

  con.connect(function(err) {
    var hash = require("crypto").createHash("sha256").update(password).digest("hex");
    var sql = "SELECT id FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');"
    con.query(sql, function(error1, result1) {
      var user_id = result1[0].id;
      if (error1) throw error1;
      var sql2 = "SELECT * FROM resources WHERE (user_id=" + user_id + " AND resource_id=" + resource_id + ");"
      con.query(sql2, function(error2, result2) {
        if (error2) throw error2;
        if (result2.length == 0) {
          var current_date = new Date().getTime()
          var sql3 = "INSERT INTO resources (user_id, resource_id, value, last_update) VALUES (" + user_id + ", " + resource_id + ", " + parseInt(value) + ", " + current_date + ");"
          con.query(sql3, function(error3, result3) {
            if (error3) throw error3;
            console.log("Neuer Datensatz erstellt!");
          })
          console.log("Keine Ergebnisse gefunden!");
        } else {
          var alreadyThere = parseInt(result2[0].value);
          if (qualified) {
            var sql4 = "UPDATE resources SET (value=" + String(alreadyThere + parseInt(value)) + ", last_update=" + current_date + ") WHERE (user_id=" + user_id + " AND resource_id=" + resource_id + ");";
            con.query(sql4, function(error4, result4) {
              if (error4) throw error4;
              console.log("Datenbestand geupdated mit Zeit!")
            })  
          }
          var sql4 = "UPDATE resources SET value=" + String(alreadyThere + parseInt(value)) + " WHERE (user_id=" + user_id + " AND resource_id=" + resource_id + ");";
            con.query(sql4, function(error4, result4) {
              if (error4) throw error4;
              console.log("Datenbestand geupdated!")
        })
      }
    })
  })
})
}



http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    const queryObject = url.parse(req.url,true).query;
    if (pathname.startsWith("/call/validateLogin")) {
      console.log(makeLogin(queryObject.name, queryObject.passwort));
    } else if (pathname.startsWith("/call/registerUser")) {
      registerUser(queryObject.name, queryObject.passwort);
    } else if (pathname.startsWith("/call/addResources")) {
      addResource(queryObject.name, queryObject.passwort, queryObject.resource_id, queryObject.value, queryObject.qualified);
    } else if (pathname.startsWith("/login")) {
      fs.readFile("./templates/login/login.html", 'utf8', function(error, data) {
        res.end(data);
      });
    } else if (pathname.startsWith("/files/images/")) {
      if (pathname.includes("login")) {
        var filePath = "./files/images/logo2.png";
        var stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'Image',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      } else if (pathname.includes("name")) {
        var filePath = "./files/images/name.png";
        var stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'Image',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      } else if (pathname.includes("passwort")) {
        var filePath = "./files/images/passwort.png";
        var stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'Image',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      } else if (pathname.includes("start")) {
        var filePath = "./files/images/start.png";
        var stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'Image',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      }
    }
}).listen(8000);