/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const OrphanageContract = require("./lib/orphanageContract");
const DoctorContract = require("./lib/doctorContract");
const AdminContract = require("./lib/adminContract");

module.exports.OrphanageContract = OrphanageContract;
module.exports.DoctorContract = DoctorContract;
module.exports.AdminContract = AdminContract;

module.exports.contracts = [OrphanageContract, AdminContract, DoctorContract];
