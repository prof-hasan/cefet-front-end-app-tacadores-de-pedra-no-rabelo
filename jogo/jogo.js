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

 // tela do jogo
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.background = '#222';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.id = 'tela';

    // personagem
    const personagem = document.createElement('div');
    personagem.id = 'personagem';
    personagem.style.width = '50px';
    personagem.style.height = '50px';
    personagem.style.background = 'rgba(83, 206, 34, 1)';
    personagem.style.borderRadius = '10px';
    personagem.style.position = 'absolute';
    personagem.style.display = 'flex';
    personagem.style.justifyContent = 'center';
    personagem.style.alignItems = 'center';
    personagem.style.fontFamily = 'Arial, sans-serif';
    personagem.style.fontSize = '20px';
    personagem.style.color = '#fff';
