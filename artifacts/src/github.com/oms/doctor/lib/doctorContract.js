/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const DoctorChaincode = require("./doctorChaincode");
const OrphanageContract = require("../../orphanage/lib/orphanageChaincode");

class DoctorContract extends DoctorChaincode {
  //Read Orphan details based on OrphanId
  async ReadOrphan(ctx, args) {
    args = JSON.parse(args);
    let doctorId = args.doctorId;
    let orphanId = args.orphanId;
    let asset = await OrphanageContract.prototype.ReadOrphan(
      ctx,
      JSON.stringify(args)
    );
    asset = JSON.parse(asset);
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

  //This function is to update Orphan medical details. This function should be called by only doctor.
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

  // //Read orphan based on lastname
  // async queryOrphanByLastName(ctx, lastName) {
  //     return await super.queryOrphanByLastName(ctx, lastName);
  // }

  // //Read orphan based on firstName
  // async queryOrphanByFirstName(ctx, firstName) {
  //     return await super.queryOrphanByFirstName(ctx, firstName);
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

  // async getClientId(ctx) {
  //   const clientIdentity = ctx.clientIdentity.getID();
  //   // Ouput of the above - 'x509::/OU=client/OU=org1/OU=department1/CN=ORP5::/C=US/ST=North Carolina/O=Hyperledger/OU=Fabric/CN=fabric-ca-server'
  //   let identity = clientIdentity.split("::");
  //   identity = identity[1].split("/")[4].split("=");
  //   return identity[1].toString("utf8");
  // }
}
module.exports = DoctorContract;
