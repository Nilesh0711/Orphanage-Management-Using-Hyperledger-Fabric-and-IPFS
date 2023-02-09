const fs = require("fs");
const { enrollAdminOrg1 } = require("./prestart/enrollAdmin-Org1");
const { enrollAdminOrg2 } = require("./prestart/enrollAdmin-Org2");
const { createRedisForDoctor } = require("./utils/utils");
const { enrollRegisterUser } = require("./prestart/registerUser");
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
        name: orphans[i].name,
        role: "orphan",
      };
      let org;
      orphans[i].org == "Org1" ? (org = "Org1") : (org = "Org2");
      await enrollRegisterUser(org, orphans[i].id, JSON.stringify(attr));
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
    const jsonString = fs.readFileSync("./prestart/initDoctors.json");
    const doctors = JSON.parse(jsonString);
    for (let i = 0; i < doctors.length; i++) {
      const attr = {
        org: doctors[i].org,
        firstName: doctors[i].firstName,
        lastName: doctors[i].lastName,
        age: doctors[i].age,
        role: "doctor",
        speciality: doctors[i].speciality,
        qualification: doctors[i].qualification,
        experience: doctors[i].experience,
        phoneNo: doctors[i].phoneNo,
        personalAddress: doctors[i].personalAddress,
      };
      await createRedisForDoctor(doctors[i].org, i);
      await enrollRegisterUser(
        doctors[i].org,
        doctors[i].org + "-" + "DOC" + i,
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
  // await enrollAndRegisterDoctors();
  // await initRedis();
}

main();
