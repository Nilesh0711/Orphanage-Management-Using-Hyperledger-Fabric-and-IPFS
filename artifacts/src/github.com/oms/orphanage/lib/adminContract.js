/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
const OrphanChaincode = require("./orphanageChaincode.js");
const Orphan = require("./OrphanModel");

class AdminContract extends OrphanChaincode {
  //Returns the last orphanId in the set
  async getLatestOrphanId(ctx, args) {
    let allResults = await this.queryAllOrphan(ctx, args);
    allResults = { id: allResults[allResults.length - 1].id };
    return allResults;
  }

  //Create orphan in the ledger
  async createOrphan(ctx, args) {
    args = JSON.parse(args.toString());
    let { orphanId, name, gender, dob, yearOfEnroll, isAdopted, org, background } =
      args;
    let data = { orphanId: orphanId };
    const exists = await this.orphanExists(ctx, JSON.stringify(data));
    if (exists) {
      return `The user ${orphanId} already exist`;
    }
    let orphan = new Orphan(
      orphanId,
      name,
      gender,
      dob,
      yearOfEnroll,
      isAdopted,
      org,
      background
    );
    ctx.stub.putState(orphanId, Buffer.from(JSON.stringify(orphan)));
    return JSON.stringify(orphan);
  }

  //Read orphan details based on orphanId
  async readOrphan(ctx, args) {
    let asset = await OrphanChaincode.prototype.readOrphan(ctx, args);
    asset = JSON.parse(asset.toString());
    asset = {
      id: asset.id,
      name: asset.name,
      gender: asset.gender,
      dob: asset.dob,
      yearOfEnroll: asset.yearOfEnroll,
      isAdopted: asset.isAdopted,
      org: asset.org,
      background: asset.background,
    };
    return asset;
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  async updateOrphan(ctx, args) {
    args = JSON.parse(args.toString());
    let { orphanId, name, gender, dob, yearOfEnroll, isAdopted, org, background } =
      args;
    let data = { orphanId: orphanId };
    const exists = await this.orphanExists(ctx, JSON.stringify(data));
    if (!exists) {
      throw new Error(`The asset ${orphanId} does not exist`);
    }

    // overwriting original asset with new asset
    const updatedOrphan = {
      id: orphanId,
      name: name,
      gender: gender,
      dob: dob,
      yearOfEnroll: yearOfEnroll,
      isAdopted: isAdopted,
      org: org,
      background: background,
    };
    ctx.stub.putState(orphanId, Buffer.from(JSON.stringify(updatedOrphan)));
    return JSON.stringify(updatedOrphan);
  }

  // GrantAccessToDoctor an existing asset in the world state with provided parameters.
  async grantAccessToDoctor(ctx, args) {
    args = JSON.parse(args.toString());
    let userId = args.userId;
    let doctorId = args.doctorId;
    let data = {
      userId: userId,
    };
    let orphan = await OrphanChaincode.prototype.readOrphan(
      ctx,
      JSON.stringify(data)
    );
    orphan = JSON.parse(orphan.toString());
    if (!orphan.permissionGranted.includes(doctorId)) {
      orphan.permissionGranted.push(doctorId);
    }

    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(orphan)));
    return JSON.stringify(orphan);
  }

  // RevokeAccessFromDoctor an existing asset in the world state with provided parameters.
  async revokeAccessFromDoctor(ctx, args) {
    args = JSON.parse(args.toString());
    let userId = args.userId;
    let doctorId = args.doctorId;
    let data = {
      userId: userId,
    };
    let orphan = await OrphanChaincode.prototype.readOrphan(
      ctx,
      JSON.stringify(data)
    );
    orphan = JSON.parse(orphan.toString());
    if (orphan.permissionGranted.includes(doctorId)) {
      orphan.PermissionGranted = orphan.permissionGranted.filter(
        (doctor) => doctor != doctorId
      );
    }
    await ctx.stub.putState(userId, Buffer.from(JSON.stringify(orphan)));
    return JSON.stringify(orphan);
  }

  //Retrieves all patients details
  async queryAllOrphan(ctx, args) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllResults(resultsIterator, false);

    return this.fetchLimitedFields(asset);
  }

  fetchLimitedFields = (asset) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        id: obj.Key,
        name: obj.Record.name,
        gender: obj.Record.gender,
        dob: obj.Record.dob,
        yearOfEnroll: obj.Record.yearOfEnroll,
        isAdopted: obj.Record.isAdopted,
        org: obj.Record.org,
        background: obj.Record.background,
      };
    }

    return asset;
  };
}
module.exports = AdminContract;
