const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const { buildCAClient, registerAndEnrollUser } = require("./CAUtils.js");
const {
  buildCCPOrg1,
  buildCCPOrg2,
  buildWallet,
  buildAffliation,
} = require("./AppUtils.js");

const channelName = "mychannel";
const chaincodeName = "fabcar";
const mspOrg1 = "Org1";
const mspOrg2 = "Org2";
const walletPath = path.join(__dirname, "wallet");

exports.connectToNetwork = async function (id, org) {
  const gateway = new Gateway();
  let ccp, walletPath, wallet;
  if (org == "Org1") {
    ccp = buildCCPOrg1();
    walletPath = path.resolve(__dirname, "..", "org1-wallet");
    wallet = await buildWallet(Wallets, walletPath);
  } else if (org == "Org2") {
    ccp = buildCCPOrg2();
    walletPath = path.resolve(__dirname, "..", "org2-wallet");
    wallet = await buildWallet(Wallets, walletPath);
  }
  try {
    const userExists = await wallet.get(id);
    if (!userExists) {
      console.log(
        "An identity for the id: " + id + " does not exist in the wallet"
      );
      console.log("Create the id before retrying");
      const response = {};
      response.error =
        "An identity for the user " +
        id +
        " does not exist in the wallet. Register " +
        id +
        " first";
      return response;
    }

    await gateway.connect(ccp, {
      wallet,
      identity: id,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    const networkObj = {
      contract: contract,
      network: network,
      gateway: gateway,
    };
    console.log("Succesfully connected to the network.");
    return networkObj;
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    const response = {};
    response.error = error;
    return response;
  }
};

exports.invoke = async function (networkObj, isQuery, func, args) {
  try {
    if (isQuery === true) {
      const response = await networkObj.contract.evaluateTransaction(
        func,
        args
      );
      console.log(response);
      await networkObj.gateway.disconnect();
      return response;
    } else {
      const response = await networkObj.contract.submitTransaction(
        func,
        JSON.stringify(args)
      );
      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    const response = {};
    response.error = error;
    console.error(`Failed to submit transaction: ${error}`);
    return response;
  }
};

exports.registerUser = async function (org_name, username) {
  // const attrs = JSON.parse(attributes);
  // const hospitalId = parseInt(attrs.hospitalId);
  // const userId = attrs.userId;
  // if (!userId || !hospitalId) {
  //   const response = {};
  //   response.error =
  //     "Error! You need to fill all fields before you can register!";
  //   return response;
  // }
  try {
    let ccp, walletPath, caClient, adminUserId, wallet, affiliation;
    if (org_name == "Org1") {
      ccp = buildCCPOrg1();
      walletPath = path.resolve(__dirname, "..", "org1-wallet");
      adminUserId = "adminorg1";
      wallet = await buildWallet(Wallets, walletPath);
      caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
    } else if (org_name == "Org2") {
      ccp = buildCCPOrg2();
      walletPath = path.resolve(__dirname, "..", "org2-wallet");
      adminUserId = "adminorg2";
      wallet = await buildWallet(Wallets, walletPath);
      caClient = buildCAClient(FabricCAServices, ccp, "ca.org2.example.com");
    }
    affiliation = buildAffliation(org_name);
    await registerAndEnrollUser(
      caClient,
      wallet,
      org_name,
      username,
      adminUserId,
      affiliation
    );
    console.log(`Successfully registered user: + ${username}`);
    const response = "Successfully registered user: " + username;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${username} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};

// exports.getAllDoctorsByHospitalId = async function (networkObj, hospitalId) {
//   // Get the User from the identity context
//   const users = networkObj.gateway.identityContext.user;
//   let caClient;
//   const result = [];
//   try {
//     // TODO: Must be handled in a config file instead of using if
//     if (hospitalId === 1) {
//       const ccp = buildCCPHosp1();
//       caClient = buildCAClient(FabricCAServices, ccp, "ca.hosp1.lithium.com");
//     } else if (hospitalId === 2) {
//       const ccp = buildCCPHosp2();
//       caClient = buildCAClient(FabricCAServices, ccp, "ca.hosp2.lithium.com");
//     } else if (hospitalId === 3) {
//       const ccp = buildCCPHosp3();
//       caClient = buildCAClient(FabricCAServices, ccp, "ca.hosp3.lithium.com");
//     }

//     // Use the identity service to get the user enrolled using the respective CA
//     const idService = caClient.newIdentityService();
//     const userList = await idService.getAll(users);

//     // for all identities the attrs can be found
//     const identities = userList.result.identities;

//     for (let i = 0; i < identities.length; i++) {
//       tmp = {};
//       if (identities[i].type === "client") {
//         tmp.id = identities[i].id;
//         tmp.role = identities[i].type;
//         attributes = identities[i].attrs;
//         // Doctor object will consist of firstName and lastName
//         for (let j = 0; j < attributes.length; j++) {
//           if (
//             attributes[j].name.endsWith("Name") ||
//             attributes[j].name === "role" ||
//             attributes[j].name === "speciality"
//           ) {
//             tmp[attributes[j].name] = attributes[j].value;
//           }
//         }
//         result.push(tmp);
//       }
//     }
//   } catch (error) {
//     console.error(`Unable to get all doctors : ${error}`);
//     const response = {};
//     response.error = error;
//     return response;
//   }
//   return result.filter(function (result) {
//     return result.role === "doctor";
//   });
// };
