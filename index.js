const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const { Client } = require("pg");
const path = require("path");
const cors = require("cors");
const { jwtDecode } = require("jwt-decode");
const { Server } = require("socket.io");
const fs = require("fs");
app.use(cookieParser());
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "wandy3d",
    resave: false,
    saveUninitialized: true,
  }),
);

let imageData;
let isMutable = true;
let dbTable;
app.use(
  cors({
    origin: [
      "https://02869a4d-306e-4253-9746-77098bf8355a-00-gvmdbk6ao948.kirk.replit.dev/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credetials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = new Client({
  host: "pg-3490aaa-ibehpromise3d.a.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_ElsIKxG1nnW6KrhJrq9",
  database: "proxy_base",
  port: "26942",
  ssl: {
    rejectUnauthorized: false,
  },
});

const upload = require("./upload.js");
// console.log("multer " + upload);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/home");
  console.log("file " + req.file);
  imageData = req.file.path;
});

// app.get("/upload", (req, res) => {
//   res.redirect("/home");
// })

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/register/index.html"));
});
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  connection.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (err, result) => {
      if (result > 0) {
        res.status(401).redirect("/register");
      } else {
        connection.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
          [name, email, password],
          (err, result) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .sendFile(path.join(__dirname, "/public/register/index.html"));
            } else {
              res.status(200).redirect("/login");
            }
          },
        );
      }
    },
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    " SELECT * from users WHERE email = $1 AND password = $2",
    [email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(510)
          .sendFile(path.join(__dirname, "/public/login/index.html"));
      } else {
        //console.log(result.rows)
        if (result.rows.length == 0) {
          res
            .status(401)
            .sendFile(path.join(__dirname, "/public/login/index.html"));
        } else {
          console.log(result.rows);
          const token = jwt.sign({ email, password }, "wandyk34", {
            expiresIn: "24h",
          });
          console.log(token);
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: "none",
            secure: true,
          });
          res.status(200).redirect("/home");
        }
      }
    },
  );
});

const verify = (req, res, next) => {
  const token = req.cookies.token;
  console.log("verification " + token);
  if (token) {
    jwt.verify(token, "wandyk34", (err, decoded) => {
      if (err) {
        console.log("error");
        res.redirect("/login");
      } else {
        req.user = decoded;
        return next();
      }
    });
  } else {
    return res.status(401).redirect("/login");
  }
};

app.get("/chat", (req, res) => {
  console.log(upload);
  res.sendFile(path.join(__dirname, "/public/home/index.html"));
});

app.get("/home", (req, res) => {
  console.log(upload);
  res.sendFile(path.join(__dirname, "/public/main/index.html"));
});

app.get("/api", verify, (req, res) => {
  connection.query("SELECT * FROM chat", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log(result.rows);
      let data = result.rows;
      // results = result.rows;
      // console.log("results " + results);
      res.status(200).json({ data });
    }
  });
});

app.get("/api/test", verify, (req, res) => {
  const token = req.cookies.token;
  const decodedToken = jwtDecode(token);
  const user = decodedToken.email;
  const emailName = decodedToken.email.split("@")[0];
  console.log("user " + user);
  connection.query(
    "SELECT * FROM users WHERE email = ($1) ",
    [user],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        let data = result.rows;

        connection.query(
          "SELECT * FROM chat WHERE admin = ($1) ",
          [emailName],
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Internal Server Error");
            } else {
              console.log(result.rows);
              chatData = result.rows;

              res.status(200).json({ data, user, imageData, chatData });
            }
          },
        );
      }
    },
  );
});

app.get("/search/api", verify, (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send("Query parameter is required");
  }

  const searchPattern = `%${query}%`;

  connection.query(
    "SELECT * FROM chat WHERE name ILIKE $1",
    [searchPattern],
    (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).json(result.rows);
    }
  );
});


app.post("/createRoom/api", verify, (req, res) => {
  const token = req.cookies.token;
  const decodedToken = jwtDecode(token);
  const emailName = decodedToken.email.split("@")[0];
  const userName = decodedToken.name;
  console.log(userName);
  const { name } = req.body;
  console.log("name " + name);
  dbTable = emailName + Date.now();
  const link = name + Date.now();
  console.log("user " + dbTable, link);
  const isAdmin = true;
  connection.query(
    "CREATE TABLE IF NOT EXISTS " +
      dbTable +
      "(name VARCHAR, password VARCHAR, email VARCHAR, message VARCHAR, isMutable VARCHAR(5), isBlob VARCHAR(5), link VARCHAR, isAdmin BOOLEAN, tablename VARCHAR, id SERIAL PRIMARY KEY NOT NULL)",
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        let sql;
        let dataArr;
        let password;
        console.log("table created");
        if (!req.body.password){
          sql = "INSERT INTO " +
              dbTable +
              " (email, isAdmin, isMutable, tablename) VALUES ($1, $2, $3, $4)"
          dataArr = [decodedToken.email, isAdmin, isMutable, name]
        }else{
          password = req.body.password;
          console.log("password " , req.body.password);
          sql = "INSERT INTO " +
            dbTable +
            " (email, isAdmin, isMutable, tablename, password) VALUES ($1, $2, $3, $4, $5)"
          dataArr = [decodedToken.email, isAdmin, isMutable, name, password]
        }


        connection.query(
          sql, dataArr, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).redirect("/home");
            }
            connection.query(
              "INSERT INTO chat (name, tablename, isMutable, admin, isadmin, currenttable) VALUES ($1, $2, $3, $4, $5, $6)",
              [name, dbTable, isMutable, emailName, isAdmin, dbTable],
              (err, result) => {
                if (err) {
                  console.error(err);
                  res.status(500).redirect("/home");
                }
                res.status(200).redirect("/chat");
              },
            );
          },
        );
      }
    },
  );

});

app.get("/home/api", verify, (req, res) => {
  const token = req.cookies.token;
  const decodedToken = jwtDecode(token);
  const user = decodedToken.email;
  const emailName = decodedToken.email.split("@")[0];
  console.log("user " + user);
  connection.query(
    "SELECT * FROM users WHERE email = ($1) ",
    [user],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        let data = result.rows;

        connection.query("SELECT * FROM chat ", (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
          } else {
            console.log("new", result.rows.currenttable);
            const table = result.rows[result.rows.length - 1].currenttable;
            connection.query(
              "SELECT * FROM " + table + " WHERE isMutable = ($1) ",
              [isMutable],
              (err, result) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(result.rows);
                  const chatData = result.rows;

                  res.status(200).json({ data, imageData, chatData });
                }
              },
            );
          }
        });
      }
    },
  );
});

app.put("/join/api", verify, (req, res) => {
  console.log("PUT /join/api called");
  console.log("Request body:", req.body);

  const { name, isMutable } = req.body;

  if (!name || typeof isMutable !== "boolean") {
    return res.status(400).send("Invalid request payload");
  }

  connection.query(
    "UPDATE chat SET currenttable = $1 WHERE isMutable = $2",
    [name, isMutable],
    (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send("Internal Server Error");
      } else {
        console.log("Database query result:", result);
        res.sendFile(path.join(__dirname, "/public/home/index.html"));
      }
    },
  );
});

app.get("/profile", verify, (req, res) => {
  res.sendFile(path.join(__dirname, "/public/profile/index.html"));
});

app.get("/logout", verify, (req, res) => {
  req.cookies.token = null;
  //isToken = false;
  res.redirect("/");
});

app.use(express.static(path.join(__dirname, "public")));
app.use("image", express.static(path.join(__dirname, "uploads")));

connection.connect((err) => {
  if (!err) {
    console.log("Connected to database");
  } else {
    console.error(err);
  }
});

app.get("/delete", verify, (req, res) => {
  connection.query(
    "DELETE FROM users WHERE email = ($1)",
    [req.user.email],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).redirect("/");
      }
    },
  );
});

app.delete('/deleteTable', verify, (req, res) => {
  const tableName = req.body.tableName;

  if (!tableName) {
    return res.status(400).send("Table name is required");
  }

  console.log("Attempting to delete table:", tableName);

  connection.query(
      "DELETE FROM chat WHERE tablename = ($1)",
      [tableName],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          connection.query(
            `DROP TABLE IF EXISTS ${tableName}`,
            (err, result) => {
              if (err) {
                console.error("Database query error:", err);
                return res.status(500).send("Internal Server Error");
              } else {
                console.log(`Table ${tableName} deleted successfully`);
                return res.status(200).send(`Table ${tableName} deleted successfully`);
              }
            }
          );
        }
      },
    );
});




const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat", (name, msg, tname) => {
    console.log(name, msg);
    isMutable = "true";
    isBlob = "false";
    connection.query("SELECT * FROM chat ", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("new", result.rows.currenttable);
        const table = result.rows[result.rows.length - 1].currenttable;
        connection.query(
          "INSERT INTO " +
            table +
            " (name, message, isMutable, isBlob, tablename) VALUES ($1, $2, $3, $4, $5) RETURNING name, message, isMutable, isBlob",
          [name, msg, isMutable, isBlob, tname],
          (err, result) => {
            if (err) console.log(err);
            console.log("result " , result);
            result.rows.map((row) => {
              console.log(row.name, row.message);
              io.emit("chat", row.name, row.message);
            });
          },
        );
      }
    });
  });

  socket.on("image", (username, imageData, filename, tname) => {
    isMutable = "true";
    isBlob = "true";
    const publicFolder = path.join(__dirname, "public");
    console.log("image " + filename);
    // Create the complete file pat

    const dataBuffer = Buffer.from(imageData.split(",")[1], "base64");
    // console.log("dataBuffer " + dataBuffer)
    fs.writeFile(`${publicFolder}/uploads/${filename}`, dataBuffer, (err) => {
      if (err) {
        console.error("image err " + err);
      } else {
        connection.query("SELECT * FROM chat ", (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
          } else {
            console.log("new", result.rows.currenttable);
            const table = result.rows[result.rows.length - 1].currenttable;
            connection.query(
              "INSERT INTO " +
                table +
                " (name, message, isMutable, isBlob, tablename) VALUES ($1, $2, $3, $4, $5) RETURNING name, message, isMutable, isBlob",
              [username, filename, isMutable, isBlob, tname],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  result.rows.map((row) => {
                    const dbname = row.name;
                    io.emit("image", row.name, imageData, filename);
                  });
                }
              },
            );
          }
        });
        console.log("Image saved successfully");
      }
    });
  });

  socket.on("delete", (message) => {
    console.log("delete " + message);
    connection.query("SELECT * FROM chat ", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("new", result.rows.currenttable);
        const table = result.rows[result.rows.length - 1].currenttable;
        connection.query(
          "DELETE FROM " + table + " WHERE message = ($1)",
          [message],
          (err, result) => {
            if (err) console.log(err);
            // console.log(result);
          },
        );
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// why is the password null, 