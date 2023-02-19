// constants to interact with html
const paragraph_div = 'paragraph_number'
const book_percentage_div = 'book_percentage'

// ::: Book splited by paragraphs
var bookSplited = books[0]['text'].split('\n')

bookSplited = bookSplited.filter(function (el) {
    return el.length > 1;
  });


// ::: On load window
firstParagraphIndex = parseInt(localStorage.getItem("paragraph"));
if ( isNaN(firstParagraphIndex) ) {
    var firstParagraphIndex = 0    
}
localStorage.setItem("paragraph", firstParagraphIndex);

var lastParagraphIndex = firstParagraphIndex + 2


window.onload = function() {
    
    for (let k = 0; k < 3; k++) {
        paragraphIntoDiv(k+firstParagraphIndex, k+3)
    }

    activeSpans = document.getElementById("div3").getElementsByTagName('span')
    if (activeSpans.length > 0) {
        activeSpans[0].className = "blink"
    } 

    document.getElementById(paragraph_div).getElementsByTagName('span')[0].innerHTML = firstParagraphIndex
    pct = parseFloat((firstParagraphIndex / bookSplited.length)*100).toFixed(2)+"%"
    document.getElementById(book_percentage_div).getElementsByTagName('span')[0].innerHTML = pct

}



// ::: On close window to save paragraph index
window.onbeforeunload = function(){
    // Do something
    
    // Check browser support
    if (typeof(Storage) !== "undefined") {
        // Store
        localStorage.setItem("paragraph", firstParagraphIndex);
        
        
        } else {
        console.log("Sorry, your browser does not support Web Storage...")
    }
 }
 


// ::: Document main function: Update pointer and check correct characters

document.addEventListener('keypress', nextParagraph);
var wrong_count = 0

function nextParagraph(e) {
    
    letters_left = document.getElementsByClassName("blink");
    current_letter = letters_left[0].innerHTML.charCodeAt()

    // Fix '«', with '<'
    if (current_letter == 171 || current_letter == 38) {
        current_letter = 60
    }

    // Fix '»', with '>'
    if (current_letter == 187) {
        current_letter = 62
    }

    // Fix '—', long dash
    if (current_letter == 8212) {
        current_letter = 45
    }

    // Fix '"', double quote
    if (current_letter == 8220 || current_letter == 8221) {
        current_letter = 34
    }

    // Fix "'", single quote
    
    if (current_letter == 8217) {
        current_letter = 39
    }

    // Fix space into '␣'
    if (current_letter == 9251) {
        current_letter = 32
    }

    // Prevent scroll with spacebar
    e.preventDefault();
    
    
    if (current_letter == e.keyCode ) {

        // Get div 3 spans, current active box
        var spans = document.getElementById("div3").getElementsByTagName('span')

        // Select next blink letter
        for (let i = 0; i < spans.length; i++) {
            const s = spans[i];
            
            if (s.className == "blink") {
                s.classList.remove("blink");
                if (wrong_count > 0) {
                    s.style.color = "red";    
                } else {
                    s.style.color = "gray"
                }

                
                // In the end of the sentence
                if (i+1 == spans.length) {
                    console.log("Need more letters!");


                    // Delete div1 spans
                    var prev_spans = document.getElementById("div1").getElementsByTagName('span')

                    for (let j = 0; j < prev_spans.length;) {
                        const p_s = prev_spans[0];
                        p_s.parentNode.removeChild(p_s);    
                    }

                    for (let k = 2; k < 6; k++) {
                        prev_spans = [k];

                        // Move div (k) into div (k-1)
                        var prev_spans = document.getElementById("div" + (k)).getElementsByTagName('span')

                        for (let j = 0; j < prev_spans.length;) {
                            const p_s = prev_spans[0];
                            p_s.parentNode.removeChild(p_s);    
                            
                            document.getElementById("div" + (k-1)).appendChild(p_s); 
                            
                            // Add a "word break opportunity" element
                            if (p_s.innerHTML.charCodeAt() == 9251) {
                                
                                var wbr = document.createElement('wbr')
                                document.getElementById("div" + (k-1)).appendChild(wbr);
                            
                            }
                        }
                        
                    }
                    
                    lastParagraphIndex += 1
                    firstParagraphIndex += 1
                    paragraphIntoDiv(lastParagraphIndex, 5)
                    
                    document.getElementById(paragraph_div).getElementsByTagName('span')[0].innerHTML = firstParagraphIndex
                    pct = parseFloat((firstParagraphIndex / bookSplited.length)*100).toFixed(2)+"%"
                    document.getElementById(book_percentage_div).getElementsByTagName('span')[0].innerHTML = pct


                    activeSpans = document.getElementById("div3").getElementsByTagName('span')
                    if (activeSpans.length > 0) {
                        activeSpans[0].className = "blink"
                    }
                    
                    


                    break;
                }
                const s_1 = spans[i+1];
                s_1.className = "blink";

                console.log("go next")
                wrong_count = 0
                break;
            }
        }

    } else {
        console.log("try again")
        wrong_count += 1
    }
        
}



// ::: Inset paragraph into a div. Each character will be an span

function paragraphIntoDiv(i, divNum) {
    
    // Div
    var div = document.getElementById('div' + divNum);
    var prev_spans = div.getElementsByTagName('span');

    // Remove spans
    for (let j = 0; j < prev_spans.length;) {
        const p_s = prev_spans[0];
        p_s.parentNode.removeChild(p_s);    
    }
    
    // New spans
    paragraph = bookSplited[i]
    for (let j = 0; j < paragraph.length; j++) {
        character = paragraph[j];

        // Replace space for a visible character
        if (character.charCodeAt() == 32) {
            character = '␣'    
        }
        
        var newSpan = document.createElement('span')
        newSpan.innerHTML = character;
        div.appendChild(newSpan);

        // Add a "word break opportunity" element
        if (character.charCodeAt() == 9251) {
            var wbr = document.createElement('wbr')
            div.appendChild(wbr);
        }

        
    } 
    
   

    

}