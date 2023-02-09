// Bring common classes into scope, and Fabric SDK network class
const {
  ROLE_ADMIN,
  ROLE_DOCTOR,
  getMessage,
  validateRole,
} = require("../utils/utils");
const { createRedisClient } = require("../utils/utils");

exports.loginUser = async (req, res) => {
  let { username, password, org, role } = req.body.args,
    user;
  // using get instead of redis GET for async
  if (role === ROLE_DOCTOR || role === ROLE_ADMIN) {
    // Create a redis client based on the hospital ID
    const redisClient = await createRedisClient(org);
    // Async get
    const value = await redisClient.get(username);
    // comparing passwords
    user = value === password;
    redisClient.quit();
  }

  if (user) {
    // Generate an access token
    return res.status(200).send("i am successfull");
    const accessToken = generateAccessToken(username, role);
    const refreshToken = jwt.sign(
      { username: username, role: role },
      refreshSecretToken
    );
    refreshTokens.push(refreshToken);
    // Once the password is matched a session is created with the username and password
    res.status(200);
    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).send({ error: "Username or password incorrect!" });
  }
};
