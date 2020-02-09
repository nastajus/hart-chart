function randomLetters(quantity) {
    /* falsey check, hmm? */
    if (!quantity) quantity = 1;
    /* typescript is the way, just trying out non-typed validation */
    if (typeof quantity != 'number') return null;
    /* actual logic check */
    if (quantity < 1) return null;
 
    var alphabetResults = "";

    //exclude i, j (too thin)
    do {
        var anyAlphabetResult = Math.random().toString(36).replace(/[^abcdefghklmnopqrstuvwxyz]+/g, '').substr(0, quantity);

        alphabetResults += uniqueInOrder(anyAlphabetResult);
    } 
    while (alphabetResults.length < quantity);

    return alphabetResults.substr(0,quantity).toUpperCase();

}

function createElementGridCellIn(inputLetters, insideElement) {
    if (!inputLetters) return;
    if (typeof inputLetters != 'string') return;
    if (!isElement(insideElement)) return;

    //clear all children ... from a previous load
    while (insideElement.firstChild) {
      insideElement.removeChild(insideElement.firstChild);
    }
  
    /* splits apart per character with just '' */
    var chars = inputLetters.split('');

    //"Lucida Sans Unicode", "Lucida Grande", sans-serif;
    var letterWidths = [];
    for (var x = 0, c=''; c = inputLetters.charAt(x); x++) { 
      letterWidths[x] = getTextWidth(c, `normal 12pt "Lucida Sans Unicode", "Lucida Grande", sans-serif;`); 
      //"Lucida Sans Unicode", "Lucida Grande", sans-serif	

    }

    var rowSize = Math.pow(inputLetters.length, 0.5);

    chars.forEach(function (c, i) {
      //console.log('%d: %s', i, c);
      var newElement = document.createElement('div');
      newElement.id = i;
      newElement.className = "grid-item";
      newElement.innerHTML = c;
      insideElement.appendChild(newElement);
      

      //extract font unit (for reuse) and extract float with decimals (in that order...)
      var regex = /[^\d]+|[+-]?\d+(\.\d+)?/g;
      var widthPx = getCssOf(newElement, 'width');
      var widthParts = widthPx.match(regex);
      var widthFloat = parseFloat(widthParts[0]);
      var paddingHorizontal = `${widthFloat/2}${widthParts[1]}`;

      var isLeftSide = i % rowSize == 0;
      var isRightSide = (i + 1) % rowSize == 0;

      if (!isLeftSide) {
        newElement.style.paddingLeft = paddingHorizontal;
      }

      if (!isRightSide) {
        newElement.style.paddingRight = paddingHorizontal;      
      }


      //height cascades horribly varying padding. font-size is stable, for now, with px at least.
      //var heightPx = getCssOf(newElement, 'height');
      var heightPx = getCssOf(newElement, 'font-size');
      var heightParts = heightPx.match(regex);
      var heightFloat = parseFloat(heightParts[0]);
      var magicNumber = 6; //eye-balled as typography includes padding anyways i can't get rid of
      var paddingVertical = `${heightFloat/magicNumber}${heightParts[1]}`;

      var isTopSide = i < rowSize;
      var isBottomSide = i > inputLetters.length - rowSize - 1;

      if (!isTopSide) 
      {
        newElement.style.paddingTop = paddingVertical;
      }

      if (!isBottomSide) 
      {
        newElement.style.paddingBottom = paddingVertical;      
      }


      newElement.style.alignContent = 'center';
      
      newElement.style.backgroundColor = 'red';

      //newElement.style.height = '12px';

  
    });
  
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
  

    var fullPath = addParm('q', theLetters); 
    return fullPath;


}




function fetchUrlParams() {
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search);
    var result = searchParams.get('q');
    return result;
  }
}

//not thoroughly tested...
function fetchFullUrl() {
  if ('URLSearchParams' in window) {
    console.log(window.location);
    return `${window.location.origin}${window.location.pathname}${window.location.search}`;
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
    return newRelativePathQuery; 

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
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * Courtesy of: 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 * 
 * usage: console.log(getTextWidth("hello there!", "bold 12pt arial")); 
 */
function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}



/**
 * helper. courtesy: 
 * https://stackoverflow.com/questions/7444451/how-to-get-the-actual-rendered-font-when-its-not-defined-in-css
 * usage: css( object, 'font-size' ) 
 */
function getCssOf( element, property ) {
  return window.getComputedStyle( element, null ).getPropertyValue( property );
}

