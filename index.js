const fetch = require("node-fetch")


const baseURL = "http://dev-challenge.thisplace.com"
const quests = {
  "one": {
    "method": "GET",
    "url": "/question/1/Walter/309363b7"
  },
  "two": {
    "method": "POST",
    "url": "/question/1/Walter/309363b7"
  }
}

function setName() {
  fetch(`${baseURL}/hello`, {
    "method": "post",
    "body": JSON.stringify({
      "name": "Walter"
    }),
    "headers": {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.text())
  .then(body => console.log(body))
}

function question1() {
  fetch(`${baseURL}${quests.one.url}`)
  .then(res => res.text())
  .then(body => console.log(body))
}

// setName()
// question1()