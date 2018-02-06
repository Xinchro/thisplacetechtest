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

function getOrPost(url, method, body) {
  if(method === "POST") {
    return fetch(`${baseURL}${url}`, {
      "method": "post",
      "body": body,
      "headers": {
        "Content-Type": "application/json"
      }
    })
  } else
  if(method === "GET") {
    return fetch(`${baseURL}${url}`)
  }
}

function doQuestion(url, method, body) {
  return getOrPost(url, method, body)
  .then(res => res.text())
  .then(body => console.log(body))
}

// question 1
// doQuestion(quests.one.url, quests.one.method, quests.one.data)