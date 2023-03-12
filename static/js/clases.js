export class Book{
    constructor(name, text, current_paragraph = 0){ 
        this.name = name
        this.paragraphs = this.get_paragraphs(text)
        this.current_paragraph = current_paragraph
    }

    get_paragraphs(text){
        let paragraphs = text.split('\n')
        paragraphs = paragraphs.filter(function (el) {
            return el.length > 1;
          });
        return paragraphs
    }

    current_percentage(){
        return (this.current_paragraph + 1) / this.paragraphs.length
    }
    
}
