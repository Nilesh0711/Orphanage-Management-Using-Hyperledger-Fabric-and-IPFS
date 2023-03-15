// Bring common classes into scope, and Fabric SDK network class
const {
  ROLE_ADMIN,
  ROLE_DOCTOR,
  getMessage,
  validateRole,
} = require("../utils/utils");
const { createRedisClient } = require("../utils/utils");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  let { username, password, org, role } = req.body.args,
    user,
    value;
  // using get instead of redis GET for async
  if (role === ROLE_DOCTOR || role === ROLE_ADMIN) {
    // Create a redis client based on the hospital ID
    const redisClient = await createRedisClient(org);
    // Async get
    // const value = await redisClient.get(username);
    if (role == "Admin") {
      value = await redisClient.HGET("admin", username);
      user = value === password;
      redisClient.quit();
    } else if (role == "Doctor") {
      value = await redisClient.HGET("doctor", username);
      user = value === password;
      redisClient.quit();
    }
    // comparing passwords
  }

  if (user) {
    // Generate an access token
    const token = {
      username: username,
      org: org,
      role: role,
    };
    jwt.sign({ token }, "secretKey", (err, token) => {
      res.status(200).json({
        token,
      });
    });
  } else {
    res.status(400).send({ error: "Username or password incorrect!" });
  }
};

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(bearerToken, "secretKey", (err, token) => {
      if (err) res.sendStatus(403);
      else {
        req.body.username = token.token.username;
        req.body.org = token.token.org;
        req.body.role = token.token.role;
        console.log(req.body);
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};
