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

app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// verify token
function verifyToken(req, res, next) {
  req.body.org = "Org1";
  req.body.role = "Admin";
  req.body.username = "adminorg1";
  next();
}


// ****************************************************** ADMIN APIS ************************************************************************

// create orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-create-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.createOrphan(req, res);
  }
);

// update orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-update-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.updateOrphan(req, res);
  }
);

// grant doctor access orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-grantaccess-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.grantAccessToDoctor(req, res);
  }
);

// revoke doctor access orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-revokeaccess-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.revokeAccessFromDoctor(req, res);
  }
);

// delete orphan api
app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-delete-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.deleteOrphan(req, res);
  }
);

// read orphan api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-read-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.readOrphan(req, res);
  }
);

// query all orphan api
app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-queryall-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.queryAllOrphan(req, res);
  }
);



// port listen
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
