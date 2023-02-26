# WWR-write-while-read
Improve your mechanography. Read and write your text loaded.

## How to use
1. To run it locally, run a server first. Example running server from folder with the index.html file:
```bash
python3 -m http.server 8001
```
2. Open `index.html`. Example http://127.0.0.1:8001/index.html

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

## Author recommendations
If you don't use all your fingers. I recommend you to start with https://www.keybr.com/  
If you are on the next level, you make almost no mistakes, I recommend you to improve your speed at https://play.typeracer.com/  

This project was inspired as a combination of those two resources.   
I use this project to practice while reading, so I don't feel external pressure
