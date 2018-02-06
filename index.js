const fetch = require("node-fetch")


const baseURL = "http://dev-challenge.thisplace.com"
const questionURLs = {
  "first": "/question/1/Walter Reis/d5202403"
}


function setName() {
  fetch(`${baseURL}/hello`, {
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
}
