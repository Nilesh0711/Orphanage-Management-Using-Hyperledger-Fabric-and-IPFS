/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const ParentContract = require("./lib/parentChaincode");
const parentContract = require("./lib/parentContract");

module.exports.ParentContract = ParentContract;
module.exports.parentContract = parentContract;

module.exports.contracts = [
  ParentContract,
  parentContract,
];
