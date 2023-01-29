const redis = require("redis");
const util = require("util");

exports.ROLE_ADMIN = 'Admin';
exports.ROLE_DOCTOR = 'Doctor';
// exports.ROLE_PATIENT = 'patient';

// exports.CHANGE_TMP_PASSWORD = 'CHANGE_TMP_PASSWORD';

// exports.getMessage = function (isError, message, id = "", password = "") {
//   if (isError) {
//     return { error: message };
//   } else {
//     return { success: message, id: id, password: password };
//   }
// };

exports.getMessage = function (isError, message, id = "") {
  if (isError) {
    return { error: message };
  } else {
    return { success: message, id: id};
  }
};

exports.validateRole = async function (roles, reqRole, res) {
  if (
    !reqRole ||
    !roles ||
    reqRole.length === 0 ||
    roles.length === 0 ||
    !roles.includes(reqRole)
  ) {
    // user's role is not authorized
    return res.sendStatus(401).json({ message: "Unauthorized Role" });
  }
};

exports.capitalize = function (s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

exports.createRedisForDoctor = async function (org, i) {
  // TODO: Handle using config file
  let redisPassword, port, doctorPassword;
  if (org == "Org1") {
    port = "6379";
    redisPassword = "adminorg1pw";
    doctorPassword = "doctororg1pw";
  } else if (org == "Org2") {
    port = "6380";
    redisPassword = "adminorg2pw";
    doctorPassword = "doctororg1pw";
  }
  redisClient = redis.createClient({
    socket: {
      host: "localhost",
      port: port,
    },
    password: redisPassword,
  });
  redisClient.connect();
  redisClient.on("connect", (err) => {
    console.log(`doctor added to redis`);
  });
  try {
    await redisClient.set(org + "-" +"DOC" + i, doctorPassword);
    redisClient.quit();
    return true;
  } catch (error) {
    console.log(error);
  }
  // NOTE: Node Redis currently doesn't natively support promises
  // Util node package to promisify the get function of the client redis
  throw new Error(`Failed to enroll doctor ${id} some error occured`);
};
