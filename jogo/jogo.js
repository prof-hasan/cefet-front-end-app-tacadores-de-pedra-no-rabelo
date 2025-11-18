window.onload = function() {
    const personagem = document.getElementById("personagem");
    const tela = document.getElementById("tela");

    let vidaMax = 20;
    let speed = 3;
    let dmg = 1;
    let defesa = 0;
    let dashAtivo = false;
    let regen = 0;
    let sorte = 2;
    let perf = 1;
    let intAtirar = 600;

    const upgrades = JSON.parse(localStorage.getItem('nivelUpgrades')) || {};
    let money = parseInt(localStorage.getItem('playerMoney')) || 0;

    if (upgrades['Velocidade']) speed += upgrades['Velocidade'] * 0.5;
    if (upgrades['Dano']) dmg += upgrades['Dano'];
    if (upgrades['Defesa']) defesa = upgrades['Defesa'] * 0.05;
    if (upgrades['Regeneração']) regen = upgrades['Regeneração'] * 0.2;
    if (upgrades['Crítico']) perf += upgrades['Crítico'];
    if (upgrades['Sorte']) sorte += upgrades['Sorte'] * 2;
    if (upgrades['Dash']) dashAtivo = true;
    if (upgrades['FireRate'])intAtirar -= upgrades['FireRate'] * 100;
    if (upgrades['Vida']) vidaMax += upgrades['Vida'] * 5;

    let vida = vidaMax;

    let invulneravel = false;
    let invulTempo = 700;
    let danoI = 2;
    let vidamaxInimigo = 5;
    let velInimigo = 2;
    let intervaloMin = 1000;
    let intervalo = 10000;
    let reducao = 0.95;
    let podeAtirar = true;

    setInterval(() => {
        if (regen > 0 && vida < vidaMax) vida = Math.min(vida + regen, vidaMax);
    }, 2000);

    let posX = window.innerWidth / 2 - 25;
    let posY = window.innerHeight / 2 - 25;
    let keys = { w: false, a: false, s: false, d: false, W: false, A: false, S: false, D: false, space: false };

    danoSound = new Audio("../sounds/dano.wav");
    function checarColisao() {
        if (invulneravel) return;
        if(emDash) return;
        const inimigos = document.querySelectorAll('.inimigo');
        const PosPersonagem = personagem.getBoundingClientRect();
        inimigos.forEach(inimigo => {
            const PosIn = inimigo.getBoundingClientRect();
            if (
                PosPersonagem.left < PosIn.right &&
                PosPersonagem.right > PosIn.left &&
                PosPersonagem.top < PosIn.bottom &&
                PosPersonagem.bottom > PosIn.top
            ) {
                danoSound.play();
                vida -= danoI * (1 - defesa);
                invulneravel = true;
                personagem.style.opacity = '0.5';
                personagem.style.pointerEvents = 'none';
                setTimeout(() => {
                    invulneravel = false;
                    personagem.style.opacity = '1';
                    personagem.style.pointerEvents = 'auto';
                }, invulTempo);
                if (vida <= 0) {
                    vida = 0;
                    salvarRecorde();
                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 300);
                }
            }
        });
    }

    dashSound = new Audio("../sounds/dash_hiss.wav");
    dashSound.volume = 0.6;
    let emDash = false;
    if(dashAtivo){
        document.addEventListener("keydown", (e) => {
                if(e.key === " " && canDash) {
                    emdash = true;
                    keys.space = true;
                    canDash = false;
                    dashSound.play();
                    setTimeout(() => emdash = false, 500);
                    setTimeout(() => canDash = true, dashCooldown);
                }
        });
    }

    let dash = 25, dashForce = 1, canDash = true, dashCooldown = 1500;
    function moviment() {
        let dx = 0, dy = 0;

        if (keys.w || keys.W){ 
            dy -= 1;
            personagem.style.transform = 'rotate(0deg)';
        }
        if (keys.s || keys.S){
            dy += 1;
            personagem.style.transform = 'rotate(180deg)';
        }
        if (keys.a || keys.A){ 
            dx -= 1;
            personagem.style.transform = 'rotate(270deg)';
        }
        if (keys.d || keys.D){ 
            dx += 1;
            personagem.style.transform = 'rotate(90deg)';
        }


        if(keys.w || keys.W) {
            if(keys.a || keys.A) {
                personagem.style.transform = 'rotate(315deg)';
            }
            if(keys.d || keys.D) {
                personagem.style.transform = 'rotate(45deg)';
            }
        }
        if(keys.s || keys.S) {
            if(keys.a || keys.A) {
                personagem.style.transform = 'rotate(225deg)';
            }   
            if(keys.d || keys.D) {
                personagem.style.transform = 'rotate(135deg)';
            }
        }

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
            if(keys.space === true) {
                keys.space = false;
                dx += dash * dashForce * dx;
                dy += dash * dashForce * dy;
            }
            posX += dx * speed;
            posY += dy * speed;
            posX = Math.max(0, Math.min(window.innerWidth - 50, posX));
            posY = Math.max(0, Math.min(window.innerHeight - 50, posY));
            personagem.style.left = posX + 'px';
            personagem.style.top = posY + 'px';
        }
        personagem.textContent = vida.toFixed(1);
        
        requestAnimationFrame(moviment);
        checarColisao();
    }
    moviment();

    window.addEventListener('keydown', e => { if (e.key in keys) keys[e.key] = true; });
    window.addEventListener('keyup', e => { if (e.key in keys) keys[e.key] = false; });

    let spawntime;
    function spawnInimigo() {
        const personagemEl = document.getElementById('personagem');
        const personagemPos = personagemEl.getBoundingClientRect();
        let posXIn, posYIn;
        let distanciaSegura = 200;
        do {
            posXIn = Math.random() * (window.innerWidth - 40);
            posYIn = Math.random() * (window.innerHeight - 40);
        } while (
            Math.abs(posYIn - personagemPos.top) < distanciaSegura ||
            Math.abs(posXIn - personagemPos.left) < distanciaSegura
        );
        const inimigo = document.createElement('div');
        inimigo.className = 'inimigo';
        inimigo.dataset.vida = vidamaxInimigo;

        inimigo.style.left = posXIn + 'px';
        inimigo.style.top = posYIn + 'px';

        inimigo.textContent = vidamaxInimigo;

        tela.appendChild(inimigo);
        intervalo = Math.max(intervaloMin, intervalo * reducao);
        spawntime = setTimeout(spawnInimigo, intervalo);
    }
    spawnInimigo();

    function moverInimigos() {
        const inimigos = document.querySelectorAll('.inimigo');
        inimigos.forEach(inimigo => {
            let inimigoX = parseFloat(inimigo.style.left) || inimigo.getBoundingClientRect().left;
            let inimigoY = parseFloat(inimigo.style.top) || inimigo.getBoundingClientRect().top;
            let alvoX = posX;
            let alvoY = posY;
            let dx = alvoX - inimigoX;
            let dy = alvoY - inimigoY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
                dx /= dist;
                dy /= dist;
                inimigoX += dx * velInimigo;
                inimigoY += dy * velInimigo;
                inimigo.style.left = inimigoX + 'px';
                inimigo.style.top = inimigoY + 'px';
            }
        });
        requestAnimationFrame(moverInimigos);
    }
    moverInimigos();

    function atirar(e) {
        if (!podeAtirar) return;
        podeAtirar = false;
        const tiro = document.createElement('div');
        tiro.className = 'tiro';

        tiro.style.left = posX + 20 + 'px';
        tiro.style.top = posY + 20 + 'px';

        tela.appendChild(tiro);
        let tiroX = posX + 20;
        let tiroY = posY + 20;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        let dx = mouseX - tiroX;
        let dy = mouseY - tiroY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) {
            dx = 0; dy = -1;
        } else {
            dx /= dist; dy /= dist;
        }
        const velTiro = 8;
        let perfTiro = perf;
        let inimigosAtingidos = [];
        function dTiro() {
            if (!tiro.parentNode) return;
            tiroX += dx * velTiro;
            tiroY += dy * velTiro;
            tiro.style.left = tiroX + 'px';
            tiro.style.top = tiroY + 'px';
            const inimigos = document.querySelectorAll('.inimigo');
            for (let i = 0; i < inimigos.length; i++) {
                const inimigo = inimigos[i];
                const posTiro = tiro.getBoundingClientRect();
                const posInimigo = inimigo.getBoundingClientRect();
                const colide = (posTiro.left < posInimigo.right &&
                                posTiro.right > posInimigo.left &&
                                posTiro.top < posInimigo.bottom &&
                                posTiro.bottom > posInimigo.top);
                if (colide && !inimigosAtingidos.includes(inimigo)) {
                    inimigosAtingidos.push(inimigo);
                    let vidaInimigoAtual = parseInt(inimigo.dataset.vida, 10) || 0;
                    vidaInimigoAtual -= dmg;
                    if (vidaInimigoAtual <= 0) {
                        if (inimigo.parentNode) inimigo.parentNode.removeChild(inimigo);
                        money += 5 * sorte;
                        localStorage.setItem('playerMoney', money);

                    } else {
                        inimigo.dataset.vida = vidaInimigoAtual;
                        inimigo.textContent = vidaInimigoAtual;
                    }
                    perfTiro--;
                    if (perfTiro <= 0) {
                        if (tiro.parentNode) tiro.parentNode.removeChild(tiro);
                        return;
                    }
                }
            }
            if (tiroX < 0 || tiroX > window.innerWidth || tiroY < 0 || tiroY > window.innerHeight) {
                if (tiro.parentNode) tiro.parentNode.removeChild(tiro);
                return;
            }
            inimigosAtingidos = inimigosAtingidos.filter(inimigo => {
                if (!inimigo.parentNode) return false;
                const posChefe = inimigo.getBoundingClientRect();
                const posT = tiro.getBoundingClientRect();
                return (
                    posT.left < posChefe.right &&
                    posT.right > posChefe.left &&
                    posT.top < posChefe.bottom &&
                    posT.bottom > posChefe.top
                );
            });
            requestAnimationFrame(dTiro);
        }
        dTiro();
        setTimeout(() => { podeAtirar = true; }, intAtirar);
    }
    window.addEventListener('click', atirar);

    const timerDiv = document.createElement("div");
    timerDiv.style.position = "fixed";
    timerDiv.style.left = "50%";
    timerDiv.style.top = "40px";
    timerDiv.style.transform = "translateX(-50%)";
    timerDiv.style.color = "#fff";
    timerDiv.style.fontSize = "2em";
    timerDiv.style.fontFamily = "monospace";
    timerDiv.style.background = "rgba(0,0,0,0.5)";
    timerDiv.style.padding = "8px 18px";
    timerDiv.style.borderRadius = "10px";
    timerDiv.style.zIndex = "9999";
    document.body.appendChild(timerDiv);

    let tempo = 0;
    let mininicial = 0;
    let min;
    let seg;

    function atualizarTimer() {
        min = Math.floor(tempo / 60);
        seg = tempo % 60;
        timerDiv.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
        tempo++;
        setTimeout(atualizarTimer, 1000);
    }

    atualizarTimer();

    function salvarRecorde() {
        const atual = timerDiv.textContent;
        const antigo = localStorage.getItem("melhorTempo");

        if (!antigo) {
            localStorage.setItem("melhorTempo", atual);
            return;
        }

        const [minA, segA] = atual.split(":").map(Number);
        const [minB, segB] = antigo.split(":").map(Number);

        const totalA = minA * 60 + segA;
        const totalB = minB * 60 + segB;

        if (totalA > totalB) {
            localStorage.setItem("melhorTempo", atual);
        }
    }

    function upInimigos(){
        if(min > mininicial){
            vidamaxInimigo += 1;
            danoI += 1;
            velInimigo += 0.2;
            mininicial = min;
        }
    }   
    setInterval(upInimigos, 1000);

}
