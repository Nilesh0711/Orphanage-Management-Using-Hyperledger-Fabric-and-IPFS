// Bring common classes into scope, and Fabric SDK network class
const {
  ROLE_ADMIN,
  ROLE_DOCTOR,
  capitalize,
  getMessage,
  validateRole,
  createRedisClient,
} = require("../utils/utils");
const network = require("../app/helper");

exports.createOrphan = async (req, res) => {
  // User role from the request header is validated

  // return res.send(JSON.parse(req.body))

  const userRole = req.body.role;
  await validateRole([ROLE_ADMIN], userRole, res);

  // Set up and connect to Fabric Gateway using the username and org in header
  let username = req.body.username;
  let org = req.body.org;
  let args = req.body.args;
  const networkObj = await network.connectToNetwork(username, org);

  // get lastest orphan id from ledger
  let lastId = await network.invoke(
    networkObj,
    true,
    userRole + "Contract:GetLatestOrphanId",
    JSON.stringify(args)
  );
  lastId = JSON.parse(lastId.toString());
  lastId = parseInt(lastId.ID.slice(3)) + 1;

  const userIdToAdd = "ORP" + lastId;
  args.id = userIdToAdd;
  
  // invoke create orphan function in admin contract
  try {
    console.log("Registering user with userid " + args.id + " in ledger");
    let result = await network.invoke(
      networkObj,
      false,
      userRole + "Contract:CreateOrphan",
      JSON.stringify(args)
    );
    console.log("Successfully registered user in ledger");
    console.log("Result is : ");
    console.log(JSON.parse(result.toString()));
  } catch (error) {
    console.log("\nSome error occured in Contract:CreateOrphan\n");
    console.log(error);
    res
      .status(400)
      .send({ message: "Some error occurred while creating orphan" });
  }

  // Enroll and register the user with the CA and adds the user to the wallet.

  try {
    console.log("Registering user in wallet with userId " + args.id);
    await network.registerUser(org, userIdToAdd);
    res
      .status(201)
      .send(getMessage(false, "Successfully registered Patient.", userIdToAdd));
  } catch (error) {
    console.log("\nSome error occured in Contract:DeleteOrphan\n");
    console.log(error);
    console.log("Deleting user from ledger failed to store user in wallet");
    args.userId = userIdToAdd;
    await network.invoke(
      networkObj,
      false,
      userRole + "Contract:DeleteOrphan",
      JSON.stringify(args)
    );
    res.send(registerUserRes.error);
  }
};

// exports.createDoctor = async (req, res) => {
//   // User role from the request header is validated
//   const userRole = req.headers.role;
//   let {hospitalId, username, password} = req.body;
//   hospitalId = parseInt(hospitalId);

//   await validateRole([ROLE_ADMIN], userRole, res);

//   req.body.userId = username;
//   req.body.role = ROLE_DOCTOR;
//   req.body = JSON.stringify(req.body);
//   const args = [req.body];
//   // Create a redis client and add the doctor to redis
//   const redisClient = createRedisClient(hospitalId);
//   (await redisClient).SET(username, password);
//   // Enrol and register the user with the CA and adds the user to the wallet.
//   const response = await network.registerUser(args);
//   if (response.error) {
//     (await redisClient).DEL(username);
//     res.status(400).send(response.error);
//   }
//   res.status(201).send(getMessage(false, response, username, password));
// };

// exports.getAllPatients = async (req, res) => {
//   // User role from the request header is validated
//   const userRole = req.headers.role;
//   await validateRole([ROLE_ADMIN, ROLE_DOCTOR], userRole, res);
//   // Set up and connect to Fabric Gateway using the username in header
//   const networkObj = await network.connectToNetwork(req.headers.username);
//   // Invoke the smart contract function
//   const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:queryAllPatients',
//     userRole === ROLE_DOCTOR ? req.headers.username : '');
//   const parsedResponse = await JSON.parse(response);
//   res.status(200).send(parsedResponse);
// };
