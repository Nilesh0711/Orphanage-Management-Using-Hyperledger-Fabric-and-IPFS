const fs = require("fs");
const { enrollAdminOrg1 } = require("./enrollAdmin-Org1");
const { enrollAdminOrg2 } = require("./enrollAdmin-Org2");
const { createRedisForDoctor } = require("./utils");
const { enrollRegisterUser } = require("./registerUser");
const redis = require("redis");

async function initLedger() {
  try {
    const jsonString = fs.readFileSync(
      "../artifacts/src/github.com/fabcar/javascript/lib/initLedger.json"
    );
    const orphans = JSON.parse(jsonString);
    let i = 0;
    for (i = 0; i < orphans.length; i++) {
      const attr = {
        firstName: orphans[i].firstName,
        lastName: orphans[i].lastName,
        role: "client",
      };
      let org;
      orphans[i].Org == "Org1" ? (org = "Org1") : (org = "Org2");
      await enrollRegisterUser(org, orphans[i].ID, JSON.stringify(attr));
    }
  } catch (err) {
    console.log(err);
  }
}

async function initRedis() {
  let redisPassword = "adminorg1pw";
  let redisClient = redis.createClient({
    socket: {
      host: "localhost",
      port: "6379",
    },
    password: redisPassword,
  });

  redisClient.connect();
  redisClient.on("connect", (err) => {
    console.log("admin 1 redis connected");
  });
  try {
    await redisClient.set("adminorg1", redisPassword);
    redisClient.quit();
  } catch (error) {
    console.log(error);
  }

  redisPassword = "adminorg2pw";
  redisClient = redis.createClient({
    socket: {
      host: "localhost",
      port: "6380",
    },
    password: redisPassword,
  });

  redisClient.connect();
  redisClient.on("connect", (err) => {
    console.log("admin 2 redis connected");
  });
  try {
    await redisClient.set("adminorg2", redisPassword);
    redisClient.quit();
  } catch (error) {
    console.log(error);
  }
  return;
}

async function enrollAndRegisterDoctors() {
  try {
    const jsonString = fs.readFileSync("./initDoctors.json");
    const doctors = JSON.parse(jsonString);
    for (let i = 0; i < doctors.length; i++) {
      const attr = {
        firstName: doctors[i].firstName,
        lastName: doctors[i].lastName,
        role: "doctor",
        speciality: doctors[i].speciality,
      };
      await createRedisForDoctor(doctors[i].Org,i, doctors[i].firstName)
      await enrollRegisterUser(
        doctors[i].Org,
        doctors[i].Org + "-" + "DOC" + i,
        JSON.stringify(attr)
      );
    }
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  // await enrollAdminOrg1();
  // await enrollAdminOrg2();
  // await initLedger();
  // await initRedis();
  // await enrollAndRegisterDoctors();
}

main();
