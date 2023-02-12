/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const DoctorChaincode = require("./lib/doctorChaincode");
const DoctorContract = require("./lib/doctorContract");

module.exports.DoctorContract = DoctorContract;
module.exports.DoctorChaincode = DoctorChaincode;

module.exports.contracts = [
  DoctorContract,
  DoctorChaincode,
];
