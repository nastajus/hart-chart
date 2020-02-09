function randomLetters(quantity) {
    /* falsey check, hmm? */
    if (!quantity) quantity = 1;
    /* typescript is the way, just trying out non-typed validation */
    if (typeof quantity != 'number') return null;
    /* actual logic check */
    if (quantity < 1) return null;
 
    var alphabetResults = "";

    do {
        //exclude i, j (too thin)
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
  
    var chars = inputLetters.split('');

    chars.forEach(function (c, i) {
      //console.log('%d: %s', i, c);
      var newElement = document.createElement('div');
      newElement.id = i;
      newElement.className = "grid-item";
      newElement.innerHTML = c;
      insideElement.appendChild(newElement); 

    });

    //the hacks... yuck...
    window.parentGridElement = insideElement;

    var rowSize = Math.pow(insideElement.childElementCount, 0.5);

    //grid-template-columns: auto auto auto auto auto auto auto auto;
    //sett();
    //console.log(getStyle('.grid-container'));
    //createCSSSelector('.grid-template-columns', 'auto auto auto auto auto auto auto auto;');

    
  
}


/**
 * the padding between letters is very dependent on the elements already being sized.
 * hence there's two stages: 1) an application of CSS font (other func), 2) this padding process subsequently.
 */
function padElementsIn(parentGridElement) {

  var arrayParentElement = Array.from(parentGridElement.children);

  var index = 0;
  for (var newElement of arrayParentElement) {

    var rowSize = Math.pow(parentGridElement.childElementCount, 0.5);

    //extract font unit (for reuse) and extract float with decimals (in that order...)
    var regex = /[^\d]+|[+-]?\d+(\.\d+)?/g;
    var widthPx = getCssOf(newElement, 'width');
    var widthParts = widthPx.match(regex);
    var widthFloat = parseFloat(widthParts[0]);

    //`magicNumberWidth` is eye-balled, but exactly half the letter width seems to look good.
    var magicNumberWidth = 2;
    var paddingHorizontal = `${widthFloat/magicNumberWidth}${widthParts[1]}`;

    var isLeftSide = index % rowSize == 0;
    var isRightSide = (index + 1) % rowSize == 0;

    if (!isLeftSide) {
      newElement.style.paddingLeft = paddingHorizontal;
    }

    if (!isRightSide) {
      newElement.style.paddingRight = paddingHorizontal;      
    }


    //using 'height' causes horrible cascading varying padding. font-size is stable, for now, with px at least.
    //using 'font-size' gives a predictable number and results in consistent sizing.
    //var heightPx = getCssOf(newElement, 'height');
    var heightPx = getCssOf(newElement, 'font-size');
    var heightParts = heightPx.match(regex);
    var heightFloat = parseFloat(heightParts[0]);
    
    //`magicNumber` is eye-balled, as typography includes unremovable spacing beside letters I can't get rid of anyways
    //https://medium.engineering/typography-is-impossible-5872b0c7f891
    //"Within each box, there will be some space both above and below text. So, spacing things consistently might be trickier."
    var magicNumberHeight = 6; 
    var paddingVertical = `${heightFloat/magicNumberHeight}${heightParts[1]}`;


    var isTopSide = index < rowSize;
    var isBottomSide = index > parentGridElement.childElementCount - rowSize - 1;

    if (!isTopSide) 
    {
      newElement.style.paddingTop = paddingVertical;
    }

    if (!isBottomSide) 
    {
      newElement.style.paddingBottom = paddingVertical;      
    }

    
    // newElement.style.backgroundColor = 'red';

    // newElement.style.height = '12px';

    index++;
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
 * @see https://stackoverflow.com/questions/5999118/how-can-i-add-or-update-a-query-string-parameter
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
 * @see https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
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
 * @example: console.log(getTextWidth("hello there!", "bold 12pt arial")); 
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
 * @see https://stackoverflow.com/questions/7444451/how-to-get-the-actual-rendered-font-when-its-not-defined-in-css
 * @example: css( object, 'font-size' ) 
 */
function getCssOf( element, property ) {
  return window.getComputedStyle( element, null ).getPropertyValue( property );
}


/**
 * Uses JavaScript to conditionally trigger CSS update. 
 * @example: var matchResult = window.matchMedia("(max-width: 750px)")
 * 
 * Why? a simple media query would've sufficed for mere CSS flips, however it became necessary to determine padding *after* font-size is applied as well. 
 * I wanted to centralize in one area both operations... it might make sense to undo it... but I'm unsure of the race-condition, and I'll skip experimenting... and besides, it's cool.
 */
function toggleCss(x) {

  //not sure why i needed to put the full css path for ".grid-container .grid-item" to work...
  
  var smallStyle =`
    .grid-container {
      font-size: 12px;
    }

    button { 
      height: 35px;
    }

    button img {
      width: 25px;
      height: 25px;
    }
  `;

  var bigStyle = `
    .grid-container {
      font-size: 50px;
    }

    button { 
      height: 60px;
    }

    button img {
      width: 50px;
      height: 50px;
    }
  `;


  if (x.matches) { // If media query matches
  
    window.lastStyleNode = setStyle(smallStyle, window.lastStyleNode);
    padElementsIn(window.parentGridElement);
    
  } else {

    window.lastStyleNode = setStyle(bigStyle, window.lastStyleNode);
    padElementsIn(window.parentGridElement);
  
  }
}



/**
 * courtesy of: 
 * @see https://stackoverflow.com/questions/7125453/modifying-css-class-property-values-on-the-fly-with-javascript-jquery
 * 
 * @example: var myCSS = setStyle('*{ color:red; }'); 
 * @example: setStyle('*{ color:blue; }', myCSS); // Replaces the previous CSS with this one
 */
function setStyle(cssText) {
  var sheet = document.createElement('style');
  sheet.type = 'text/css';
  /* Optional */ window.customSheet = sheet;
  (document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
  return (setStyle = function(cssText, node) {
      if(!node || node.parentNode !== sheet)
          return sheet.appendChild(document.createTextNode(cssText));
      node.nodeValue = cssText;
      return node;
  })(cssText);
};


function sett() {
  var rules = [];
  // if (document.styleSheets[2].cssRules)
  //     rules = document.styleSheets[2].cssRules;
  // else if (document.styleSheets[2].rules)
  //     rules = document.styleSheets[2].rules;
  console.log(document.styleSheets);
  rules[0].style.color = 'red';
}



/**
 * Uncaught DOMException: Failed to read the 'rules' property from 'CSSStyleSheet': Cannot access rules
 * 
 * CIRCA 2018 
 * As of Chrome 64, new CORS rules are enforced for stylesheets. You'll need to use a local development server to do local testing of functionality that depends on the CSS Object Model. For details, see Cannot access cssRules from local css file in Chrome.
 * @see: https://stackoverflow.com/questions/49088507/cannot-access-rules-in-external-cssstylesheet
 */


/**
 * @example: alert(getStyle('.test'));
 * @see: https://stackoverflow.com/questions/324486/how-do-you-read-css-rule-values-with-javascript
 */
function getStyle(className) {
  var cssText = "";
  var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
  for (var x = 0; x < classes.length; x++) {        
      if (classes[x].selectorText == className) {
          cssText += classes[x].cssText || classes[x].style.cssText;
      }         
  }
  return cssText;
}



/**
 * @see: https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
 * @example: createCSSSelector('.mycssclass', 'display:none');
 * 
 */

function createCSSSelector (selector, style) {
  if (!document.styleSheets) return;
  if (document.getElementsByTagName('head').length == 0) return;

  var styleSheet,mediaType;

  if (document.styleSheets.length > 0) {
    for (var i = 0, l = document.styleSheets.length; i < l; i++) {
      if (document.styleSheets[i].disabled) 
        continue;
      var media = document.styleSheets[i].media;
      mediaType = typeof media;

      if (mediaType === 'string') {
        if (media === '' || (media.indexOf('screen') !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      }
      else if (mediaType=='object') {
        if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
          styleSheet = document.styleSheets[i];
        }
      }

      if (typeof styleSheet !== 'undefined') 
        break;
    }
  }

  if (typeof styleSheet === 'undefined') {
    var styleSheetElement = document.createElement('style');
    styleSheetElement.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

    for (i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].disabled) {
        continue;
      }
      styleSheet = document.styleSheets[i];
    }

    mediaType = typeof styleSheet.media;
  }

  if (mediaType === 'string') {
    for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
      if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
        styleSheet.rules[i].style.cssText = style;
        return;
      }
    }
    styleSheet.addRule(selector,style);
  }
  else if (mediaType === 'object') {
    var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
    for (var i = 0; i < styleSheetLength; i++) {
      if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
        styleSheet.cssRules[i].style.cssText = style;
        return;
      }
    }
    styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
  }
}