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

// exports
module.exports.parseArithmeticQuestion = parseArithmeticQuestion
module.exports.parseWordQuestion = parseWordQuestion
module.exports.parseGuessQuestion = parseGuessQuestion