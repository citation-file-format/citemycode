
if (chrome){
    browser = chrome
}


var devLog = function(str, obj){
    // only log to console if we're in Chrome with Nerd Mode enabled.
    if (settings && settings.showOaColor && navigator.userAgent.indexOf("Chrome") > -1){
        console.log("citemycode: " + str, obj)
    }
}
devLog("citemycode is running")

// global variables:
var iframeIsInserted = false
var settings = {}
var myHost = window.location.hostname
var allSources = []
var doi
var docAsStr;


/***********************************************************************************
 *
 *  utility and UX functions
 *
 ************************************************************************************/


function insertIframe(url){
    var iframe = document.createElement('iframe');

    // make sure we are not inserting iframe again and again
    if (iframeIsInserted){
        return false
    }

    iframe.src = browser.extension.getURL('citemycode.html');

    iframe.style.height = "50px";
    iframe.style.width = '50px';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.top = '33%';
    iframe.scrolling = 'no';
    iframe.style.border = '0';
    iframe.style.zIndex = '9999999999';
    iframe.style.display = 'none;'
    iframe.id = "citemycode";

    // set a custom name and URL
    iframe.name = "green#" + encodeURI(url)

    document.documentElement.appendChild(iframe);
    iframeIsInserted = true
}


function reportInstallation(){
    // this is so the citemycode.org/welcome page knows that this user
    // has actually installed the extension.
    var loc = window.location.host
    if (loc.indexOf("citemycode.org") === 0){
        devLog("installed. adding reporting div.")
        $("<div style='display:none' id='citemycode-is-installed'></div>")
            .appendTo("body")
    }
}

// from https://davidwalsh.name/get-absolute-url
var getAbsoluteUrl = (function() {
	var a;

	return function(url) {
		if(!a) a = document.createElement('a');
		a.href = url;

		return a.href;
	};
})();





/***********************************************************************************
 *
 *  Sanity checks
 *
 ************************************************************************************/

function checkRepoLandingPageUrl(gitHubURL) {
    /* 
        Check if the URL can possibly be on a repo landing page
    */
    var regex = /^https:\/\/github.com\/[\w-]+\/[\w-]+\/?$/;
    if (regex.test(gitHubURL)) {
        return true;
    }
    else {
        return false;
    }
}


function checkUrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}


function citationCFFExists(landingPageURL) {
    // Check if URL ends with slash, if not, add it
    if (landingPageURL.substr(-1) != '/') {
        landingPageURL += '/';
    }
    // Append CITATION.cff to the URL
    landingPageURL += "blob/master/CITATION.cff"
    // Check if URL returns 404
    if (checkUrlExists(landingPageURL)) {
        return landingPageURL;
    }
    return undefined;
}





/***********************************************************************************
 *
 *  main method
 *
 ************************************************************************************/

function run() {
    reportInstallation()

    // Get the current URL
    var currUrl = window.location.href
    
    /* Check if the current URL starts with
    https://github.com
    
    We assume https protocol, as that's what GitHub
    uses per default and via forwarding from
    http.
    We also assume no www prefix, as GitHub
    forwards to non-prefixed URL per default.
    */
    if (currUrl.substring(0, 18) == "https://github.com") {
        /* 
        Check if we should show the button
        */
        if (checkRepoLandingPageUrl(currUrl)) {
            // Check if a CITATION.cff file exits according to the URL
            var cffURL = citationCFFExists(currUrl);
            if (cffURL != undefined) {
                // Switch on button
                insertIframe(cffURL)
            }
        }
    }
}

function runWithSettings(){
    browser.storage.local.get(null, function(items){
        settings = items
        devLog("got settings", settings)
        run()
    });
}

function runWithDelay(){
    var delay = 200  // milliseconds

    // Single-page apps take a while to fully load all the HTML,
    // and until they do we can't find the DOI
    var longDelayHosts = [
        "github.com"
    ]

    // it would be better to poll, but that is more complicated and we don't
    // have many reports of SPAs like this yet.
    if (longDelayHosts.includes(myHost)) {
        delay = 500
    }

    setTimeout(runWithSettings, delay)
}

runWithDelay()


















