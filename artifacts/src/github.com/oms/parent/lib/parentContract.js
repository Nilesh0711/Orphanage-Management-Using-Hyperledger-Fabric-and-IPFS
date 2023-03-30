/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
const ParentChaincode = require("./parentChaincode.js");
const Parent = require("./parentModel");

class ParentContract extends ParentChaincode {

  //Returns the last parentId in the set
  async getLatestParentId(ctx, args) {
    let allResults = await this.queryAllParent(ctx, args);
    allResults = { id: allResults[allResults.length - 1].id };
    return allResults;
  }

  //Create parent in the ledger
  async createParent(ctx, args) {
    args = JSON.parse(args.toString());
    let {
      parentId,
      orphanId,
      name,
      address,
      occupation,
      isMarried,
      phone,
      email,
      org,
    } = args;
    let data = { parentId };
    const exists = await this.parentExists(ctx, JSON.stringify(data));
    if (exists) {
      return `The user ${parentId} already exist`;
    }
    let parent = new Parent(
      parentId,
      name,
      isMarried,
      email,
      orphanId,
      phone,
      address,
      occupation,
      org
    );
    ctx.stub.putState(parentId, Buffer.from(JSON.stringify(parent)));
    return JSON.stringify(parent);
  }

  //Read parent details based on orphanId
  async readParent(ctx, args) {
    let asset = await ParentChaincode.prototype.readParent(ctx, args);
    asset = JSON.parse(asset.toString());
    asset = {
      id: asset.id,
      name: asset.name,
      isMarried: asset.isMarried,
      email: asset.email,
      orphanId: asset.orphanId,
      phone: asset.phone,
      address: asset.address,
      occupation: asset.occupation,
      org: asset.org,
    };
    return asset;
  }

  //Retrieves all doctor details
  async queryAllParent(ctx, args) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllResults(resultsIterator, false);

    return this.fetchLimitedFields(asset);
  }

  fetchLimitedFields = (asset) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        id: obj.Key,
        // name: obj.Record.name,
        // gender: obj.Record.gender,
        // dob: obj.Record.dob,
        // isAdopted: obj.Record.isAdopted,
        // yearOfEnroll: obj.Record.yearOfEnroll,
        // org: obj.Record.org,
        // background: obj.Record.background,
        // permissionGranted: obj.Record.permissionGranted,
        // aadhaarHash: obj.Record.aadhaarHash,
        // birthCertHash: obj.Record.birthCertHash,
      };
    }

    return asset;
  };

  //Read total adoption overall
  async totalAdoption(ctx, args) {
    let allResults = await this.getAllParent(ctx, args);
    allResults = { length: allResults.length };
    return allResults;
  }

  // Read orphan medical details
  async readOrphanMedicalDetails(ctx, args) {
    args = JSON.parse(args.toString());
    let { orphanId } = args;
    let result = await ctx.stub.invokeChaincode(
      "orphanage",
      [
        "AdminContract:getOrphanMedicalHistory",
        JSON.stringify({ orphanId }),
      ],
      "oms"
    );
    return result.payload.toString();
  }

  //Read parent details based on orphanId
  async readOrphan(ctx, args) {
    let result = await ctx.stub.invokeChaincode(
      "orphanage",
      ["OrphanChaincode:readOrphan", args],
      "oms"
    );
    return result.payload.toString();
  }

  //Retrieves all parent details by org
  async queryAllParentByOrg(ctx, args) {
    args = JSON.parse(args);
    let org = args.org;
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllResults(resultsIterator, false);
    let allResults = [];
    for (let index = 0; index < asset.length; index++) {
      const element = asset[index];
      if (element.Record.org == org)
        allResults.push({
          element,
        });
    }
    return allResults;
  }


}
module.exports = ParentContract;
