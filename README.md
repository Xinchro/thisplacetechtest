# ThisPlace Technical Test

Hi. Welcome to my attempt at the technical test.

This was built with `node v6.11.3` and `npm v3.10.10`

## Getting started

`npm install` should install all the dependencies needed. (really only installed [node fetch](https://www.npmjs.com/package/node-fetch))

`node index.js` will run the program end-to-end. There is support for a custom name, such as `node index.js YourNameHere`, but if one is not provided(i.e. running just `node index.js`) a random set of characters will be generated as your name.

`index.js` is where all the question logic is.  
`getpost.js` is where question url GET/POST functionality is  
`markup.js` is where the markup saving functionality is  
`parsers.js` is where the question parsing logic is  

The questions are answered in a chain of Promises in `doTheThing()`. Each question's Promise returns the next url, which is used to GET/POST the current question and get the next url.  
Question 5's Promise is currently a little messy.

There's a small, private, function called `answer()`(in `doTheThing()`) that just creates the answer object for POSTs. I got tired of constantly typing it out.

![I AM INVINCIBLE](http://i.giphy.com/LWVn0cCgpRt8Q.gif "I AM INVINCIBLE")

---

I've commented my code to clarify any questions that may arise. But if there are any, please do ask.
