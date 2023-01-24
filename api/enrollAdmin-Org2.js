const {Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, enrollAdmin} = require('./app/CAUtils');
const {buildCCPOrg2, buildWallet} = require('./app/AppUtils');
const org = 'Org2';
const walletPath = path.join(process.cwd(), "org2-wallet");

const adminOrg2 = "adminorg2";
const adminPwOrg2 = "adminorg2pw";

exports.enrollAdminOrg2 = async function() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg2();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, org, adminOrg2, adminPwOrg2);

    console.log('msg: Successfully enrolled admin user ' + adminOrg2 + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${adminOrg2} + : ${error}`);
    process.exit(1);
  }
};