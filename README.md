# ThisPlace Technical Test

Hi. Welcome to my attempt at the technical test.

This was built with `node v6.11.3` and `npm v3.10.10`

## Getting started

`npm install` should install all the dependencies needed. (really only installed [node fetch](https://www.npmjs.com/package/node-fetch))

`node index.js` is the basic command for doing everything.  
There's an NPM command `npm start` that'll run `node index.js` with a small reminder to uncomment the function calls in `index.js`.

`index.js` is where all the Javascript logic is.

First thing you'll notice is a `quests` object. This is where I stored the url/routes and the answers for each question.
Modify the `url` and `answer.body.answer` variables, for each question, as needed (with your unique question URLs, etc.).

I've broken down my question 5 thought process directly under the `quests` object.

Under the question 5 breakdown are my various functions.

After all my functions you'll notice a section of commented out function calls, this is for quick access to running everything.  
Just uncomment them, preferably in question order, to run the respective question/answer:

### Commented function calls:
```js
// ---- QUESTIONS ---- //

// setting your name
// logQuestion(quests.name.url, "POST", quests.name.body)

// ---- GETS ---- //

// question 1
// logQuestion(quests.one.url, "GET")
...

// ---- ANSWERS ---- //

// question 1
// logQuestion(quests.one.url, "POST", quests.one.answer.body)

...

// ----- WINNER ----- // 
// doQuestion(quests.winner.url, "GET").then(text => saveHTML(text))
```

The last one outputs the victory reply into a file called "winner.html" in the main directly.
![I AM INVINCIBLE](http://i.giphy.com/LWVn0cCgpRt8Q.gif "I AM INVINCIBLE")

---

I've commented my code to clarify any questions that may arise. But if there are any, please do ask.
