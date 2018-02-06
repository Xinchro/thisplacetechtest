const fetch = require("node-fetch")

// tech test base url
const baseURL = "http://dev-challenge.thisplace.com"

// questions and the associated urls, methods and bodies
const quests = {
  "name": {
    "method": "POST",
    "url": "/hello",
    "body": {
      "name": "Walter"
    }
  },
  "one": {
    "method": "GET",
    "url": "/question/1/Walter/309363b7"
  },
  "two": {
    "method": "POST",
    "url": "/question/1/Walter/309363b7",
    "body": {
      "answer": doMath(3, "*", 5)
    }
  },
  "three": {
    "method": "GET",
    "url": "/question/2/Walter/477fb029"
  },
  "four": {
    "method": "POST",
    "url": "/question/2/Walter/477fb029",
    "body": {
      "answer": doMath(7, "*", 7)
    }
  }
}

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
  @returns console.log TODO return the text
*/
function doQuestion(url, method, body) {
  return getOrPost(url, method, body)
  .then(res => res.text())
  .then(body => console.log(body))
}

/*
  Dead simple math function
  @returns result of the function, defaults to error
*/
function doMath(in1, func, in2) {
  // simple switch for +, -, *, /
  // defaults to error
  // errors on dividing by 0
  switch(func) {
    case "+":
      return in1 + in2
      break
    case "-":
      return in1 - in2
      break
    case "*":
      return in1 * in2
      break
    case "/":
      if(in2 === 0) {
        return "Error, dividing by zero"
      } else {
        return in1 / in2
      }
      break
    default:
      console.error("Error, unsupported math in doMath()")
      return "Error, unsupported math"
  }
}

// ---- QUESTIONS ---- //

// question 1
// doQuestion(quests.one.url, quests.one.method, quests.one.body)

// question 2
// doQuestion(quests.two.url, quests.two.method, quests.two.body)

// question 3
// doQuestion(quests.three.url, quests.three.method, quests.three.body)

// question 4
// doQuestion(quests.four.url, quests.four.method, quests.four.body)
