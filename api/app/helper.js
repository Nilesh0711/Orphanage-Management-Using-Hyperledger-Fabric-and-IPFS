"use strict";

var { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");

const util = require("util");

const getAffiliation = async (org) => {
  // Default in ca config file we have only two affiliations, if you want ti use org3 ca, you have to update config file with third affiliation
  //  Here already two Affiliation are there, using i am using "org2.department1" even for org3
  return org == "Org1" ? "org1.department1" : "org2.department1";
};

const getCaUrl = async (org, ccp) => {
  let caURL = null;
  org == "Org1"
    ? (caURL = ccp.certificateAuthorities["ca.org1.example.com"].url)
    : null;
  org == "Org2"
    ? (caURL = ccp.certificateAuthorities["ca.org2.example.com"].url)
    : null;
  return caURL;
};

const isUserRegistered = async (username, userOrg) => {
  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(`An identity for the user ${username} exists in the wallet`);
    return true;
  }
  return false;
};

const getOrgMSP = (org) => {
  let orgMSP = null;
  org == "Org1" ? (orgMSP = "Org1MSP") : null;
  org == "Org2" ? (orgMSP = "Org2MSP") : null;
  return orgMSP;
};

const registerAndGerSecret = async (username, userOrg) => {
  let ccp = await getCCP(userOrg);

  const caURL = await getCaUrl(userOrg, ccp);
  const ca = new FabricCAServices(caURL);

  const walletPath = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(
      `An identity for the user ${username} already exists in the wallet`
    );
    var response = {
      success: true,
      message: username + " enrolled Successfully",
    };
    return response;
  }

  // Check to see if we've already enrolled the admin user.

  let adminuser = userOrg == "Org1" ? "org1admin" : "org2admin";

  let adminIdentity = await wallet.get(adminuser);
  if (!adminIdentity) {
    console.log(
      "An identity for the admin user " +
        adminuser +
        " does not exist in the wallet"
    );
    // await enrollAdmin(userOrg, ccp);
    // adminIdentity = await wallet.get('admin');
    // console.log("Admin Enrolled Successfully")
    var result = {
      success: false,
      message:
        "An identity for the admin user " +
        adminuser +
        " does not exist in the wallet",
    };
    return result;
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, adminuser);
  let secret;
  try {
    // Register the user, enroll the user, and import the new identity into the wallet.
    secret = await ca.register(
      {
        affiliation: await getAffiliation(userOrg),
        enrollmentID: username,
        role: "orphan",
      },
      adminUser
    );
    // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);
    const enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: secret,
    });
    let orgMSPId = getOrgMSP(userOrg);
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMSPId,
      type: "X.509",
    };
    await wallet.put(username, x509Identity);
  } catch (error) {
    return error.message;
  }

  var response = {
    success: true,
    message: username + " enrolled Successfully",
    secret: secret,
  };
  return response;
};

module.exports = {
  getAffiliation:getAffiliation,
  getOrgMSP: getOrgMSP,
  isUserRegistered: isUserRegistered,
  registerAndGerSecret: registerAndGerSecret,
};
