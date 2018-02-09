const fs = require("fs")
const path = require("path")

/*
  Gets and saves the markup from the response to a Promise
*/
function getAndSave(responsePromise) {
  responsePromise
  .then(markup => {
    saveHTML(markup)
  })
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
    console.log(`Markup saved successfully to ${path.join(__dirname, "/winner.html")}`)
  })
}

// exports
module.exports.getAndSave = getAndSave
module.exports.saveHTML = saveHTML