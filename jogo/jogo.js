window.onload = function () {
     // --- apenas conta tempo se o jogador estiver ativo ---
    let isPlaying = true;
    let lastActivity = Date.now();
    const idleTimeout = 3000;
    const markActivity = () => { lastActivity = Date.now(); };
    ['keydown', 'mousemove', 'mousedown', 'click', 'touchstart'].forEach(ev => window.addEventListener(ev, markActivity));

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

    if (upgrades['Velocidade']) speed += upgrades['Velocidade'] * 0.25;
    if (upgrades['Dano']) dmg += upgrades['Dano'];
    if (upgrades['Defesa']) defesa = upgrades['Defesa'] * 0.05;
    if (upgrades['Regeneração']) regen = upgrades['Regeneração'] * 0.2;
    if (upgrades['Perfuração']) perf += upgrades['Perfuração'];
    if (upgrades['Sorte']) sorte += upgrades['Sorte'] * 2;
    if (upgrades['Dash']) dashAtivo = true;
    if (upgrades['FireRate']) intAtirar -= upgrades['FireRate'] * 100;
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
        if (regen > 0 && vida < vidaMax)
            vida = Math.min(vida + regen, vidaMax);
    }, 2000);

    let posX = window.innerWidth / 2 - 25;
    let posY = window.innerHeight / 2 - 25;

    let keys = {
        w: false, a: false, s: false, d: false,
        W: false, A: false, S: false, D: false
    };

    danoSound = new Audio("../sounds/dano.wav");

    let isDashing = false;
    let canDash = true;
    let dashCooldown = 1500;
    let dashDuration = 1000;
    let dashMultiplicador = 2;

    dashSound = new Audio("../sounds/dash_hiss.wav");
    dashSound.volume = 0.6;

    if (dashAtivo) {
        document.addEventListener("keydown", (e) => {
            if (e.key === " " && canDash) {
                isDashing = true;
                canDash = false;
                dashSound.play();

                setTimeout(() => { isDashing = false }, dashDuration);
                setTimeout(() => { canDash = true }, dashCooldown);
            }
        });
    }


    function checarColisao() {
        if (invulneravel) return;
        if (isDashing) return;

        const inimigos = document.querySelectorAll('.inimigo');
        const PosPersonagem = personagem.getBoundingClientRect();

        inimigos.forEach(inimigo => {
            const PosIn = inimigo.getBoundingClientRect();

            const colidiu =
                PosPersonagem.left < PosIn.right &&
                PosPersonagem.right > PosIn.left &&
                PosPersonagem.top < PosIn.bottom &&
                PosPersonagem.bottom > PosIn.top;

            if (colidiu) {
                danoSound.play();
                vida -= danoI * (1 - defesa);

                invulneravel = true;
                personagem.style.opacity = '0.5';

                setTimeout(() => {
                    invulneravel = false;
                    personagem.style.opacity = '1';
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


    function moviment() {
        let dx = 0, dy = 0;

        if (keys.w || keys.W) dy -= 1;
        if (keys.s || keys.S) dy += 1;
        if (keys.a || keys.A) dx -= 1;
        if (keys.d || keys.D) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const ang = Math.atan2(dy, dx) * 180 / Math.PI;
            personagem.style.transform = `rotate(${ang + 90}deg)`;
        }

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;

            let velFinal = speed;
            if (isDashing) velFinal *= dashMultiplicador;

            posX += dx * velFinal;
            posY += dy * velFinal;

            posX = Math.max(0, Math.min(window.innerWidth - 50, posX));
            posY = Math.max(0, Math.min(window.innerHeight - 50, posY));

            personagem.style.left = posX + 'px';
            personagem.style.top = posY + 'px';
        }

        personagem.textContent = vida.toFixed(1);

        checarColisao();
        requestAnimationFrame(moviment);
    }
    moviment();

    window.addEventListener('keydown', e => { if (e.key in keys) keys[e.key] = true; });
    window.addEventListener('keyup', e => { if (e.key in keys) keys[e.key] = false; });


    let spawntime;

    function spawnInimigo() {
        const personagemPos = personagem.getBoundingClientRect();

        if (isPlaying) {
            let posXIn, posYIn;
            const distanciaSegura = 200;

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
        }

        spawntime = setTimeout(spawnInimigo, intervalo);
    }
    spawnInimigo();

    function moverInimigos() {
        const inimigos = document.querySelectorAll('.inimigo');

        inimigos.forEach(inimigo => {
            let inimigoX = parseFloat(inimigo.style.left);
            let inimigoY = parseFloat(inimigo.style.top);

            let dx = posX - inimigoX;
            let dy = posY - inimigoY;

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

        const tiro = document.createElement('img');
        tiro.src = '../assets/tiro.png';
        tiro.className = 'tiro';

        let tiroX = posX + 20;
        let tiroY = posY + 20;

        tiro.style.left = tiroX + 'px';
        tiro.style.top = tiroY + 'px';
        tela.appendChild(tiro);

        let dx = e.clientX - tiroX;
        let dy = e.clientY - tiroY;

        const dist = Math.sqrt(dx * dx + dy * dy);
        dx /= dist;
        dy /= dist;

        if (dx !== 0 || dy !== 0) {
            const ang = Math.atan2(dy, dx) * 180 / Math.PI;
            tiro.style.transform = `rotate(${ang + 90}deg)`;
        }

        const velTiro = 8;
        let perfTiro = perf;

        let inimigosAtingidos = [];

        function moverTiro() {
            if (!tiro.parentNode) return;

            tiroX += dx * velTiro;
            tiroY += dy * velTiro;

            tiro.style.left = tiroX + 'px';
            tiro.style.top = tiroY + 'px';

            const inimigos = document.querySelectorAll('.inimigo');
            for (let inimigo of inimigos) {
                const posTiro = tiro.getBoundingClientRect();
                const posIn = inimigo.getBoundingClientRect();

                const colide =
                    posTiro.left < posIn.right &&
                    posTiro.right > posIn.left &&
                    posTiro.top < posIn.bottom &&
                    posTiro.bottom > posIn.top;

                if (colide && !inimigosAtingidos.includes(inimigo)) {
                    inimigosAtingidos.push(inimigo);

                    let vidaIn = parseInt(inimigo.dataset.vida);
                    vidaIn -= dmg;

                    if (vidaIn <= 0) {
                        inimigo.remove();
                        money += 5 * sorte;
                        localStorage.setItem('playerMoney', money);
                    } else {
                        inimigo.dataset.vida = vidaIn;
                        inimigo.textContent = vidaIn;
                    }

                    perfTiro--;
                    if (perfTiro <= 0) {
                        tiro.remove();
                        return;
                    }
                }
            }

            if (
                tiroX < 0 || tiroX > window.innerWidth ||
                tiroY < 0 || tiroY > window.innerHeight
            ) {
                tiro.remove();
                return;
            }

            requestAnimationFrame(moverTiro);
        }

        moverTiro();

        setTimeout(() => {
            podeAtirar = true;
        }, intAtirar);
    }

    window.addEventListener("click", atirar);


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

    let tempo = 0, mininicial = 0, min, seg;

    setInterval(() => {
        isPlaying = (Date.now() - lastActivity) < idleTimeout;
        timerDiv.style.opacity = isPlaying ? '1' : '0.5';
    }, 500);

    function atualizarTimer() {
        min = Math.floor(tempo / 60);
        seg = tempo % 60;

        timerDiv.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;

        if (isPlaying) tempo++;

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

        if (totalA > totalB)
            localStorage.setItem("melhorTempo", atual);
    }

    function upInimigos() {
        if (min > mininicial) {
            vidamaxInimigo += 1;
            danoI += 1;
            velInimigo += 0.2;
            mininicial = min;
        }
    }

    setInterval(upInimigos, 1000);
};

let nomeInput = document.querySelector(".nome");

let nomeDoInput;
nomeInput.addEventListener("change", () => {
    nomeDoInput = nomeInput.value;
});
