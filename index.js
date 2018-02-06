const fetch = require("node-fetch")

fetch("http://dev-challenge.thisplace.com/hello", {
  "method": "post",
  "body": JSON.stringify({
    "name": "Walter Reis"
  }),
  "headers": {
    "Content-Type": "application/json"
  }
})
.then(res => res.text())
.then(body => console.log(body))