/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";
const { getgid } = require("process");
const OrphanageContract = require("./orphanageContract.js");
const Orphan = require("./OrphanModel");

class AdminContract extends OrphanageContract {
  //Returns the last orphanId in the set
  async GetLatestOrphanId(ctx, args) {
    let allResults = await this.QueryAllOrphan(ctx, args);
    allResults = { ID: allResults[allResults.length - 1].ID };
    return allResults;
  }

  //Create orphan in the ledger
  async CreateOrphan(ctx, args) {
    args = JSON.parse(args.toString());
    let id = args.id;
    let firstName = args.firstName;
    let lastName = args.lastName;
    let age = args.age;
    let gender = args.gender;
    let org = args.org;
    let background = args.background;
    let data = { userId: id };
    const exists = await this.OrphanExists(ctx, JSON.stringify(data));
    if (exists) {
      return `The user ${id} already exist`;
    }
    let orphan = new Orphan(
      id,
      firstName,
      lastName,
      age,
      gender,
      org,
      background
    );
    ctx.stub.putState(id, Buffer.from(JSON.stringify(orphan)));
    return JSON.stringify(orphan);
  }

  //Read orphan details based on orphanId
  async ReadOrphan(ctx, args) {
    let asset = await OrphanageContract.prototype.ReadOrphan(ctx, args);
    asset = JSON.parse(asset);
    asset = {
      ID: asset.ID,
      firstName: asset.firstName,
      lastName: asset.lastName,
      Age: asset.Age,
      Gender: asset.Gender,
      Org: asset.Org,
      Background: asset.Background,
      PermissionGranted: asset.PermissionGranted,
    };
    return asset;
  }

  // async ReadOrphan(ctx, args) {
  //   args = JSON.parse(args);
  //   let id = args.id;
  //   let userId = args.userId;
  //   const dataJSON = await ctx.stub.getState(userId); // get the asset from chaincode state
  //   if (!dataJSON || dataJSON.length === 0) {
  //     throw new Error(`The orphan ${id} does not exist`);
  //   }
  //   return dataJSON.toString();
  // }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  async UpdateOrphan(ctx, args) {
    args = JSON.parse(args);
    let id = args.id;
    let firstName = args.firstName;
    let lastName = args.lastName;
    let age = args.age;
    let gender = args.gender;
    let org = args.org;
    let background = args.background;
    const exists = await this.OrphanExists(ctx, JSON.stringify(args));
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    // overwriting original asset with new asset
    const updatedOrphan = {
      ID: id,
      firstName: firstName,
      lastName: lastName,
      Age: age,
      Gender: gender,
      Org: org,
      Background: background,
    };
    return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedOrphan)));
  }

  async GrantAccessToDoctor(ctx, args) {
    args = JSON.parse(args);
    let userId = args.userId;
    let doctorId = args.doctorId;
    let data = {
      userId: userId,
    };

    const orphan = await OrphanageContract.prototype.ReadOrphan(
      ctx,
      JSON.stringify(data)
    );
    orphan = JSON.parse(orphan);

    if (!orphan.PermissionGranted.includes(doctorId)) {
      orphan.PermissionGranted.push(doctorId);
    }

    return ctx.stub.putState(userId, Buffer.from(JSON.stringify(orphan)));
  }

  async RevokeAccessFromDoctor(ctx, args) {
    args = JSON.parse(args);
    let userId = args.userId;
    let doctorId = args.doctorId;
    let data = {
      userId: userId,
    };

    const orphan = await OrphanageContract.prototype.ReadOrphan(
      ctx,
      JSON.stringify(data)
    );
    orphan = JSON.parse(orphan);

    if (!orphan.PermissionGranted.includes(doctorId)) {
      orphan.PermissionGranted = orphan.PermissionGranted.filter(
        (doctor) => doctor != doctorId
      );
    }

    return ctx.stub.putState(userId, Buffer.from(JSON.stringify(orphan)));
  }

  //Delete orphan from the ledger based on orphanId
  async DeleteOrphan(ctx, args) {
    args = JSON.parse(args);
    let userId = args.userId;
    const exists = await this.OrphanExists(ctx, JSON.stringify(args));
    if (!exists) {
      return `The asset ${userId} does not exist`;
    }
    return ctx.stub.deleteState(userId);
  }

  // //Read orphan based on lastname
  //   async queryPatientsByLastName(ctx, lastName) {
  //     let queryString = {};
  //     queryString.selector = {};
  //     queryString.selector.docType = "patient";
  //     queryString.selector.lastName = lastName;
  //     const buffer = await this.getQueryResultForQueryString(
  //       ctx,
  //       JSON.stringify(queryString)
  //     );
  //     let asset = JSON.parse(buffer.toString());

  //     return this.fetchLimitedFields(asset);
  //   }

  // //Read orphan based on firstName
  //   async queryPatientsByFirstName(ctx, firstName) {
  //     let queryString = {};
  //     queryString.selector = {};
  //     queryString.selector.docType = "patient";
  //     queryString.selector.firstName = firstName;
  //     const buffer = await this.getQueryResultForQueryString(
  //       ctx,
  //       JSON.stringify(queryString)
  //     );
  //     let asset = JSON.parse(buffer.toString());

  //     return this.fetchLimitedFields(asset);
  //   }

  //Retrieves all patients details
  async QueryAllOrphan(ctx, args) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.GetAllResults(resultsIterator, false);

    return this.fetchLimitedFields(asset);
  }

  fetchLimitedFields = (asset) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        ID: obj.Key,
        firstName: obj.Record.firstName,
        lastName: obj.Record.lastName,
        Age: obj.Record.Age,
        Gender: obj.Record.Gender,
        Org: obj.Record.Org,
        Background: obj.Record.Background,
      };
    }

    return asset;
  };
}
module.exports = AdminContract;
