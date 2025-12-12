
const tela = document.getElementById("tela");

function Estrela() {
    let posX = Math.round(24 * Math.random()), posY = Math.round(19 * Math.random());
    let opacidade = 0;

    let estrela = document.createElement('div');
    estrela.className = 'estrela';
    estrela.style.gridColumn = posX + ' / ' + (posX + 1);
    estrela.style.gridRow = posY + ' / ' + (posY + 1);
    estrela.style.opacity = 0;
    tela.appendChild(estrela);

    let fadeIn = setInterval(() => {
        opacidade += 0.1;
        estrela.style.opacity = opacidade;
        if(opacidade >= 1) {
            clearInterval(fadeIn);
            setTimeout(() => {
                let fadeOut = setInterval(() => {
                    opacidade -= 0.1;
                    estrela.style.opacity = opacidade;
                    if(opacidade <= 0) {
                        clearInterval(fadeOut);
                        tela.removeChild(estrela);
                    }
                }, 200);
            }, 2000);
        }
    }, 200);
}

setInterval(Estrela, 1500);
