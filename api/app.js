"use strict";
const log4js = require("log4js");
const bodyParser = require("body-parser");
const http = require("http");
const util = require("util");
const express = require("express");
const app = express();
const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");
const bearerToken = require("express-bearer-token");
const cors = require("cors");
const constants = require("./config/constants.json");

const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port || 8000;

const adminRoutes = require("./routes/admin-routes");
const doctorRoutes = require("./routes/doctor-routes");
const authRoutes = require("./routes/auth-routes");

app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// ******** AUTH API ********
 

app.post("/login", async function (req, res) {
  await authRoutes.loginUser(req, res);
});

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(bearerToken, "secretKey", (err, token) => {
      if (err) res.sendStatus(403);
      else {
        console.log(token);
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};


// ******** ADMIN API ********

// create orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-create-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.createOrphan(req, res);
  }
);

// update orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-update-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.updateOrphan(req, res);
  }
);

// grant doctor access orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-grantaccess-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.grantAccessToDoctor(req, res);
  }
);

// revoke doctor access orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-revokeaccess-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.revokeAccessFromDoctor(req, res);
  }
);

// delete orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-delete-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.deleteOrphan(req, res);
  }
);

// create doctor api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-create-doctor",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.createDoctor(req, res);
  }
);

// read orphan api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-read-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.readOrphan(req, res);
  }
);

// query all orphan api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-queryall-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.queryAllOrphan(req, res);
  }
);

// get all doctor api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-queryall-doctor",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.getDoctorsByOrgId(req, res);
  }
);

// ******** DOCTOR API ********

// read assigned orphan api

// read assigned orphan history medical data api

// update orphan medical record api

// port listen
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
