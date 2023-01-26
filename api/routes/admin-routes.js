// Bring common classes into scope, and Fabric SDK network class
// const {ROLE_ADMIN, ROLE_DOCTOR, capitalize, getMessage, validateRole, createRedisClient} = require('../utils.js');
const network = require('../app/helper');

exports.createOrphan = async (req, res) => {
  // User role from the request header is validated
//   const userRole = req.headers.role;
//   await validateRole([ROLE_ADMIN], userRole, res);
  // Set up and connect to Fabric Gateway using the username in header
  let username = "adminorg1"
  let org = "Org1"
  const networkObj = await network.connectToNetwork(username,org);

  // Generally we create patient id by ourself so if patient id is not present in the request then fetch last id
  // from ledger and increment it by one. Since we follow patient id pattern as "PID0", "PID1", ...
  // 'slice' method omits first three letters and take number
  if (!('patientId' in req.body) || req.body.patientId === null || req.body.patientId === '') {
    const lastId = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:getLatestPatientId');
    req.body.patientId = 'PID' + (parseInt(lastId.slice(3)) + 1);
  }

  // When password is not provided in the request while creating a patient record.
  // if (!('password' in req.body) || req.body.password === null || req.body.password === '') {
  //   req.body.password = Math.random().toString(36).slice(-8);
  // }

  req.body.changedBy = req.headers.username;

  // The request present in the body is converted into a single json string
  const data = JSON.stringify(req.body);
  const args = [data];
  // Invoke the smart contract function
  const createPatientRes = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:createPatient', args);
  if (createPatientRes.error) {
    res.status(400).send(response.error);
  }

  // Enrol and register the user with the CA and adds the user to the wallet.
  const userData = JSON.stringify({hospitalId: (req.headers.username).slice(4, 5), userId: req.body.patientId});
  const registerUserRes = await network.registerUser(userData);
  if (registerUserRes.error) {
    await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:deletePatient', req.body.patientId);
    res.send(registerUserRes.error);
  }

  res.status(201).send(getMessage(false, 'Successfully registered Patient.', req.body.patientId, req.body.password));
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
