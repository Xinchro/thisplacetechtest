const fetch = require("node-fetch")
const fs = require("fs")

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
  },
  "five": {
    "url": "/question/5/Walter/5e97b4de",
    "answer": {
      "body": {
        "answer": "8"
      }
    }
  },
  "winner": {
    "url": "/success/Walter/f20aec12",
    "answer": {
      "body": {
        "answer": ""
      }
    }
  }
}

let URLs = ["/hello"]
let nextURL = URLs[0]

let username = "ThisIsNotAName"

function doTheThing() {
  let newName = process.argv[2]
  if(typeof newName === "string") {
    console.log(`Your name is ${newName}!`)
    username = newName
  } else {
    username = generateName()
  }

  // setting your name
  doQuestion(URLs[0], "POST", `{"name": "${username}"}`)
  .then(response => {
    return addAndSetNextURL(getNextURL(response))
  })
  .then(nexturl => {
    console.log("----- Getting question 1 -----")
    doQuestion(nexturl, "GET")
    .then(response => {
      console.log("----- Answering question 1 -----")
      const q = parseArithmeticQuestion(response)
      console.log(q)
      logQuestion(nexturl, "POST", answer(doMath(q[0], q[1], q[2])))
    })
  })

  // simply just constructs the answer body for POSTs
  function answer(answer) {
    return `{"answer":"${answer}"}`
  }
}

/*
  Adds a URL to the URL list and sets it to the next URL
  @returns string - the next URL
*/
function addAndSetNextURL(url) {
  nextURL = addToURLs(url)
  console.log("Next URL is:", nextURL)
  return nextURL
}

/*
  Adds to the URL list and return the next(latest) URL
  @returns string - the next URL
*/
function addToURLs(url) {
  URLs.push(url)
  console.log("URLs are now:", URLs)
  return URLs[URLs.length-1]
}

/*
  Generates a name of random characters from length 5 to 10
  @returns string - the generated name
*/
function generateName() {
  let aName = ""

  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

  const nameMin = 5
  const nameMax = 10
  const nameLimit = Math.floor(Math.random() * (nameMax - nameMin) + nameMin)

  for(let i=0; i<nameLimit; i++) {
    aName = aName.concat(chars[Math.floor(Math.random() * (chars.length - 1))]) // array limit is -1 from length - goes from 0 to length
  }

  console.log("Name generated:", aName)
  return aName
}

/*
  Parses a response and looks for a regex pattern to match the structure of a URL
  @returns string - the resulting found URL
*/
function getNextURL(response) {
  // console.log("Response:", response)
  const regex = /\/.*/g // regex pattern to find the URL
  const nextURL = regex.exec(response)[0] // returns next URL after a regex match
  console.log("Next URL:", nextURL)
  return nextURL
}

/*
  Parses a response and looks for a regex pattern to match the structure of a math operation
  @returns array - the equation in the form of [X, operation, Y]
*/
function parseArithmeticQuestion(response) {
  console.log("Response:", response)
  const regex = /(w|W)hat is [0-9] (plus|minus|times|divided by) [0-9]\?/gi // regex pattern to find the equation

  let mathQ = regex.exec(response)[0] // regex found equation
  mathQ = mathQ.split(" ") // split the question into seperate parts
  mathQ[mathQ.length-1] = mathQ[mathQ.length-1].split("?")[0] // remove the question mark

  console.log("Arithmetic question:", mathQ)
  return [mathQ[2], mathQ[3], mathQ[4]] // final question: X +|-|*|/ Y
}

doTheThing()

/* question 5 breakdown

number - ask priority(lower -A- | higher -V- )
0 -    4
1 -   3
2 -  2
3 -   3
4 - 1
5 -    4
6 -   3
7 -  2
8 -   3
9 -    4

----------

lower  < - >  higher

-V-  asking order  -V-

step1-       4       
step2-     2    7    
step3-    1 3  6 8   
step4-   0    5   9  

results:
1- >4
2- >7
3- 8! Ding, ding! <confetti emoji>
4- 
*/

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

/*
  Dead simple math function
  @returns number - result of the math function, defaults to error
*/
function doMath(in1, func, in2) {
  // simple switch for +, -, *, /
  // defaults to error
  // errors on dividing by 0
  switch(func) {
    case "plus":
      return in1 + in2
      break
    case "minus":
      return in1 - in2
      break
    case "times":
      return in1 * in2
      break
    case "divided by": // no division?
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

/*
  Simple function to spit out a markup/HTML file based on a string
  @returns undefined - nothing
*/
function saveHTML(markup) {
  fs.writeFile("./winner.html", markup, "utf8", (error) => {
    if(error) {
      console.error("Failed to save markup", error)
      throw error
    }
    console.log("Markup saved successfully")
  })
}

// ---- QUESTIONS ---- //

// setting your name
// logQuestion(quests.name.url, "POST", quests.name.body)

// ---- GETS ---- //

// question 1
// logQuestion(quests.one.url, "GET")

// question 2
// logQuestion(quests.two.url, "GET")

// question 3
// logQuestion(quests.three.url, "GET")

// question 4
// logQuestion(quests.four.url, "GET")

// question 5
// logQuestion(quests.five.url, "GET")

// ---- ANSWERS ---- //

// question 1
// logQuestion(quests.one.url, "POST", quests.one.answer.body)

// question 2
// logQuestion(quests.two.url, "POST", quests.two.answer.body)

// question 3
// logQuestion(quests.three.url, "POST", quests.three.answer.body)

// question 4
// logQuestion(quests.four.url, "POST", quests.four.answer.body)

// question 5
// logQuestion(quests.five.url, "POST", quests.five.answer.body)


// ----- WINNER ----- // 
// doQuestion(quests.winner.url, "GET").then(text => saveHTML(text))

