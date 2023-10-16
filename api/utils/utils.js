const redis = require("redis");
const util = require("util");

exports.ROLE_ADMIN = "Admin";
exports.ROLE_DOCTOR = "Doctor";
exports.ROLE_PARENT = "Parent";

exports.getMessage = function (isError, message, id = "") {
  if (isError) {
    return { error: message };
  } else {
    return { success: message, id: id };
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
    return false;
  }
  return true;
};

exports.capitalize = function (s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

exports.createRedisForDoctor = async function (org, id) {
  // TODO: Handle using config file
  let redisPassword, port, doctorPassword, redisClient;
  if (org == "Org1") {
    port = "6379";
    redisPassword = "adminorg1pw";
    doctorPassword = "doctororg1pw";
  } else if (org == "Org2") {
    port = "6380";
    redisPassword = "adminorg2pw";
    doctorPassword = "doctororg2pw";
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
    console.log("Successfully connected to redis with port: " + port);
  });
  try {
    // await redisClient.set(id, [doctorPassword, "Doctor"]);
    await redisClient.HSET("doctor", id, doctorPassword);
    redisClient.quit();
    return true;
  } catch (error) {
    console.log(error);
  }
  // NOTE: Node Redis currently doesn't natively support promises
  // Util node package to promisify the get function of the client redis
  throw new Error(`Failed to enroll doctor ${id} some error occured`);
};

exports.createRedisForParent = async function (org, id) {
  // TODO: Handle using config file
  let redisPassword, port, parentPassword, redisClient;
  if (org == "Org1") {
    port = "6379";
    redisPassword = "adminorg1pw";
    parentPassword = "parentorg1pw";
  } else if (org == "Org2") {
    port = "6380";
    redisPassword = "adminorg2pw";
    parentPassword = "parentorg2pw";
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
    console.log("Successfully connected to redis with port: " + port);
  });
  try {
    // await redisClient.set(id, [parentPassword, "Doctor"]);
    await redisClient.HSET("parent", id, parentPassword);
    redisClient.quit();
    return true;
  } catch (error) {
    console.log(error);
  }
  // NOTE: Node Redis currently doesn't natively support promises
  // Util node package to promisify the get function of the client redis
  throw new Error(`Failed to enroll parent ${id} some error occured`);
};

exports.createRedisClient = async function (org) {
  // TODO: Handle using config file
  let redisPassword, port, redisClient;
  if (org == "Org1") {
    port = "6379";
    redisPassword = "adminorg1pw";
  } else if (org == "Org2") {
    port = "6380";
    redisPassword = "adminorg2pw";
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
    console.log("Successfully connected to redis with port: " + port);
  });

  // NOTE: Node Redis currently doesn't natively support promises
  // Util node package to promisify the get function of the client redis
  // redisClient.get = util.promisify(redisClient.get);
  return redisClient;
};
