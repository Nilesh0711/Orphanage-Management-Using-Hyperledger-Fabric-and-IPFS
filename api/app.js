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
const parentRoutes = require("./routes/parent-routes");

const authRoutes = require("./routes/auth-routes");
const fileUpload = require("express-fileupload");

app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload())
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

// create parent api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-create-parent",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.createParent(req, res);
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

// query all parent api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-queryall-parent",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.queryAllParent(req, res);
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

// query all parent by org api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-parent-org",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.queryAllParentByOrg(req, res);
  }
);


// --------------------------> IPFS FILES

// add orphan aadhaar card
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/upload/admin-orphan-aadhaar",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.addAadhaarCardFile(req, res);
  }
);

// add orphan birth certificate
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/upload/admin-orphan-birthcert",
  authRoutes.verifyToken,
  async function (req, res) {
    await adminRoutes.addBirthCertFile(req, res);
  }
);


// ******** DOCTOR API ********


// Doctor read orphan 
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readAOrphanGranted(req, res);
  }
);

// Doctor read orphan medical history
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-orphan-history",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readAOrphanGrantedHistory(req, res);
  }
);

// Doctor update orphan medical data
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-update-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.updateOrphanMedicalRecord(req, res);
  }
);

// Read doctor data using doctorId
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-doctor",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readDoctor(req, res);
  }
);

// Read all orphan assigned under doctor
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/doctor-read-orphan-assigned",
  authRoutes.verifyToken,
  async function (req, res) {
    await doctorRoutes.readOrphanUnderDoctor(req, res);
  }
);


// ******** PARENT API ********

// Read parent data using parentId
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/parent-read-parent",
  authRoutes.verifyToken,
  async function (req, res) {
    await parentRoutes.readParent(req, res);
  }
);

// Read orphan data with current medical records
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/parent-read-orphan",
  authRoutes.verifyToken,
  async function (req, res) {
    await parentRoutes.readOrphan(req, res);
  }
);

// Read orphan medical history 
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/parent-read-orphan-history",
  authRoutes.verifyToken,
  async function (req, res) {
    await parentRoutes.readOrphanMedicalHistory(req, res);
  }
);



// port listen
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
