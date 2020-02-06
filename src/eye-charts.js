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

function updateUrlAndHistory() {
  
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



    /* 
     * wonderful source: 
     * https://stackoverflow.com/questions/35254564/javascript-window-location-not-working
     */

    //if (window.location.protocol.includes("file")) { }
    switch (window.location.protocol) {
      case "file:":
        //pathname: "/C:/Users/GMunion/Documents/GitHub/eye-chart/index.html" (at least on my Windows)
        // Pass in a string literal

        //var url = new URL('https://example.com?foo=1&bar=2');
        //var url = new URL(window.location.href);
        //var url = new URL(window.location);
        var url = new URL('https://example.com?foo=1&bar=2');

        // Retrieve params via url.search, passed into ctor
        //var params = new URLSearchParams();

        //const params = new URLSearchParams();
        const params = new URLSearchParams(window.location.search);
        params.append('api_key', '1');
        params.append('foo', '1');
        params.append('baR', '122');
        params.append('api_key', '1');

        //TODO: better understand access restrictions possible within JS objects...
        //eg why can't i see contents of this, and how can i build an equivalent myself, and verify if 
        console.dir(url.search); //url.search, 
        console.dir(url.searchParams); //url.search, 
        console.dir(params); //url.search, 

        console.log(params.get('baR')); /// fuck ... ok!!! yikes!!
        console.log(params.entries); //does nothing useful... shows "[native code]"


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

        console.log(allParams);

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

        break;
      case "http:":
      case "https:":
        //pathname: "/hart-chart/" (at least on Github)
        break;
      default:
        //
    }
}