const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const { buildCAClient, registerAndEnrollUser } = require("./app/CAUtils");
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require("./app/AppUtils");
const helper = require("./app/helper");
let walletPath;
let mspOrg;
let adminUserId;
let caClient;
exports.enrollRegisterUser = async function (org, userId, attributes) {
  try {
    // setup the wallet to hold the credentials of the application user
    let wallet;
    if (org == "Org1") {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPOrg1();
      
      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");

      walletPath = path.join(process.cwd(), "org1-wallet");
      wallet = await buildWallet(Wallets, walletPath);

      mspOrg = "Org1MSP";
      adminUserId = "adminorg1";

    } else if (org == "Org2") {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPOrg2();

      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, "ca.org2.example.com");

      walletPath = path.join(process.cwd(), "org2-wallet");
      wallet = await buildWallet(Wallets, walletPath);

      mspOrg = "Org2MSP";
      adminUserId = "adminorg2";
    }
    // enrolls users to Hospital 1 and adds the user to the wallet
    let affiliation = await helper.getAffiliation(org);
    await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg,
      userId,
      adminUserId,
      affiliation
    );
    console.log(
      "msg: Successfully enrolled user " +
        userId +
        " and imported it into the wallet"
    );
  } catch (error) {
    console.error(`Failed to register user "${userId}": ${error}`);
    process.exit(1);
  }
};
