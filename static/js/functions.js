import {book_library} from './book_library.js'
import {Book}  from './clases.js'

// constants
// code for '␣'
const FAKE_SPACE_CODE = 9251

// HTML ids
const BOOK_TITLE_ID = "book-title"
const SPAN_PARAGRAPH_ID = "paragraph_number_span"
const SPAN_BOOK_PERCENTAGE_ID = "book_percentage_span"
// HTML classes

// Load book
function load_book(book_name) {
    for (let index = 0; index < book_library.length; index++) {
        const book = book_library[index]

        if (book['bookName'].toLowerCase() == book_name.toLowerCase()) {
            return new Book(book['bookName'], book['text'])
        }
    }
    console.error('Book not found:', book_name);
    return null;
}
const book_name = "Cien a\u00f1os de soledad"
let book = load_book(book_name)

// ::: On load window
first_paragraph_index = parseInt(localStorage.getItem("paragraph"));
if ( isNaN(first_paragraph_index) ) {
    var first_paragraph_index = 0
}
localStorage.setItem("paragraph", first_paragraph_index);
var last_paragraph_index = first_paragraph_index + 2

window.onload = function() {
    for (let k = 0; k < 3; k++) {
        let div_id = 'div' + (k+3)
        paragraphIntoDiv(k+first_paragraph_index, div_id)
    }

    let active_spans = document.getElementById("div3").getElementsByTagName('span')
    if (active_spans.length > 0) {
        active_spans[0].className = "blink"
    }

    update_book_progress()
    // Set book name in the title
    let title_span = document.getElementById(BOOK_TITLE_ID)
    title_span.textContent = book.name
}

// ::: On close window to save paragraph index
window.onbeforeunload = function(){
    // Do something

    // Check browser support
    if (typeof(Storage) !== "undefined") {
        // Store
        localStorage.setItem("paragraph", first_paragraph_index);

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
                } else {
                    s.classList.add("correct-character");
                }

                // In the end of the sentence
                if (i+1 == spans.length) {
                    // Delete div1 spans
                    var previous_spans = document.getElementById("div1").getElementsByTagName('span')

                    for (let j = 0; j < previous_spans.length;) {
                        let previous_span = previous_spans[0];
                        previous_span.parentNode.removeChild(previous_span);
                    }

                    for (let k = 2; k < 6; k++) {
                        previous_spans = [k];

                        // Move div (k) into div (k-1)
                        var previous_spans = document.getElementById("div" + (k)).getElementsByTagName('span')

                        for (let j = 0; j < previous_spans.length;) {
                            let previous_span = previous_spans[0];
                            previous_span.parentNode.removeChild(previous_span);
                            document.getElementById("div" + (k-1)).appendChild(previous_span);

                            // Add a "word break opportunity" element
                            if (previous_span.innerHTML.charCodeAt() == FAKE_SPACE_CODE) {
                                var wbr = document.createElement('wbr')
                                document.getElementById("div" + (k-1)).appendChild(wbr);
                            }
                        }
                    }

                    last_paragraph_index += 1
                    first_paragraph_index += 1
                    let div_id = 'div' + 5
                    paragraphIntoDiv(last_paragraph_index, div_id)
                    update_book_progress()

                    let active_spans = document.getElementById("div3").getElementsByTagName('span')
                    if (active_spans.length > 0) {
                        active_spans[0].className = "blink"
                    }
                    break;
                }
                let next_span = spans[i+1];
                next_span.className = "blink";
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
    document.getElementById(SPAN_PARAGRAPH_ID).textContent = first_paragraph_index
    let percent = percent_format(first_paragraph_index / book.paragraphs.length)
    document.getElementById(SPAN_BOOK_PERCENTAGE_ID).textContent = percent
}

function percent_format(number){
    return parseFloat(number*100).toFixed(2)+"%"
}

// ::: Inset paragraph into a div. Each character will be an span
function paragraphIntoDiv(i, div_id) {
    var div = document.getElementById(div_id);
    var previous_spans = div.getElementsByTagName('span');

    // Remove spans
    for (let j = 0; j < previous_spans.length;) {
        let previous_span = previous_spans[0];
        previous_span.parentNode.removeChild(previous_span);
    }

    // New spans
    let paragraph = book?.paragraphs[i] || ""
    for (let j = 0; j < paragraph.length; j++) {
        let character = paragraph[j];

        // Replace space for a visible character
        if (character.charCodeAt() == 32) {
            character = '␣'
        }

        let new_span = document.createElement('span')
        new_span.innerHTML = character;
        div.appendChild(new_span);

        // Add a "word break opportunity" element
        if (character.charCodeAt() == FAKE_SPACE_CODE) {
            let wbr = document.createElement('wbr')
            div.appendChild(wbr);
        }
    }
}

