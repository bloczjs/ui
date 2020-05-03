// @ts-check

const https = require("https");

/**
 * @param {string} name
 */
const checkIfPackageDoesntExist = (name) =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: "www.npmjs.com",
      port: 443,
      path: `/package/${name}`,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      if (res.statusCode < 300) {
        reject(`Package ${name} already exists`);
      } else {
        resolve(res.statusCode);
      }
    });

    req.on("error", (e) => {
      console.error(e);
    });
    req.end();
  });

module.exports = { checkIfPackageDoesntExist };
