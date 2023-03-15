/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const DoctorChaincode = require("./doctorChaincode");
const DoctorModel = require("./DoctorModel");
// const OrphanageContract = require("../../orphanage/lib/orphanageChaincode");

class DoctorContract extends DoctorChaincode {
  //Returns the last orphanId in the set
  async getLatestDoctorId(ctx, args) {
    let allResults = await this.queryAllDoctor(ctx, args);
    allResults = { id: allResults[allResults.length - 1].Key };
    return allResults;
  }

  //Read Orphan details based on OrphanId
  async readOrphanGranted(ctx, args) {
    args = JSON.parse(args);
    let doctorId = args.doctorId;
    let orphanId = args.orphanId;
    let asset = await ctx.stub.invokeChaincode(
      "orphanage",
      ["OrphanChaincode:readOrphan", JSON.stringify({ orphanId })],
      "oms"
    );
    asset = JSON.parse(asset.payload.toString());
    const permissionArray = asset.permissionGranted;
    if (!permissionArray.includes(doctorId)) {
      throw new Error(
        `The doctor ${doctorId} does not have permission to patient ${orphanId}`
      );
    }
    asset = {
      id: asset.id,
      name: asset.name,
      gender: asset.gender,
      org: asset.org,
      dob: asset.dob,
      disfigurements: asset.disfigurements,
      treatment: asset.treatment,
      diagnosis: asset.diagnosis,
      allergies: asset.allergies,
      changedBy: asset.changedBy,
    };
    return asset;
  }

  //Create doctor in the ledger
  async createDoctor(ctx, args) {
    args = JSON.parse(args.toString());
    let {
      doctorId,
      firstName,
      lastName,
      age,
      org,
      speciality,
      qualification,
      experience,
      phoneNo,
      personalAddress,
    } = args;
    let data = { doctorId: doctorId };
    const exists = await this.doctorExists(ctx, JSON.stringify(data));
    if (exists) {
      return `The user ${doctorId} already exist`;
    }
    let doctor = new DoctorModel(
      doctorId,
      firstName,
      lastName,
      age,
      org,
      speciality,
      qualification,
      experience,
      phoneNo,
      personalAddress
    );
    ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(doctor)));
    return JSON.stringify(doctor);
  }

  // AssetExists returns true when asset with given ID exists in world state.
  async doctorExists(ctx, args) {
    args = JSON.parse(args);
    let doctorId = args.doctorId;
    const dataJSON = await ctx.stub.getState(doctorId);
    return dataJSON && dataJSON.length > 0;
  }

  //Retrieves all doctor details
  async queryAllDoctor(ctx, args) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllResults(resultsIterator, false);
    return asset;
  }

  //Retrieves all doctor details by org
  async queryAllDoctorByOrg(ctx, args) {
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

  async getAllResults(iterator, isHistory) {
    let allResults = [];
    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString("utf8"));
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString("utf8");
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString("utf8");
          }
        }
        allResults.push(jsonRes);
      }
      res = await iterator.next();
    }
    iterator.close();
    return allResults;
  }

  // This function is to update Orphan medical details. This function should be called by only doctor.
  async updateOrphanMedicalDetails(ctx, args) {
    let result = await ctx.stub.invokeChaincode(
      "orphanage",
      ["AdminContract:updateOrphanMedicalDetails", args],
      "oms"
    );
    return result.payload.toString();
  }

  //Retrieves orphan medical history based on orphanId
  async getOrphanMedicalHistory(ctx, args) {
    args = JSON.parse(args);
    let doctorId = args.doctorId;
    let orphanId = args.orphanId;
    let asset = await ctx.stub.invokeChaincode(
      "orphanage",
      ["OrphanChaincode:readOrphan", JSON.stringify({ orphanId })],
      "oms"
    );
    asset = JSON.parse(asset.payload.toString());
    const permissionArray = asset.permissionGranted;
    if (!permissionArray.includes(doctorId)) {
      throw new Error(
        `The doctor ${doctorId} does not have permission to patient ${orphanId}`
      );
    }
    let result = await ctx.stub.invokeChaincode(
      "orphanage",
      ["AdminContract:getOrphanMedicalHistory", JSON.stringify(args)],
      "oms"
    );
    return result.payload.toString();
  }

  //Read Doctor details based on doctorId
  async readDoctor(ctx, args) {
    let asset = await DoctorChaincode.prototype.readDoctor(ctx, args);
    asset = JSON.parse(asset.toString());
    asset = {
      id: asset.id,
      firstName: asset.firstName,
      lastName: asset.lastName,
      age: asset.age,
      org: asset.org,
      speciality: asset.speciality,
      qualification: asset.qualification,
      experience: asset.experience,
      phoneNo: asset.phoneNo,
      personalAddress: asset.personalAddress,
    };
    return asset;
  }

  // This function is to update Orphan medical details. This function should be called by only doctor.
  async readOrphanUnderDoctor(ctx, args) {
    let result = await ctx.stub.invokeChaincode(
      "orphanage",
      ["AdminContract:readOrphanUnderDoctor", args],
      "oms"
    );
    return result.payload.toString();
  }

}
module.exports = DoctorContract;
