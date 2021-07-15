var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var url = require("url");
const { time } = require('console');

function registerUser(name, password, res) {
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
        var sql = "SELECT * FROM user WHERE name='" + name + "';";
        con.query(sql, function(error1, result1) {
          if (error1) throw error1;
          if (result1.length == 0) {
            var sql2 = "INSERT INTO user (name, passwort, created_at, last_login, aktiv, level) VALUES ('"+ name +"', '" + hash + "', '" + current_date + "', '" +  current_date + "', True,  1);";
            con.query(sql2, function(error2, result2) {
              if (error2) throw error2;
              fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
                data_updated = data.replace("TEST", "Benutzer angelegt!");
                res.end(data_updated);
              });
              console.log("Benutzer angelegt!");
            });
          } else {
            fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
              data_updated = data.replace("TEST", "Name bereits vergeben!");
              res.end(data_updated);
            });
            console.log("Name bereits vergeben!");
          }
        });
      });
}

function makeLogin(name, password, response) {
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
    var sql = "SELECT * FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');";
    con.query(sql, function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
          console.log("Login erfolgreich!")
          response.writeHead(200, {
            'Set-Cookie': 'session_id=' + name + '#' + hash,
            'Content-Type': 'text/html'
          });
          fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
            data_updated = data.replace("TEST", "Login erfolgreichen!");
            response.end(data_updated);
          });
          var sql2 = "UPDATE user SET last_login = '" + current_date + "' WHERE (name='" + name + "' AND passwort='" + hash + "');";
          con.query(sql2, function(error, results) {
            if (error) throw error;
          })
        } else {
          fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
            data_updated = data.replace("TEST", "Login falsch!");
            response.end(data_updated);
          });
          console.log("Login falsch!");
        }
    });
  });
}

function addResource(name, hash, resource_id, value, res, qualified=false) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "adventure",
  });

  switch (String(resource_id)) {
    case "1":
      var resource_name = "Holz";
      break; 
    case "2":
      var resource_name = "Stein";
      break;
    case "3":
      var resource_name = "Eisen";
      break;
    case "4":
      var resource_name = "Gold";
      break;
  }

  con.connect(function(err) {
    //var hash = require("crypto").createHash("sha256").update(passwort).digest("hex");
    var sql = "SELECT id FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');"
    con.query(sql, function(error1, result1) {
      var user_id = result1[0].id;
      if (error1) throw error1;
      var sql2 = "SELECT * FROM resources WHERE (user_id=" + user_id + " AND resource_id=" + resource_id + ");"
      con.query(sql2, function(error2, result2) {
        if (error2) throw error2;
        var current_date = new Date().getTime()
        if (result2.length == 0) {
          var sql3 = "INSERT INTO resources (user_id, resource_name, resource_id, value, last_update) VALUES (" + user_id + ", '" + resource_name + "', " + resource_id + ", " + parseInt(value) + ", " + current_date + ");"
          con.query(sql3, function(error3, result3) {
            if (error3) throw error3;
            fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
              data_updated = data.replace("TEST", "Neuer Datensatz erstellt!");
              res.end(data_updated);
            });
            console.log("Neuer Datensatz erstellt!");
          })
          fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
            data_updated = data.replace("TEST", "Keine Ergebnisse gefunden!");
            res.end(data_updated);
          });
          console.log("Keine Ergebnisse gefunden!");
        } else {
          var alreadyThere = parseInt(result2[0].value);
          if (qualified) {
            var sql4 = "UPDATE resources SET value=" + String(alreadyThere + parseInt(value)) + ", last_update='" + current_date + "', resource_name='" + resource_name + "' WHERE (user_id=" + user_id + " AND resource_id=" + resource_id + ");";
            con.query(sql4, function(error4, result4) {
              if (error4) throw error4;
              fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
                data_updated = data.replace("TEST", "Datenbestand geupdated mit Zeit!");
                res.end(data_updated);
              });
              console.log("Datenbestand geupdated mit Zeit!");
            })  
          }
          var sql4 = "UPDATE resources SET value=" + String(alreadyThere + parseInt(value)) + ", resource_name='" + resource_name + "' WHERE (user_id=" + user_id + " AND resource_id=" + resource_id + ");";
            con.query(sql4, function(error4, result4) {
              if (error4) throw error4;
              fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
                data_updated = data.replace("TEST", "Datenbestand geupdated!");
                res.end(data_updated);
              });
              console.log("Datenbestand geupdated!");
        })
      }
    })
  })
})
}

function buildBuilding(name, hash, building_id, level, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "adventure",
  });
  con.connect(function(err) {
    // var hash = require("crypto").createHash("sha256").update(passwort).digest("hex");
    var sql1 = "SELECT id FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');"
    con.query(sql1, function(error1, result1) {
      if (error1) throw error1;
      var user_id = result1[0].id;
      var sql2 = "SELECT * FROM level_buildings WHERE (user_id=" + user_id + " AND building_id=" + building_id + " AND level>=" + level + ");";
      con.query(sql2, function(error2, result2) {
        if (error2) throw error2;
        if (result2.length == 0) {
          var sql3 = "SELECT * FROM economy WHERE (building_id=" + building_id + " AND level=" + level + ");"
          con.query(sql3, function(error3, result3) {
            if (error3) throw error3;
            var building_name = result3[0].building_name;
            var price = result3[0].price;
            var price_resource_id = result3[0].price_resource_id;
            var sql4 = "SELECT * FROM resources WHERE (user_id=" + user_id + " AND resource_id=" + price_resource_id + ");";
            con.query(sql4, function(error4, result4) {
              if (error4) throw error4;
              if (result4.length == 0) {
                addResource(name, hash, price_resource_id, 0, res, true)
              } else {
                if (result4[0].value >= price) {
                  console.log("Resourcen reichen aus!")
                  var sql5 = "UPDATE resources SET value=" + String(result4[0].value - price) + " WHERE (user_id=" + user_id + " AND resource_id=" + price_resource_id + ");";
                  con.query(sql5, function(error5, result5) {
                    if (error5) throw error5;
                    var sql6 = "SELECT * FROM level_buildings WHERE (user_id=" + user_id + " AND building_id=" + building_id + ")";
                    con.query(sql6, function(error6, result6) {
                      if (error6) throw error6;
                      if (result6.length > 0) {
                        var sql7 = "UPDATE level_buildings SET level=" + level + " WHERE (user_id=" + user_id + " AND building_id=" + building_id + ");"
                        con.query(sql7, function(error7, result7) {
                          if (error7) throw error7;
                          fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
                            data_updated = data.replace("TEST", "Gebäude aufgelevelt!");
                            res.end(data_updated);
                          });
                          console.log("Gebäude upgelevelt!");
                        })
                      } else {
                        var sql7 = "INSERT INTO level_buildings (user_id, building, building_id, level) VALUES (" + user_id + ", '" + building_name + "'," + building_id + "," + level + ");";
                        con.query(sql7, function(error7, result7) {
                          if (error7) throw error7;
                          fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
                            data_updated = data.replace("TEST", "Neues Gebäude gebaut!");
                            res.end(data_updated);
                          });
                          console.log("Neues Gebäude gebaut!");
                        });
                      }
                    });
                  });
                } else {
                  fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
                    data_updated = data.replace("TEST", "Resourcen reichen nicht aus!");
                    res.end(data_updated);
                  });
                  console.log("Resourcen reichen nicht aus!");
                }
              }
            });
          });
        } else {
          fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
            data_updated = data.replace("TEST", "Gebäude bereits gebaut!");
            res.end(data_updated);
          });
          console.log("Gebäude bereits gebaut!");
        }
      });
    });
  });
}

function updateBuilding(name, hash, building_id, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "adventure",
  });

  con.connect(function(err) {
    if (err) throw err;
    // var hash = require("crypto").createHash("sha256").update(passwort).digest("hex");
    var sql1 = "SELECT id FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');"
    con.query(sql1, function(error1, result1) {
      if (error1) throw error1;
      var user_id = result1[0].id;
      var sql2 = "SELECT * FROM level_buildings WHERE (user_id=" + user_id + " AND building_id=" + building_id + ");";
      con.query(sql2, function(error2, result2) {
        var current_level = result2[0].level;
        var sql3 = "SELECT * FROM economy WHERE (building_id=" + building_id + " AND level>" + current_level + ");";
        con.query(sql3, function(error2, result3) {
          if (result3.length > 0) {
            buildBuilding(name, hash, building_id, current_level + 1, res);
          } else {
            fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
              data_updated = data.replace("TEST", "Bereits maximales Level erreicht!");
              res.end(data_updated);
            });
            console.log("Bereits maximales Level erreicht!");
          }
        })
      });
    });
  });
}


function getResources(name, hash, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "adventure",
  });
  con.connect(function(err) {
    // var hash = require("crypto").createHash("sha256").update(passwort).digest("hex");
    var sql1 = "SELECT id FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');"
    con.query(sql1, function(error1, result1) {
      if (error1) throw error1;
      var user_id = result1[0].id;
      var result_string = "";
      var sql2 = "SELECT * FROM resources WHERE user_id=" + user_id + " ORDER BY resource_id ASC;";
      con.query(sql2, function(error2, result2) {
        if (error2) throw error2;
        for (var i=0; i < result2.length; i++) {
          result_string += (result2[i].value + " vom Typ " + result2[i].resource_name + "<br>");
          console.log(result2[i].resource_id, result2[i].value, result2[i].resource_name);
        }
        fs.readFile("./templates/extra/modal.html", "utf8", function(err, data) {
          data_updated = data.replace("TEST", result_string);
          res.end(data_updated);
        });
      })
    });
  });
}

function calculateProduction(name, hash, res, pathname) {
  var checkBuilding_id = null;
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "adventure",
  });
  con.connect(function(err) {
    if (err) throw err;
    // var hash = require("crypto").createHash("sha256").update(passwort).digest("hex");
    var sql1 = "SELECT id FROM user WHERE (name='" + name + "' AND passwort='" + hash + "');"
    con.query(sql1, function(error1, result1) {
      if (error1) throw error1;
      var user_id = result1[0].id;
      if (checkBuilding_id == null) {
        var sql2 = "SELECT * FROM level_buildings WHERE user_id=" + user_id + ";";
        con.query(sql2, function(error2, result2) {
          if (result2.length > 0) {
            for (var i=0; i < result2.length; i++) {
              var building_id = result2[i].building_id;
              var building_level = result2[i].level;
              var sql3 = "SELECT * FROM economy WHERE (building_id=" + building_id + " AND level=" + building_level + ");";
              con.query(sql3, function(error3, result3) {
                var production = result3[0].production;
                var production_id = result3[0].resource_id;
                var sql4 = "SELECT * FROM resources WHERE (user_id=" + user_id + " AND resource_id=" + production_id + ");";
                con.query(sql4, function(error4, result4) {
                  if (result4.length == 0) {
                    addResource(name, hash, production_id, 0, res, true);
                    res.end();
                  } else {
                    var current_date = new Date().getTime();
                    var timePassed = (current_date - result4[0].last_update) / 10000;
                    var producedResources = timePassed * production;
                    addResource(name, hash, production_id, producedResources, res, true);
                    res.writeHead(301, { "Location": "/getResources" });
                    return res.end()
                  }
                })
              })
            }
          } else {
            res.end("Keine Gebäude gebaut!");
            console.log("Keine Gebäude gebaut!");
          }
        })
      }
    })
  })
}

var get_cookies = function(request) {
  var cookies = {};
  request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
    var parts = cookie.match(/(.*?)=(.*)$/)
    cookies[ parts[1].trim() ] = (parts[2] || '').trim();
  });
  return cookies;
};

http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    const queryObject = url.parse(req.url,true).query;
    try {
      var session_cookie = get_cookies(req)['session_id'].split('#')
    } catch (e) {
      console.log(e);
    }
      if (pathname.startsWith("/validateLogin")) {
        makeLogin(queryObject.name, queryObject.passwort, res)
      } else if (pathname.startsWith("/registerUser")) {
        registerUser(queryObject.name, queryObject.passwort, res);
      } else if (pathname.startsWith("/addResources")) {
        addResource(session_cookie[0], session_cookie[1], queryObject.resource_id, queryObject.value, res, queryObject.qualified);
        //addResource(queryObject.name, queryObject.passwort, queryObject.resource_id, queryObject.value, queryObject.qualified);
      } else if (pathname.startsWith("/getResources")) {
        getResources(session_cookie[0], session_cookie[1], res);
        //getResources(queryObject.name, queryObject.passwort);
      } else if (pathname.startsWith("/buildBuilding")) {
        buildBuilding(session_cookie[0], session_cookie[1], queryObject.building_id, queryObject.level, res);
        //buildBuilding(queryObject.name, queryObject.passwort, queryObject.building_id, queryObject.level);
      } else if (pathname.startsWith("/updateBuilding")) {
        updateBuilding(session_cookie[0], session_cookie[1], queryObject.building_id, res);
        //updateBuilding(queryObject.name, queryObject.passwort, queryObject.building_id);
      } else if (pathname.startsWith("/calcProd")) {
        calculateProduction(session_cookie[0], session_cookie[1], res);
        //calculateProduction(queryObject.name, queryObject.passwort);
      }
      if (pathname.startsWith("/login")) {
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