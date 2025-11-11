let naveEl = document.getElementById("NaveEl");
let x = 500;
let y = 500;
let speed = 5;

naveEl.addEventListener("keypress", (e) => {

    const telaLargura = window.innerWidth;
    const telaAltura = window.innerHeight;
    switch (e) {
        case "ArrowUp":
        case "w":
            if(y -= speed > 0) {
                y -= speed;
            } 
            break;
        case "ArrowDown":
        case "s":
            if(y += speed < telaAltura) {
                y = speed;
            }
            break;
        case "ArrowLeft":
        case "a":
            if(x -= speed < 0) {
                x -= speed;
            }
            break;
        case "ArrowoRight":
        case "d":
            if(x += speed < telaLargura) {
                x += speed;
            }
            break;
    }

    naveEl.style.left = x;
    naveEl.style.top = y;
});