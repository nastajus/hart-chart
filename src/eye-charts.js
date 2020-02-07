function randomLetters(quantity) {
    /* falsey check, hmm? */
    if (!quantity) quantity = 1;
    /* typescript is the way, just trying out non-typed validation */
    if (typeof quantity != 'number') return null;
    /* actual logic check */
    if (quantity < 1) return null;
 
    var alphabetResults = "";

    do {
        var anyAlphabetResult = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, quantity);

        alphabetResults += uniqueInOrder(anyAlphabetResult);
    } 
    while (alphabetResults.length < quantity);

    return alphabetResults.substr(0,quantity).toUpperCase();

}

function createElementGridCellIn(inputLetters, insideElement) {
    if (!inputLetters) return;
    if (typeof inputLetters != 'string') return;
    if (!isElement(insideElement)) return;

    /* splits apart per character with just '' */
    var chars = inputLetters.split('');

    for (var c in chars) {
        var newElement = document.createElement('div');
        newElement.id = chars[c]; newElement.className = "grid-item";
        newElement.innerHTML = chars[c];
        insideElement.appendChild(newElement);
    }
}

function isElement(obj) {
    try {
      //Using W3 DOM2 (works for FF, Opera and Chrome)
      return obj instanceof HTMLElement;
    }
    catch(e){
      //Browsers not supporting W3 DOM2 don't have HTMLElement and
      //an exception is thrown and we end up here. Testing some
      //properties that all elements have (works on IE7)
      return (typeof obj==="object") &&
        (obj.nodeType===1) && (typeof obj.style === "object") &&
        (typeof obj.ownerDocument ==="object");
    }
  }
  

function uniqueInOrder(x) {
    var result = "";
    const input = Array.isArray(x) ? x : x.split('');

    for (let i = 0; i < input.length; ++i) {
        if (input[i] == input[i + 1]) continue;
        //result.push(input[i]);
        result += input[i];
    }

    return result;
    //return result.replace(',', '');
}






function updateUrlAndHistory(theLetters) {
  
    //offline when opened *directly* in browser *without* web host:
    //returns: 
    /*
    origin: "file://"
    protocol: "file:"
    host: ""
    hostname: ""
    port: ""
    pathname: "/C:/Users/GMunion/Documents/GitHub/eye-chart/index.html"
    search: ""
    hash: ""
    href: "file:///C:/Users/GMunion/Documents/GitHub/eye-chart/index.html"
    */

    /*
    to test still: offline with localhost? protocol... 
    */

    //online:
    /*
    origin: "https://nastajus.github.io"
    protocol: "https:"
    host: "nastajus.github.io"
    hostname: "nastajus.github.io"
    port: ""
    pathname: "/hart-chart/"
    search: ""
    hash: ""
    href: "https://nastajus.github.io/hart-chart/"
    */


    console.log(window.location);
    //experimentsInParams();
    addParm('q', theLetters); 


    /* 
     * wonderful source: 
     * https://stackoverflow.com/questions/35254564/javascript-window-location-not-working
     */

    //if (window.location.protocol.includes("file")) { }
    switch (window.location.protocol) {
      case "file:":
       
        break;
      case "http:":
      case "https:":
        //pathname: "/hart-chart/" (at least on Github)
        break;
      default:
        //
    }
}




function fetchUrlParams() {
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search);
    var result = searchParams.get('q');
    return result;

  }
}





/**
 * no time, just do. make work, plz.
 * https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
 */
function addParm(key, val) {
  
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, val);

    //will cause a page load, which is undesirable:
    //window.location.search = searchParams.toString();

    //won't cause page load:
    var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);

  }

}


/**
 * Courtesy of: 
 * https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
 */
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}






/**
 * delete this soon
 */
function experimentsInParams() {
   //pathname: "/C:/Users/GMunion/Documents/GitHub/eye-chart/index.html" (at least on my Windows)
        // Pass in a string literal

        //var url = new URL('https://example.com?foo=1&bar=2');
        //var url = new URL(window.location.href);
        //var url = new URL(window.location);
        var url = new URL('https://example.com?foo=1&bar=2');

        // Retrieve params via url.search, passed into ctor
        //var params = new URLSearchParams();

        //const params = new URLSearchParams();
        //const params = new URLSearchParams(window.location.search);
        var params = new URLSearchParams(window.location.search);
        params.append('api_key', '1');
        params.append('foo', '1');
        params.append('baR', '122');
        params.append('api_key', '1');

        //TODO: better understand access restrictions possible within JS objects...
        //eg why can't i see contents of this, and how can i build an equivalent myself, and verify if 
        console.dir(url.search); 
        console.dir(url.searchParams); 
        console.dir(params); 
        console.dir(url.searchParams.toString()); 
        console.dir(params.toString()); 

        console.log(params.get('bar')); //returns null
        console.log(params.get('baR')); //retuns 122 ... ok!!! cool.
        console.log(params.entries); //does nothing useful... shows "f entries() { [native code] }"
        console.log(params.searchParams); //returns undefined... because non-sensical. :/
          //vscode lesson: if it "autocompletes" with preceding icon "abc" it's a garbage-autocomp.
          //instead i should scroll down after typing . to the icons "purple isobox" for methods.
          //those are the actual intellisense operating i suspect.

          //params.searchParams.entries.entries.entries; //auto intellisense garbage. //sigh.

          console.log(params.keys) //returns "f entries() { [native code] }"
          console.log(params.values) //returns "f entries() { [native code] }"
          console.log(params.getAll ) //returns "f entries() { [native code] }"

          console.log(params.keys()) //returns "Iterator {} -i-" >> __proto__...
          console.log(params.values()) //returns "Iterator {} -i-"
          console.log(params.getAll() ) //returns "Uncaught TypeError: Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only 0 present."    

        
          //ok, there's lots at play here..
          //i keep delving down the rabbit hole...



        // Create a test URLSearchParams object
        var searchParams = new URLSearchParams("key1=value1&key2=value2");



        //var allParams = [];
        var allParams = {};
        // Log the values
        //searchParams.forEach(function(value, key) {
        params.forEach(function(value, keyy) {
          console.log(value, keyy); // how do i build a list inside a callback and return it?... i dont'... right? by side-effect of declaring a var in the outside-scope and appending inside? one, that stinks, two that may not actually work. //possibly isn't, in this case... wow, there's so much to know still about web dev.
          
          //allParams.push({keyy, value});
          //allParams.push({keyy : value });
          allParams[keyy] = value;
        });

        console.log("allParams", allParams);

        /*
        formerly printed out... when using  allParams.push({keyy, value});...
        0: {key: "api_key", value: "1"}
        1: {key: "foo", value: "1"}
        2: {key: "baR", value: "122"}
        3: {key: "api_key", value: "1"
         */

        if (allParams["api_key"]) {
          console.log("ya")
        }
        if (allParams["api_keyd"]) {
          console.log("yaaaa")
        }

        
        if (allParams.api_key) {
          console.log("yqqa")
        }
        if (allParams.api_keyd) {
          console.log("yaaqqaa")
        }


        // note: params can also be directly created
// let url = new URL('https://example.com?foo=1&bar=2');
// let params = url.searchParams;

// // or even simpler
// let params = new URLSearchParams('foo=1&bar=2');


        // Pass in a record
        var params4 = new URLSearchParams({"foo" : 1 , "bar" : 2});

}