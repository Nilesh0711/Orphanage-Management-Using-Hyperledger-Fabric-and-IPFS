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
          element
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
  // async updateOrphanMedicalDetails(ctx, args) {
  //   args = JSON.parse(args);
  //   let isDataChanged = false;
  //   let patientId = args.patientId;
  //   let newSymptoms = args.symptoms;
  //   let newDiagnosis = args.diagnosis;
  //   let newTreatment = args.treatment;
  //   let newFollowUp = args.followUp;
  //   let updatedBy = args.changedBy;

  //   const patient = await PrimaryContract.prototype.readPatient(ctx, patientId);

  //   if (
  //     newSymptoms !== null &&
  //     newSymptoms !== "" &&
  //     patient.symptoms !== newSymptoms
  //   ) {
  //     patient.symptoms = newSymptoms;
  //     isDataChanged = true;
  //   }

  //   if (
  //     newDiagnosis !== null &&
  //     newDiagnosis !== "" &&
  //     patient.diagnosis !== newDiagnosis
  //   ) {
  //     patient.diagnosis = newDiagnosis;
  //     isDataChanged = true;
  //   }

  //   if (
  //     newTreatment !== null &&
  //     newTreatment !== "" &&
  //     patient.treatment !== newTreatment
  //   ) {
  //     patient.treatment = newTreatment;
  //     isDataChanged = true;
  //   }

  //   if (
  //     newFollowUp !== null &&
  //     newFollowUp !== "" &&
  //     patient.followUp !== newFollowUp
  //   ) {
  //     patient.followUp = newFollowUp;
  //     isDataChanged = true;
  //   }

  //   if (updatedBy !== null && updatedBy !== "") {
  //     patient.changedBy = updatedBy;
  //   }

  //   if (isDataChanged === false) return;

  //   const buffer = Buffer.from(JSON.stringify(patient));
  //   await ctx.stub.putState(patientId, buffer);
  // }

  //Retrieves orphan medical history based on orphanId
  // async GetOrphanHistory(ctx, args) {
  //   args = JSON.parse(args);
  //   let userId = args.userId;
  //   let resultsIterator = await ctx.stub.getHistoryForKey(userId);
  //   let asset = await this.GetAllResults(resultsIterator, true);

  //   return this.fetchLimitedFields(asset, false);
  // }

  //Retrieves all orphan details
  // async QueryAllOrphan(ctx, args) {
  //   args = JSON.parse(args);
  //   let id = args.id;
  //   let userId = args.userId;
  //   let resultsIterator = await ctx.stub.getStateByRange("", "");
  //   let asset = await this.GetAllResults(resultsIterator, false);
  //   const permissionedAssets = [];
  //   for (let i = 0; i < asset.length; i++) {
  //     const obj = asset[i];
  //     if (
  //       "PermissionGranted" in obj.Record &&
  //       obj.Record.PermissionGranted.includes(id)
  //     ) {
  //       permissionedAssets.push(asset[i]);
  //     }
  //   }

  //   return this.fetchLimitedFields(permissionedAssets);
  // }

  // fetchLimitedFields = (asset, includeTimeStamp = false) => {
  //   for (let i = 0; i < asset.length; i++) {
  //     const obj = asset[i];
  //     asset[i] = {
  //       ID: obj.Key,
  //       firstName: obj.Record.firstName,
  //       lastName: obj.Record.lastName,
  //       Age: obj.Record.Age,
  //       Gender: obj.Record.Gender,
  //     };
  //     if (includeTimeStamp) {
  //       asset[i].changedBy = obj.Record.changedBy;
  //       asset[i].Timestamp = obj.Timestamp;
  //     }
  //   }
  //   return asset;
  // };

}
module.exports = DoctorContract;
