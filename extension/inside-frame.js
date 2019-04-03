if (typeof chrome !== "undefined"){
    browser = chrome
}

yaml = require('js-yaml')

const rp = require('request-promise');
var url = decodeURI(parts[1])
var tmp_url = toString(url).replace("github", "raw.githubusercontent")
var url = tmp_url.replace("blob/", "")


rp(url)
  .then(function(html) {
    // console.log(html);
    file = yaml.load(html)
  })
  .catch(function(err) {
     //handle error
  });


// var parts = window.name.split("#")
// var color = parts[0]
//
// $(".button")
//     .fadeIn()
//     .click(function(){
//         // todo: replace this scary alert with a message up to the
//         // unpaywall.js content script, which can then pop up
//         // a prettier and mre useful dialog box.
//         alert("CITATION")
//         if (color == "black") {
//             alert("The Unpaywall extension " +
//             "couldn't find any legal open-access version of this article.");
//         }
//         else {
//             // send a message to the extension, so it can open this url
//             // in a new tab
//             /*browser.runtime.sendMessage({"upUrl": url});*/
//         }
//     })
//
// $(".button").addClass(color)
