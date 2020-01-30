function randomLetter(quantity) {
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
