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

exports.connectToNetwork = async function (
  id,
  org,
  channelName,
  chaincodeName,
  res
) {
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
      return res.send(response);
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

exports.invoke = async function (networkObj, isQuery, func, args, res) {
  try {
    if (isQuery == true) {
      console.log("Quering contract");
      console.log("arguments for quering contract");
      console.log(JSON.parse(args));
      const response = await networkObj.contract.evaluateTransaction(
        func,
        args
      );
      await networkObj.gateway.disconnect();
      return response;
    } else {
      console.log("Invoking contract");
      console.log("arguments for invoking contract");
      console.log(JSON.parse(args));
      const response = await networkObj.contract.submitTransaction(func, args);
      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    return res.status(500).send({ error });
  }
};

exports.registerUser = async function (org_name, userIdToAdd) {
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
      userIdToAdd,
      adminUserId,
      affiliation,
    );
    console.log(`Successfully registered user: + ${userIdToAdd}`);
    const response = "Successfully registered user: " + userIdToAdd;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${userIdToAdd} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};

exports.getAllDoctorsByOrgId = async function (networkObj, org) {
  // Get the User from the identity context
  const users = networkObj.gateway.identityContext.user;
  let caClient;
  const result = [];
  try {
    // TODO: Must be handled in a config file instead of using if

    if (org == "Org1") {
      const ccp = buildCCPOrg1();
      caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
    } else if (org == "Org2") {
      const ccp = buildCCPOrg2();
      caClient = buildCAClient(FabricCAServices, ccp, "ca.org2.example.com");
    }

    // Use the identity service to get the user enrolled using the respective CA
    const idService = caClient.newIdentityService();
    const userList = await idService.getAll(users);

    // for all identities the attrs can be found
    const identities = userList.result.identities;

    for (let i = 0; i < identities.length; i++) {
      tmp = {};
      if (identities[i].type === "client") {
        tmp.id = identities[i].id;
        tmp.role = identities[i].type;
        attributes = identities[i].attrs;
        // Doctor object will consist of firstName and lastName
        for (let j = 0; j < attributes.length; j++) {
          if (
            attributes[j].name.endsWith("Name") ||
            attributes[j].name === "role" ||
            attributes[j].name === "speciality"
          ) {
            tmp[attributes[j].name] = attributes[j].value;
          }
        }
        result.push(tmp);
      }
    }
  } catch (error) {
    console.error(`Unable to get all doctors : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
  return result.filter(function (result) {
    return result.role === "doctor";
  });
};
