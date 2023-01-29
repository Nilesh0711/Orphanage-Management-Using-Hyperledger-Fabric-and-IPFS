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

function verifyToken(req, res, next) {
  req.body.org = "Org1";
  req.body.role = "Admin";
  req.body.username = "adminorg1";
  next();
}

app.post(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-create-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.createOrphan(req, res);
  }
);

app.get(
  "/channels/:channelName/chaincodes/:chaincodeName/admin-read-orphan",
  verifyToken,
  async function (req, res) {
    await adminRoutes.readOrphan(req, res);
  }
);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
