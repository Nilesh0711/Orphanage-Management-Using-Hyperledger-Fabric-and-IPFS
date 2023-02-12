/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const OrphanageContract = require("./lib/orphanageChaincode");
// const DoctorChaincode = require("./lib/doctorChaincode");
// const DoctorContract = require("./lib/doctorContract");
const AdminContract = require("./lib/adminContract");

module.exports.OrphanageContract = OrphanageContract;
// module.exports.DoctorContract = DoctorContract;
module.exports.AdminContract = AdminContract;
// module.exports.DoctorChaincode = DoctorChaincode;

module.exports.contracts = [
  OrphanageContract,
  AdminContract,
  // DoctorContract,
  // DoctorChaincode,
];
