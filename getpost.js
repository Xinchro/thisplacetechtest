const fetch = require("node-fetch")

// tech test base url
const baseURL = "http://dev-challenge.thisplace.com"

/*
  Does get or post request and returns the resulting promise
  @returns promise
*/
function getOrPost(url, method, body) {
  if(typeof body === "object") {
    body = JSON.stringify(body)
  }

  if(method === "POST") {
    // post request, sending stringified json as the body
    return fetch(`${baseURL}${url}`, {
      "method": "post",
      "body": body,
      "headers": {
        "Content-Type": "application/json"
      }
    })
  } else
  if(method === "GET") {
    // normal get request
    return fetch(`${baseURL}${url}`)
  }
}

/*
  Does the question at the specified url, with the specified method, sending the specified body
  @returns promise - resulting text
*/
function doQuestion(url, method, body) {
  return getOrPost(url, method, body)
  .then(res => res.text())
}

/*
  Alias for doQuestion with logging
  @return - undefined, nothing
*/
function logQuestion(url, method, body) {
  doQuestion(url, method, body)
  .then(text => console.log(text))
}

// exports
module.exports.getOrPost = getOrPost
module.exports.doQuestion = doQuestion
module.exports.logQuestion = logQuestion