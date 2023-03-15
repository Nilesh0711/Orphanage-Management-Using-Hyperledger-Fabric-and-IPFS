/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const OrphanageContract = require("./lib/orphanageChaincode");
const AdminContract = require("./lib/adminContract");

module.exports.OrphanageContract = OrphanageContract;
module.exports.AdminContract = AdminContract;

module.exports.contracts = [
  OrphanageContract,
  AdminContract,
];
