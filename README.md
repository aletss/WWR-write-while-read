# WWR-write-while-read
Improve your mechanography. Read and write your text loaded separated by paragraphs.

## How to use
Execute index.html

## Structure
- /static contains /static/css for the style  
- /static contains /static/js with:
  +  books.js file which contains the text you want to read and rewrite
  +  functions.js all the functions needed to process the keys and changes accordingly the CSS styles
- /python contains an example to convert any .txt into a books.js, so you can replace the text you want to practice

## Save your progress automatically
If you close and reopen the file, you will be at the start of the last paragraph you were writing  
In /static/js/functions you can see that all your progress is storage in your local memory

## Internet is not needed
All data needed is your text in books.js and your browser saving a local variable to save the last paragraph wrote

## Use your own text
Follow the example from "/python/Convert txt into js.ipynb"

## Browser
This project was created to use Chrome. I'm not sure how it's going to work using other browsers

## Special characters
I adjusted some characters to avoid extra effort while writing like "≪" will be understood as "<".  
You can change this conditions at /static/js/functions.js
