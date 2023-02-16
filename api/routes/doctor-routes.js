// Bring common classes into scope, and Fabric SDK network class
const { ROLE_DOCTOR, getMessage, validateRole } = require("../utils/utils");
const network = require("../app/helper");

exports.readAOrphanGranted = async (req, res) => {
  // User role from the request header is validated
  let { role, username, org, args } = req.body;
  let { chaincodeName, channelName } = req.params;
  args.doctorId = username

  let isAuthorized = await validateRole([ROLE_DOCTOR], role, res);
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
    args.doctorId = username
    let result = await network.invoke(
      networkObj,
      true,
      role + "Contract:readOrphanGranted",
      JSON.stringify(args),
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
    console.log("Some error occurred in admin read orphan");
    console.log(error);
  }
};

exports.updateOrphanMedicalRecord = async (req, res) => {};

exports.getOrphanMedicalHistory = async (req, res) => {};

exports.getDoctorDetailById = async (req, res) => {};
