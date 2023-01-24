const {Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, enrollAdmin} = require('./app/CAUtils');
const {buildCCPOrg1, buildWallet} = require('./app/AppUtils');
const org = 'Org1';
const walletPath = path.join(process.cwd(), "org1-wallet");

const adminOrg1 = "adminorg1";
const adminPwOrg1 = "adminorg1pw";

exports.enrollAdminOrg1 = async function() {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, org, adminOrg1, adminPwOrg1);

    console.log('msg: Successfully enrolled admin user ' + adminOrg1 + ' and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user ' + ${adminOrg1} + : ${error}`);
    process.exit(1);
  }
};