/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
let initOrphange = require('./initLedger.json');

class Orphanage extends Contract {

    async InitLedger(ctx) {
        for (const orphan of initOrphange) {
            orphan.docType = 'orphan';
            await ctx.stub.putState(orphan.ID, Buffer.from(JSON.stringify(orphan)));
            console.info(`Orphan ${orphan.ID} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateOrphan(ctx, id, firstName, lastName, age, gender, org, background) {
        const exists = await this.OrphanExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        const orphan = {
            ID: id,
            firstName: firstName,
            lastName:lastName,
            Age: age,
            Gender: gender,
            Org: org,
            Background: background,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(orphan)));
        return JSON.stringify(orphan);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadOrphan(ctx, id) {
        const dataJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!dataJSON || dataJSON.length === 0) {
            throw new Error(`The orphan ${id} does not exist`);
        }
        return dataJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateOrphan(ctx, id, firstName, lastName, age, gender, org, background) {
        const exists = await this.OrphanExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedOrphan = {
            ID: id,
            firstName: firstName,
            lastName:lastName,
            Age: age,
            Gender: gender,
            Org: org,
            Background: background,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedOrphan)));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteOrphan(ctx, id) {
        const exists = await this.OrphanExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async OrphanExists(ctx, id) {
        const dataJSON = await ctx.stub.getState(id);
        return dataJSON && dataJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllOrphan(ctx) {

        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
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
    
    async GetHistoryForOrphan(ctx, username) {

		let resultsIterator = await ctx.stub.getHistoryForKey(username);
		let results = await this.GetAllResults(resultsIterator, true);
		return JSON.stringify(results);
	}

    async GetAllResults(iterator, isHistory) {

		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
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

module.exports = Orphanage;
