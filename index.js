const { parseArithmeticQuestion, parseWordQuestion, parseGuessQuestion } = require("./parsers")
const { getAndSave, saveHTML } = require("./markup")
const { doQuestion, logQuestion } = require("./getpost")

let URLs = ["/hello"]

let username = "ThisIsNotAName"

/*
  Main function for running the entire tech test.
*/
function doTheThing() {
  // either get the name from the console input or generate one
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
    return addToURLs(getNextURL(response))
  })
  .then(nexturl => { // question 1
    console.log("----- Getting question 1 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log(response, "\n")
      console.log("----- Answering question 1 -----")
      // question 1 is arithmetic, so we parse it as such
      const q = parseArithmeticQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doMath(q[0], q[1], q[2]))).then(response => {
        console.log("Our answer:", doMath(q[0], q[1], q[2]))
        console.log(response, "\n")
        return addToURLs(getNextURL(response))
      })
    })
  })

  .then(nexturl => { // question 2
    console.log("----- Getting question 2 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log(response, "\n")
      console.log("----- Answering question 2 -----")
      // question 2 is arithmetic, so we parse it as such
      const q = parseArithmeticQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doMath(q[0], q[1], q[2]))).then(response => {
        console.log("Our answer:", doMath(q[0], q[1], q[2]))
        console.log(response, "\n")
        return addToURLs(getNextURL(response))
      })
    })
  })

  .then(nexturl => { // question 3
    console.log("----- Getting question 3 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log(response, "\n")
      console.log("----- Answering question 3 -----")
      // question 3 is word question, so we parse it as such
      const w = parseWordQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doWord(w[0], w[1], w[2]))).then(response => {
        console.log("Our answer:", doWord(w[0], w[1], w[2]))
        console.log(response, "\n")
        return addToURLs(getNextURL(response))
      })
    })
  })

  .then(nexturl => { // question 4
    console.log("----- Getting question 4 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log(response, "\n")
      console.log("----- Answering question 4 -----")
      // question 4 is a word question, so we parse it as such
      const w = parseWordQuestion(response)
      // answer the question and return with the URL of the next question
      return doQuestion(nexturl, "POST", answer(doWord(w[0], w[1], w[2]))).then(response => {
        console.log("Our answer:", doWord(w[0], w[1], w[2]))
        console.log(response, "\n")
        return addToURLs(getNextURL(response))
      })
    })
  })

  .then(nexturl => { // question 5
    console.log("----- Getting question 5 -----")
    // get the question and, once it's been answered, return with the URL of the next question
    return doQuestion(nexturl, "GET")
    .then(response => {
      console.log(response, "\n")
      console.log("----- Answering question 5 -----")
      // TODO - VERY UGLY MESS, NEEDS FIXING
      // guess an initial number
      doQuestion(nexturl, "POST", answer(4))
      .then(response => {
        console.log(response)
        console.log("Our answer, guess 1:", 4)
        console.log("\n")
        let lastGuess = [4, 9, 0] // initial guess(4), upper(9) and lower(0) limits
        let currentNumber = lastGuess[0]
        let upperLimit = lastGuess[1]
        let lowerLimit = lastGuess[2]

        // if we're correct, shout and end the program
        // also save the victory markup as a file
        if(parseGuessQuestion(response)[0] === "correct") {
          console.log("I AM INVINCIBLE")
          getAndSave(doQuestion(getNextURL(response), "GET"))
          return
        }

        // establish what our next guess should be
        // called lastGuess because it reflects the result of our last guess (even though we're doing it now)
        lastGuess = guessANumber(lastGuess[0], lastGuess[1], lastGuess[2], parseGuessQuestion(response)[0])
        
        // ugly promise chain to spend our 3 remaining guesses
        // doQuestion(nexturl, "POST", answer(lastGuess[0]))
        doQuestion(nexturl, "POST", answer(lastGuess[0]))
        .then(response => {
          console.log(response)
          console.log("Our answer, guess 2:", lastGuess[0])
          console.log("\n")
          // new guess
          lastGuess = guessANumber(lastGuess[0], lastGuess[1], lastGuess[2], parseGuessQuestion(response)[0])
          if(parseGuessQuestion(response)[0] === "correct") {
            console.log("I AM INVINCIBLE")
            getAndSave(doQuestion(getNextURL(response), "GET"))
            return
          }
          doQuestion(nexturl, "POST", answer(lastGuess[0]))
          .then(response => {
            console.log(response)
            console.log("Our answer, guess 3:", lastGuess[0])
            console.log("\n")
            lastGuess = guessANumber(lastGuess[0], lastGuess[1], lastGuess[2], parseGuessQuestion(response)[0])
            if(parseGuessQuestion(response)[0] === "correct") {
              console.log("I AM INVINCIBLE")
              getAndSave(doQuestion(getNextURL(response), "GET"))
              return
            }
            doQuestion(nexturl, "POST", answer(lastGuess[0]))
            .then(response => {
              console.log(response)
              console.log("Our answer, guess 4(final):", lastGuess[0])
              console.log("\n")
              if(parseGuessQuestion(response)[0] === "correct") {
                console.log("I AM INVINCIBLE")
                getAndSave(doQuestion(getNextURL(response), "GET"))
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
  Adds to the URL list and return the next(latest) URL
  @returns string - the next URL
*/
function addToURLs(url) {
  URLs.push(url)
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
  return nextURL
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

  // checks if our number was less or greater than the actual number
  if(upperlower === "less") {
    // sets our current number to the halfway point between the current number and the lower limit
    currentNo = currNo - Math.ceil((currNo - lowerNo) / 2)
    // sets the upper limit to the current number
    upperLimit = currNo
  }
  else
  if(upperlower === "greater") {
    // sets our current number to the halfway point between the current number and the upper limit
    currentNo = currNo + Math.ceil((upperNo - currNo) / 2)
    // sets out lower limit to the current number
    lowerLimit = currNo
  }

  return [currentNo, upperLimit, lowerLimit]
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
  Simple logic to decide if we're looking for the first or last characters in a string
  @returns string - substring of specified length, from either the start or end of a string, error message is there's a problem
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
}

doTheThing()
