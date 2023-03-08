import {Book}  from './clases.js'

//constants
// code for '␣'
const FAKE_SPACE_CODE = 9251

// constants to interact with html
const paragraph_div = 'paragraph_number'
const book_percentage_div = 'book_percentage'

// ::: Book splited by paragraphs
let bookName = books[0]['bookName']
let text = books[0]['text']
let book = new Book(text)

// ::: On load window
firstParagraphIndex = parseInt(localStorage.getItem("paragraph"));
if ( isNaN(firstParagraphIndex) ) {
    var firstParagraphIndex = 0    
}
localStorage.setItem("paragraph", firstParagraphIndex);
var lastParagraphIndex = firstParagraphIndex + 2

window.onload = function() {
    for (let k = 0; k < 3; k++) {
        let div_id = 'div' + (k+3)
        paragraphIntoDiv(k+firstParagraphIndex, div_id)
    }

    let activeSpans = document.getElementById("div3").getElementsByTagName('span')
    if (activeSpans.length > 0) {
        activeSpans[0].className = "blink"
    } 

    update_book_progress()
    // Set book name in the title
    let titleSpan = document.getElementById("book-title")
    titleSpan.textContent = bookName
    console.log(bookName)
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

function fix_char_codes(code){
    // Fix '«', with '<'
    if (code == 171 || code == 38) {
        code = 60
    }

    // Fix '»', with '>'
    if (code == 187) {
        code = 62
    }

    // Fix '—', long dash
    if (code == 8212) {
        code = 45
    }

    // Fix '"', double quote
    if (code == 8220 || code == 8221) {
        code = 34
    }

    // Fix "'", single quote
    
    if (code == 8217) {
        code = 39
    }

    // Fix space into '␣'
    if (code == FAKE_SPACE_CODE) {
        code = 32
    }

    return code
}

function nextParagraph(e) {
    let letters_left = document.getElementsByClassName("blink");
    let current_letter_code = letters_left[0].innerHTML.charCodeAt()
    current_letter_code= fix_char_codes(current_letter_code)
    // Prevent scroll with spacebar
    e.preventDefault();

    if (current_letter_code == e.keyCode ) {
        // Get div 3 spans, current active box
        var spans = document.getElementById("div3").getElementsByTagName('span')

        // Select next blink letter
        for (let i = 0; i < spans.length; i++) {
            const s = spans[i];

            if (s.className == "blink") {
                s.classList.remove("blink");
                if (wrong_count > 0) {
                    s.classList.add("error-character");
                    //s.style.color = "red";    
                } else {
                    s.classList.add("correct-character");
                    //s.style.color = "blue"
                }

                // In the end of the sentence
                if (i+1 == spans.length) {
                    // Delete div1 spans
                    var prev_spans = document.getElementById("div1").getElementsByTagName('span')

                    for (let j = 0; j < prev_spans.length;) {
                        let p_s = prev_spans[0];
                        p_s.parentNode.removeChild(p_s);    
                    }

                    for (let k = 2; k < 6; k++) {
                        prev_spans = [k];

                        // Move div (k) into div (k-1)
                        var prev_spans = document.getElementById("div" + (k)).getElementsByTagName('span')

                        for (let j = 0; j < prev_spans.length;) {
                            let p_s = prev_spans[0];
                            p_s.parentNode.removeChild(p_s);    
                            document.getElementById("div" + (k-1)).appendChild(p_s); 

                            // Add a "word break opportunity" element
                            if (p_s.innerHTML.charCodeAt() == FAKE_SPACE_CODE) {
                                var wbr = document.createElement('wbr')
                                document.getElementById("div" + (k-1)).appendChild(wbr);   
                            }
                        }   
                    }

                    lastParagraphIndex += 1
                    firstParagraphIndex += 1
                    let div_id = 'div' + 5
                    paragraphIntoDiv(lastParagraphIndex, div_id)
                    update_book_progress()
                    
                    let activeSpans = document.getElementById("div3").getElementsByTagName('span')
                    if (activeSpans.length > 0) {
                        activeSpans[0].className = "blink"
                    }
                    break;
                }
                let s_1 = spans[i+1];
                s_1.className = "blink";
                wrong_count = 0
                break;
            }
        }
    } else {
        console.log("try again")
        wrong_count += 1
    }       
}

function update_book_progress(){
    document.getElementById("paragraph_number_span").textContent = firstParagraphIndex
    let pct = percent_format(firstParagraphIndex / book.paragraphs.length)
    document.getElementById("book_percentage_span").textContent = pct
}

function percent_format(number){
    return parseFloat(number*100).toFixed(2)+"%"
}

// ::: Inset paragraph into a div. Each character will be an span
function paragraphIntoDiv(i, div_id) {
    var div = document.getElementById(div_id);
    var prev_spans = div.getElementsByTagName('span');

    // Remove spans
    for (let j = 0; j < prev_spans.length;) {
        const p_s = prev_spans[0];
        p_s.parentNode.removeChild(p_s);    
    }

    // New spans
    let paragraph = book.paragraphs[i]
    for (let j = 0; j < paragraph.length; j++) {
        let character = paragraph[j];

        // Replace space for a visible character
        if (character.charCodeAt() == 32) {
            character = '␣'    
        }

        var newSpan = document.createElement('span')
        newSpan.innerHTML = character;
        div.appendChild(newSpan);

        // Add a "word break opportunity" element
        if (character.charCodeAt() == FAKE_SPACE_CODE) {
            var wbr = document.createElement('wbr')
            div.appendChild(wbr);
        }        
    } 
}
