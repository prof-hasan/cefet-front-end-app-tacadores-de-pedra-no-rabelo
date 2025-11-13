window.onload = function() {
    let vidaMax = 20;
    let vida = vidaMax;
    let speed = 3;
    let dmg = 1;
    let defesa = 0;
    let dashAtivo = false;
    let escudoAtivo = false;
    let regen = 0;
    let critChance = 0.05;
    let sorte = 0;

    const upgrades = JSON.parse(localStorage.getItem('nivelUpgrades')) || {};

    if (upgrades['Velocidade']) speed += upgrades['Velocidade'] * 0.5;
    if (upgrades['Dano']) dmg += upgrades['Dano'] * 5;
    if (upgrades['Defesa']) defesa = upgrades['Defesa'] * 0.05;
    if (upgrades['Regeneração']) regen = upgrades['Regeneração'] * 0.2;
    if (upgrades['Crítico']) critChance += upgrades['Crítico'] * 0.05;
    if (upgrades['Sorte']) sorte += upgrades['Sorte'] * 2;
    if (upgrades['Dash']) dashAtivo = true;
    if (upgrades['Escudo']) escudoAtivo = true;

    let invulneravel = false;
    let invulTempo = 700;
    let danoI = 2;
    let vidamaxInimigo = 5;
    let velInimigo = 2;
    let intervaloMin = 600;
    let intervalo = 20000;
    let reducao = 0.97;
    let podeAtirar = true;
    let tamanhoTiro = 10;
    let perf = 1;
    let intAtirar = 250;

    setInterval(() => {
        if (regen > 0 && vida < vidaMax) vida = Math.min(vida + regen, vidaMax);
    }, 2000);

    function atacar() {
        let danoFinal = dmg;
        if (Math.random() < critChance) danoFinal *= 2;
        return danoFinal;
    }

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

    container.appendChild(personagem);
    document.body.appendChild(container);

    let posX = window.innerWidth / 2 - 25;
    let posY = window.innerHeight / 2 - 25;
    let keys = { w: false, a: false, s: false, d: false, W: false, A: false, S: false, D: false, space: false };

    danoSound = new Audio("../sounds/dano.wav");
    function checarColisao() {
        if (invulneravel) return;
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
                    alert('Game Over!');
                    window.location.href = "../index.html";
                }
            }
        });
    }

    dashSound = new Audio("../sounds/dash_hiss.wav");
    dashSound.volume = 0.6;
    document.addEventListener("keydown", (e) => {
            if(e.key === " " && canDash) {
                keys.space = true;
                canDash = false;
                dashSound.play();
                setTimeout(() => canDash = true, dashCooldown);
            }
    });


    let dash = 25, dashForce = 1, canDash = true, dashCooldown = 1500;
    function moviment() {
        let dx = 0, dy = 0;

        if (keys.w || keys.W) dy -= 1;
        if (keys.s || keys.S) dy += 1;
        if (keys.a || keys.A) dx -= 1;
        if (keys.d || keys.D) dx += 1;



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
            Math.abs(posXIn - personagemPos.left) < distanciaSegura &&
            Math.abs(posYIn - personagemPos.top) < distanciaSegura
        );
        const inimigo = document.createElement('div');
        inimigo.dataset.vida = vidamaxInimigo;
        inimigo.className = 'inimigo';
        inimigo.style.width = '40px';
        inimigo.style.height = '40px';
        inimigo.style.background = 'rgba(255, 0, 0, 1)';
        inimigo.style.borderRadius = '10px';
        inimigo.style.position = 'absolute';
        inimigo.textContent = vidamaxInimigo;
        inimigo.style.display = 'flex';
        inimigo.style.justifyContent = 'center';
        inimigo.style.alignItems = 'center';
        inimigo.style.fontFamily = 'Arial, sans-serif';
        inimigo.style.fontSize = '18px';
        inimigo.style.color = '#cfcfcfff';
        inimigo.style.left = posXIn + 'px';
        inimigo.style.top = posYIn + 'px';
        container.appendChild(inimigo);
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
        tiro.style.width = tamanhoTiro + 'px';
        tiro.style.height = tamanhoTiro + 'px';
        tiro.style.background = '#ff0';
        tiro.style.borderRadius = '50%';
        tiro.style.position = 'absolute';
        tiro.style.left = posX + 20 + 'px';
        tiro.style.top = posY + 20 + 'px';
        container.appendChild(tiro);
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
}
