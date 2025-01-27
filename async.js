const https = require("https");

const start = Date.now();

function doREquest() {
  https
    .request("https://www.google.com", (res) => {
      res.on("data", () => {});
      res.on("end", () => console.log(Date.now() - start));
    })
    .end();
}

doREquest();
doREquest();
doREquest();
doREquest();
doREquest();
doREquest();
