let loop = ""
export function startTextAnimation(speed) {
    const loopSpeed = 800 * speed

    const elementsList = document.getElementsByClassName("textLine")
    const ui = document.getElementById('ui')
    ui.style.opacity = 1

    function startLoop() {
        let id = 0

        loop = setInterval(() => {
            // Reset
            if (id === elementsList.length) {
              closeText(elementsList[id - 1]);    
              id = 0;                
            }
            
            // Anim new Text
            openText(elementsList[id])

            // Anim old text
            if (id != 0) {
                closeText(elementsList[id - 1]);    
            }

            id += 1;
        },
          loopSpeed
        );
    }
    startLoop()

    function closeText(domElem) {
        domElem.style.transform = "translateY(-30vh)"
        domElem.style.opacity = 0

        setTimeout(() => {            
            domElem.style.transform = "translateY(30vh)";
        }, 500)
    }
    function openText(domElem) {
        domElem.style.transform = "translateY(0vh)"
        domElem.style.opacity = 1
    }
}

export function stopTextAnimation(){
    const ui = document.getElementById('ui')
    ui.style.opacity = 0

    clearInterval(loop)

    const elementsList = document.getElementsByClassName("textLine")
    for (let line of elementsList){
        line.style.transform = "translateY(-30vh)"
        line.style.opacity = 0
    }
}