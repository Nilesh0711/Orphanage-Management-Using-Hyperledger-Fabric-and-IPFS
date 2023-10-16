// Bring common classes into scope, and Fabric SDK network class
const {
  ROLE_PARENT,
  getMessage,
  validateRole,
  createRedisForParent,
} = require("../utils/utils");
const network = require("../app/helper");

exports.readParent = async (req, res) => {
  // User role from the request header is validated
  let { role, username, org } = req.body;
  let { chaincodeName, channelName } = req.params;
  // args.doctorId = username;

  let isAuthorized = await validateRole([ROLE_PARENT], role, res);
  if (!isAuthorized)
    return res.status(500).send({ message: "Unauthorized access" });

  // Set up and connect to Fabric Gateway using the username and org in header

  const networkObj = await network.connectToNetwork(
    username,
    org,
    channelName,
    chaincodeName,
    res
  );

  try {
    // args.doctorId = username;
    let result = await network.invoke(
      networkObj,
      true,
      role + "Contract:readParent",
      JSON.stringify({ parentId: username }),
      res
    );
    if (result.statusCode != 500) {
      console.log("Result is : ");
      console.log(JSON.parse(result.toString()));
      res.status(200).send({
        result: JSON.parse(result.toString()),
      });
    }

    return;
  } catch (error) {
    console.log("Some error occurred in parent read parent");
    console.log(error);
  }
};

exports.readOrphan = async (req, res) => {
  // User role from the request header is validated
  let { role, username, org } = req.body;
  let { orphanId } = req.query;
  let { chaincodeName, channelName } = req.params;
  // args.doctorId = username;

  let isAuthorized = await validateRole([ROLE_PARENT], role, res);
  if (!isAuthorized)
    return res.status(500).send({ message: "Unauthorized access" });

  // Set up and connect to Fabric Gateway using the username and org in header

  const networkObj = await network.connectToNetwork(
    username,
    org,
    channelName,
    chaincodeName,
    res
  );

  try {
    // args.doctorId = username;
    let result = await network.invoke(
      networkObj,
      true,
      role + "Contract:readOrphan",
      JSON.stringify({ orphanId }),
      res
    );
    if (result.statusCode != 500) {
      console.log("Result is : ");
      console.log(JSON.parse(result.toString()));
      res.status(200).send({
        result: JSON.parse(result.toString()),
      });
    }

    return;
  } catch (error) {
    console.log("Some error occurred in parent read parent");
    console.log(error);
  }
};

exports.readOrphanMedicalHistory = async (req, res) => {
    // User role from the request header is validated
    let { role, username, org } = req.body;
    let { orphanId } = req.query;
    let { chaincodeName, channelName } = req.params;
    // args.doctorId = username;
  
    let isAuthorized = await validateRole([ROLE_PARENT], role, res);
    if (!isAuthorized)
      return res.status(500).send({ message: "Unauthorized access" });
  
    // Set up and connect to Fabric Gateway using the username and org in header
  
    const networkObj = await network.connectToNetwork(
      username,
      org,
      channelName,
      chaincodeName,
      res
    );
  
    try {
      // args.doctorId = username;
      let result = await network.invoke(
        networkObj,
        true,
        role + "Contract:readOrphanMedicalDetails",
        JSON.stringify({ orphanId }),
        res
      );
      if (result.statusCode != 500) {
        console.log("Result is : ");
        console.log(JSON.parse(result.toString()));
        res.status(200).send({
          result: JSON.parse(result.toString()),
        });
      }
  
      return;
    } catch (error) {
      console.log("Some error occurred in parent read parent");
      console.log(error);
    }
  };
