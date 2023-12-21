require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("./config");
const xss = require("xss");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const reportsRouter = require("./reports/reports-router");
const AuthService = require("./auth-service");
const ReportsService = require("./reports/reports-service");

const app = express();
const jsonParser = express.json();

//set secret
app.set("Secret", config.SECRET_KEY);

// helmet
app.use(helmet());

// cors
app.use(cors());

// use morgan to log requests to the console
app.use(morgan("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// define router
const ProtectedRoutes = express.Router();

app.use("/api", ProtectedRoutes);
ProtectedRoutes.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  let token = req.headers["access-token"];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("Secret"), (err, decoded) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to authenticate token." });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({
      message: "No token provided.",
    });
  }
});

// on successful authentication, return jwt to client for future access
app.post("/authenticate", jsonParser, (req, res, next) => {
  const knexInstance = req.app.get("db");
  AuthService.getAllUsers(knexInstance)
    .then((users) => {
      return users;
    })
    .then((result) => {
      const foundUsers = result.filter((el) => {
        return (
          el.username === req.body.username && el.password === req.body.password
        );
      });
      // if there are any users that match...
      if (foundUsers.length > 0) {
        //if everything is ok, proceed to create token
        const payload = {
          check: true,
          username: foundUsers[0].username,
          password: foundUsers[0].password,
          id: foundUsers[0].id,
          is_admin: foundUsers[0].admin,
        };

        let token = jwt.sign(payload, app.get("Secret"), {
          expiresIn: 1440, // expires in 24 hours
        });

        // return the information to the client
        res.status(202).json({
          message: "authentication complete.",
          token: token,
        });
      } else {
        res.status(403).send({ error: "username or password incorrect" });
      }
    })
    .catch(next);
});

const serializeReport = (report) => ({
  id: report.id,
  report_first: xss(report.report_first),
  report_last: xss(report.report_last),
  report_email: xss(report.report_email),
  report_phone: xss(report.report_phone),
  report_lat: report.report_lat,
  report_lng: report.report_lng,
  report_date: report.report_date,
  report_time: report.report_time,
  report_type: xss(report.report_type),
  report_waterbody: xss(report.report_waterbody),
  report_other: xss(report.report_other),
  report_details: xss(report.report_details),
});

// globally available form post endpoint
app.post("/submit", jsonParser, function (req, res, next) {
  const newReport = req.body;

  for (const [key, value] of Object.entries(newReport)) {
    if (value == null) {
      return res.status(400).json({
        error: {
          message: `Missing '${key}' in request body`,
        },
      });
    }
  }
  ReportsService.insertReport(req.app.get("db"), newReport)
    .then((report) => {
      res
        .status(201)
        .location(`/api/reports/${report.id}`)
        .json(serializeReport(newReport))
        .end();
    })
    .catch(next);
});

// point to other endpoint router
ProtectedRoutes.use("/reports", reportsRouter);

// '/' catcher
app.get("/", function (req, res) {
  res.send(`Hello world! app is running on ${config.PORT}`);
});

// error handling
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "Server error" };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response).catch(next);
});

module.exports = app;
