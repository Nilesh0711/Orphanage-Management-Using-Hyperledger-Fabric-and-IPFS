const {
  Gateway,
  Wallets,
  TxEventHandler,
  GatewayOptions,
  DefaultEventHandlerStrategies,
  TxEventHandlerFactory,
} = require("fabric-network");
const fs = require("fs");
const EventStrategies = require("fabric-network/lib/impl/event/defaulteventhandlerstrategies");
const { buildCAClient, registerAndEnrollUser } = require("./CAUtils");
const { buildCCPOrg1, buildCCPOrg2, buildWallet, buildAffliation } = require("./AppUtils");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const log4js = require("log4js");
const logger = log4js.getLogger("BasicNetwork");
const util = require("util");

const helper = require("./helper");
// const { blockListener, contractListener } = require("./Listeners");

const invokeTransaction = async (
  channelName,
  chaincodeName,
  fcn,
  args,
  username,
  org_name,
  userIdentity

) => {
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
    
    console.log(
      "\n==================\n",
      channelName,
      chaincodeName,
      fcn,
      args,
      username,
      org_name,
      "\n==================\n"
    );

    let identity = await wallet.get(username);
    if (identity && fcn == "CreateOrphan") {
      return `An Identity of ${username} already exists in the wallet`;
    } else if (!identity && fcn == "CreateOrphan") {
      console.log(
        `An identity for the user ${username} does not exist in the wallet, so registering user`
      );
      await registerAndEnrollUser(
        caClient,
        wallet,
        org_name,
        username,
        adminUserId,
        affiliation
      );
    } else if (!identity && fcn != "CreateOrphan") {
      return `An identity for the user ${username} does not exist in the wallet, so register user`;
    }

    //  else return `An Identity of ${username} already exists in the wallet`;
    const connectOptions = {
      wallet,
      identity: username,
      discovery: { enabled: true, asLocalhost: true },
      // eventHandlerOptions: EventStrategies.NONE
    };
    const gateway = new Gateway();
    await gateway.connect(ccp, connectOptions);
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    let result;
    let message;
    args.id = username;
    result = await contract.submitTransaction(
      userIdentity+"Contract:"+fcn,
      JSON.stringify(args)
    );
    result = { txid: result.toString() };

    // switch (fcn) {
    //   case "CreatePrivateDataImplicitForOrg1":
    //   case "ABACTest":
    //   case "CreateContract":
    //   case "CreateOrphan":
    //     result = await contract.submitTransaction(
    //       fcn,
    //       username,
    //       args.firstName,
    //       args.lastName,
    //       args.age,
    //       args.gender,
    //       args.org,
    //       args.background
    //     );
    //     result = { txid: result.toString() };
    //     break;
    //   case "UpdateOrphan":
    //     result = await contract.submitTransaction(
    //       fcn,
    //       username,
    //       args.firstName,
    //       args.lastName,
    //       args.age,
    //       args.gender,
    //       args.org,
    //       args.background
    //     );
    //     result = { txid: result.toString() };
    //     break;
    //   case "DeleteOrphan":
    //     result = await contract.submitTransaction(fcn, username);
    //     result = { txid: result.toString() };
    //     break;
    //   case "CreateDocument":
    //     result = await contract.submitTransaction(
    //       "DocumentContract:" + fcn,
    //       args[0]
    //     );
    //     console.log(result.toString());
    //     result = { txid: result.toString() };
    //     break;
    //   default:
    //     break;
    // }

    await gateway.disconnect();

    // result = JSON.parse(result.toString());

    let response = {
      message: message,
      result,
    };
    return response;
  } catch (error) {
    console.log(`Getting error: ${error}`);
    return error.message;
  }
};

exports.invokeTransaction = invokeTransaction;
