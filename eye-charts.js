function randomLetter(quantity) {
    /* falsey check, hmm? */
    if (!quantity) quantity = 1;
    /* typescript is the way, just trying out non-typed validation */
    if (typeof quantity != 'number') return null;
    /* actual logic check */
    if (quantity < 1) return null;
    console.log(quantity);
    
    /* bug: seeems to die at ~8  to ~10 chars... */
    // oh, it's hitting... numbers i see... and those numbers are being replaced with ''... hmm.
    //okay, i get it now.  cool. rewritten.

    var alphabetResults = "";

    do {
        alphabetResults += Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, quantity);
    } 
    while (alphabetResults.length < quantity);


    return alphabetResults.substr(0,quantity).toUpperCase();

    //Math.random()
    //out put would look like
    //0.6631204630982128

    //.toString(36) includes all 0-9 and all a-z. interesting. 
    

}

function createElementGridCellIn(inputLetters, insideElement) {
    if (!inputLetters) return;
    if (typeof inputLetters != 'string') return;
    if (!isElement(insideElement)) return;

    /* splits apart per character with just '' */
    var chars = inputLetters.split('');
    console.log(chars);

    for (var c in chars) {
        var newElement = document.createElement('div');
        newElement.id = chars[c]; newElement.className = "grid-item";
        newElement.innerHTML = chars[c];
        //document.body.appendChild(newElement);
        insideElement.appendChild(newElement);
    }
}

/* 
    source: 
        https://stackoverflow.com/questions/384286/how-do-you-check-if-a-javascript-object-is-a-dom-object
*/ 
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
  

