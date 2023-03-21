/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");
const Parent = require("./parentModel");

class ParentChaincode extends Contract {

  async InitLedger(ctx) {
      let parentId = "OMS-Par0"
      let parent = new Parent(
        parentId,
        "initLedger",
        false,
        "",
        "",
        "",
        "",
        "",
        "Org1"
      );
      await ctx.stub.putState(parentId, Buffer.from(JSON.stringify(parent)));
      console.info(`Parent ${parent} initialized`);
  }

  // ReadAsset returns the asset stored in the world state with given id.
  async readParent(ctx, args) {
    args = JSON.parse(args);
    let parentId = args.parentId;
    const dataJSON = await ctx.stub.getState(parentId); // get the asset from chaincode state
    if (!dataJSON || dataJSON.length === 0) {
      throw new Error(`The parent ${parentId} does not exist`);
    }
    return dataJSON.toString();
  }

  // AssetExists returns true when asset with given ID exists in world state.
  async parentExists(ctx, args) {
    args = JSON.parse(args);
    let parentId = args.parentId;
    const dataJSON = await ctx.stub.getState(parentId);
    return dataJSON && dataJSON.length > 0;
  }

  // GetAllAssets returns all assets found in the world state.
  async getAllParent(ctx,args) {
    // args = JSON.parse(args);
    // let id = args.id;
    // let userId = args.userId;
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push({ Key: result.value.key, Record: record });
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
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

}

module.exports = ParentChaincode;
