const fetch = require("node-fetch")

// tech test base url
const baseURL = "http://dev-challenge.thisplace.com"

// questions and the associated urls and answers
const quests = {
  "name": {
    "url": "/hello",
    "body": {
      "name": "Walter"
    }
  },
  "one": {
    "url": "/question/1/Walter/309363b7",
    "answer": {
      "body": {
        "answer": doMath(3, "*", 5)
      }
    }
  },
  "two": {
    "url": "/question/2/Walter/477fb029",
    "answer": {
      "body": {
        "answer": doMath(7, "*", 7)
      }
    }
  },
  "three": {
    "url": "/question/3/Walter/57cf80d7",
    "answer": {
      "body": {
        "answer": firstChars(4, "tops")
      }
    }
  },
  "four": {
    "url": "/question/4/Walter/af0df078",
    "answer": {
      "body": {
        "answer": firstChars(3, "thrilling")
      }
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
  @returns number - result of the math function, defaults to error
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

/*
  Returns the first characters (of length "count") of a given string
  @returns string - substring of specified length
*/
function firstChars(count, word) {
  if(count > word.length) return "Error, specified length is bigger than string"
  return word.substring(0, count)
}

// ---- QUESTIONS ---- //

// ---- GETS ---- //

// question 1
// doQuestion(quests.one.url, "GET")

// question 2
// doQuestion(quests.two.url, "GET")

// question 3
// doQuestion(quests.three.url, "GET")

// question 4
// doQuestion(quests.four.url, "GET")

// ---- ANSWERS ---- //

// question 1
// doQuestion(quests.one.url, "POST", quests.one.answer.body)

// question 2
// doQuestion(quests.two.url, "POST", quests.two.answer.body)

// question 3
// doQuestion(quests.three.url, "POST", quests.three.answer.body)

// question 4
// doQuestion(quests.four.url, "POST", quests.four.answer.body)
