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
    await adminRoutes.revokeAccessToDoctor(req, res);
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

// query all orphan by org api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-orphan-org",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.queryAllOrphanByOrg(req, res);
  }
);

// query all doctor api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-queryall-doctor",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.queryAllDoctor(req, res);
  }
);

// query all doctor by org api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-doctor-org",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.queryAllDoctorByOrg(req, res);
  }
);


// ******** DOCTOR API ********

app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readAOrphanGranted(req, res);
  }
);

app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-orphan-history",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readAOrphanGrantedHistory(req, res);
  }
);

app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-update-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.updateOrphanMedicalRecord(req, res);
  }
);

// read orphan api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-doctor",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readDoctor(req, res);
  }
);

// read orphan api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-orphan-assigned",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readOrphanUnderDoctor(req, res);
  }
);

// port listen
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
