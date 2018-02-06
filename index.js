const fetch = require("node-fetch")

const baseURL = "http://dev-challenge.thisplace.com"

const quests = {
  "name": {
    "method": "POST",
    "url": "/hello",
    "body": JSON.stringify({
      "name": "Walter"
    })
  },
  "one": {
    "method": "GET",
    "url": "/question/1/Walter/309363b7"
  },
  "two": {
    "method": "POST",
    "url": "/question/1/Walter/309363b7",
    "body": ""
  }
}

function doQuestion(url, method, body) {
  if(method === "POST") {
    fetch(`${baseURL}${url}`, {
      "method": "post",
      "body": body,
      "headers": {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.text())
    .then(body => console.log(body))
  } else
  if(method === "GET") {
    fetch(`${baseURL}${url}`)
    .then(res => res.text())
    .then(body => console.log(body))
  }
}

// question 1
// doQuestion(quests.one.url, quests.one.method, quests.one.data)