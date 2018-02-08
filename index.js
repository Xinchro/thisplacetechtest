const fetch = require("node-fetch")
const fs = require("fs")

// tech test base url
const baseURL = "http://dev-challenge.thisplace.com"

let URLs = ["/hello"]

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
  .then(nexturl => { // question 1
    console.log("----- Getting question 1 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log("----- Answering question 1 -----")
      // question 1 is arithmetic, so we parse it as such
      const q = parseArithmeticQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doMath(q[0], q[1], q[2]))).then(response => addAndSetNextURL(getNextURL(response)))
    })
  })
  .then(nexturl => { // question 2
    console.log("----- Getting question 2 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log("----- Answering question 2 -----")
      // question 2 is arithmetic, so we parse it as such
      const q = parseArithmeticQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doMath(q[0], q[1], q[2]))).then(response => addAndSetNextURL(getNextURL(response)))
    })
  })
  .then(nexturl => { // question 3
    console.log("----- Getting question 3 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log("----- Answering question 3 -----")
      // question 3 is word question, so we parse it as such
      const w = parseWordQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doWord(w[0], w[1], w[2]))).then(response => addAndSetNextURL(getNextURL(response)))
    })
  })
  .then(nexturl => { // question 4
    console.log("----- Getting question 4 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log("----- Answering question 4 -----")
      // question 4 is a word question, so we parse it as such
      const w = parseWordQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doWord(w[0], w[1], w[2]))).then(response => addAndSetNextURL(getNextURL(response)))
    })
  })
  .then(nexturl => { // question 5
    console.log("----- Getting question 5 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log(response, "\n")
      console.log("----- Answering question 5 -----")
      // guess an initial number
      doQuestion(nexturl, "POST", answer(4))
      .then(response => {
        console.log(response, "\n")
        let remaining = parseGuessQuestion(response)[1]
        let lastGuess = [4, 9, 0] // initial guess, upper and lower limits
        let currentNumber = lastGuess[0]
        let upperLimit = lastGuess[1]
        let lowerLimit = lastGuess[2]

        // establish what our next guess should be
        // called lastGuess because it reflects the result of our last guess (even though we're doing it now)
        lastGuess = guessANumber(lastGuess[0], lastGuess[1], lastGuess[2], parseGuessQuestion(response)[0])
        if(parseGuessQuestion(response)[0] === "correct") {
          console.log("I AM INVINCIBLE")
          return
        }
        
        // ugly promise chain to spend our 3 remaining guesses
        // doQuestion(nexturl, "POST", answer(lastGuess[0]))
        doQuestion(nexturl, "POST", answer(lastGuess[0]))
        .then(response => {
          // prints the range and guesses remaining
          console.log(response, "\n")
          // new guess
          lastGuess = guessANumber(lastGuess[0], lastGuess[1], lastGuess[2], parseGuessQuestion(response)[0])
          // checks if we've got the correct value
          if(parseGuessQuestion(response)[0] === "correct") {
            console.log("I AM INVINCIBLE")
            return
          }
          doQuestion(nexturl, "POST", answer(lastGuess[0]))
          .then(response => {
            console.log(response, "\n")
            lastGuess = guessANumber(lastGuess[0], lastGuess[1], lastGuess[2], parseGuessQuestion(response)[0])
            if(parseGuessQuestion(response)[0] === "correct") {
              console.log("I AM INVINCIBLE")
              return
            }
            doQuestion(nexturl, "POST", answer(lastGuess[0]))
            .then(response => {
              console.log(response, "\n")
              if(parseGuessQuestion(response)[0] === "correct") {
                console.log("I AM INVINCIBLE")
                return
              } else {
                console.log(parseGuessQuestion(response)[0])
              }
            })
          })
        })
      })
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
  const regex = /what is [0-9] (plus|minus|times|divided by) [0-9]\?/gi // regex pattern to find the equation

  let mathQ = regex.exec(response)[0] // regex found equation
  mathQ = mathQ.split(" ") // split the question into seperate parts
  mathQ[mathQ.length-1] = mathQ[mathQ.length-1].split("?")[0] // remove the question mark

  return [mathQ[2], mathQ[3], mathQ[4]] // final question: X +|-|*|/ Y
}

/*
  Parses a response and looks for a regex pattern to match the structure of a word question
  @returns array - the important parts of the question in the form of [last|first, <number of letters>, <word to split>]
*/
function parseWordQuestion(response) {
  const regex = /what are the (first|last) [0-9] letters of the word ".*"\?/gi // regex pattern to find the equation

  let wordQ = regex.exec(response)[0] // regex found equation
  wordQ = wordQ.split(" ") // split the question into seperate parts
  wordQ[wordQ.length-1] = wordQ[wordQ.length-1].split("?")[0].split("\"")[1] // remove the question mark and quotations

  return [wordQ[3], wordQ[4], wordQ[wordQ.length-1]] // final question: last|first <number> <word>"
}

doTheThing()

/*
  Parses a response and looks for 2 regex patterns to match the structure of a guess question
  First pattern is to find if our guess was greater, less or correct
  Second pattern is to find remaining guesses
  @returns array -  [greater|less, <number of guesses left>]
*/
function parseGuessQuestion(response) {
  if(response.includes("Correct!")) {
    return ["correct", 0] // correct and 0 remaining, we won
  } else
  if(response.includes("Unfortunately")) {
    return ["We failed :(", 0]
  }

  const regex = /my number is (greater|less) than your guess\./gi // regex pattern to find the equation

  let guessQ = regex.exec(response)[0] // regex found equation
  guessQ = guessQ.split(" ") // split the question into seperate parts
  
  const remainingRegex = /you have [0-9] guess\(es\) remaining./gi // regex pattern to find the remaining sentence
  let remaining = remainingRegex.exec(response)[0].split(" ")[2] // splits at space and gets remaining guesses

  try {
    remaining = parseInt(remaining)
  } catch(err) {
    console.error("error parsing int in parseGuessQuestion()")
    console.error(err)
  }

  return [guessQ[3], remaining] // final question: greater|less <number>"
}

/*
  Makes a guess for question 5
  @returns array - [currentNo, upperLimit, lowerLimit]
*/
function guessANumber(currNo, upperNo, lowerNo, upperlower) {
  let currentNo = currNo
  let upperLimit = upperNo
  let lowerLimit = lowerNo

  if(!upperlower) {
    console.log("no upperlower, not even attempting to guess", currNo)
    return currNo
  }

  if(upperlower === "less") {
    currentNo = currNo - Math.ceil((currNo - lowerNo) / 2)
    upperLimit = currNo
    lowerLimit = lowerNo
  }
  else
  if(upperlower === "greater") {
    currentNo = currNo + Math.ceil((upperNo - currNo) / 2)
    upperLimit = upperNo
    lowerLimit = currNo
  }

  return [currentNo, upperLimit, lowerLimit]
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
  if(typeof in1 === "string") {
    try {
      in1 = parseInt(in1)
    } catch(err) {
      console.error("error parsing int in doMath() in1")
      console.error(err)
    }
  }
  if(typeof in2 === "string") {
    try {
      in2 = parseInt(in2)
    } catch(err) {
      console.error("error parsing int in doMath() in2")
      console.error(err)
    }
  }
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
  Returns the last characters (of length "count") of a given string
  @returns string - substring of specified length
*/
function lastChars(count, word) {
  if(count > word.length) return "Error, specified length is bigger than string"
  return word.substring(word.length-count, word.length)
}

/*
*/
function doWord(firstlast, count, word) {
  if(firstlast === "first") {
    return firstChars(count, word)
  } else
  if(firstlast === "last") {
    return lastChars(count, word)
  } else {
    console.error("Erroneous first|last in doWord()")
    return "Erroneous first|last"
  }
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

