window.onload = function() {
    // atributos
let vidamax = 3; // vida máxima
let vida = vidamax;
let dmg = 1.0; // dano
let chDmg = 5;
let perf = 1; // quantos inimigos o tiro pode acertar
let speed = 4; // velocidade do personagem
let vidamaxInimigo = 2; // vida máxima do inimigo
let vidamaxchefe = 100;
let vidachefe = vidamaxchefe
let vidaInimigo = vidamaxInimigo; // vida do inimigo
let velInimigo = 2; // velocidade do inimigo
let intAtirar = 1000; // intervalo de tiro em ms
let invulTempo = 1000; // tempo de invulnerabilidade em ms
let XP = 0; // experiência
let XPparaNivel = 5; // experiência necessária para subir de nível
let dropXP = 3; // XP máximo que um inimigo pode dropar
let HProubo = 0 // quantidade maxima de vida que pode ser roubada por inimigo
let recover = 0.5; // vida recuperada ao subir de nível
let danoI = 1; // dano que o inimigo causa ao personagem
let debuff = 1; // multiplicador de dificuldade
let tamanahoTiro = 10; // tamanho do tiro
let tempo = 20; // tempo em minutos
let Cura = 0; //quantidade curada por item, se 0 = sem item
let dinheiro = 0;//dinheiro gasto fora do jogo
let Ganhar = 1;//Dinheiro Ganho ao matar um inimigo
let instUp = 0; //niveis ja ganhos no inicio    

let precos =[50, 20, 100, 100, 90, 200, 50];
let niveis = [0, 0, 0, 0, 0, 0, 0]; // nível atual de cada upgrade
let nivelMax = [20, 50, 15, 3, 5, 5, 10]; // nível máximo de cada upgrade
const upgrades = document.querySelectorAll('.upgrade'); 
let tipo = ['Dinheiro ganho', 'Intervalo de Tiro', 'Tempo', 'Tamanho do projetil', 'Itens de Cura', 'Níveis instantâneos', 'Taxa de XP'];

function aplicarUpgradesSalvos() {
    niveis.forEach((nivel, index) => {
        if (nivel >= 0) {
            // Aplique os efeitos permanentes de acordo com o tipo do upgrade
            switch(index) {
                case 0: // Dinheiro ganho
                    Ganhar += nivel * 5;
                    break;
                case 1://Intervalo de Tiro
                    intAtirar -= nivel * 10;
                    break;
                case 2: // Tempo
                    tempo -= nivel;
                    break;
                case 3: // Tamanho do projetil
                    tamanahoTiro += 10 * nivel;
                    break;
                case 4: // Itens de Cura
                    Cura += nivel;
                    break;
                case 5: // Níveis instantâneos
                    instUp += nivel;
                    break;
                case 6:
                    dropXP += 2 * nivel;
                    break;
            }
        }
    });
}


// Tenta recuperar dados salvos
if (localStorage.getItem('niveis')) {
    niveis = JSON.parse(localStorage.getItem('niveis'));
}
if (localStorage.getItem('precos')) {
    precos = JSON.parse(localStorage.getItem('precos'));
}
if (localStorage.getItem('dinheiro')) {
    dinheiro = parseInt(localStorage.getItem('dinheiro'));
}

function salvarProgresso() {
    localStorage.setItem('niveis', JSON.stringify(niveis));
    localStorage.setItem('precos', JSON.stringify(precos));
    localStorage.setItem('dinheiro', dinheiro);
}

aplicarUpgradesSalvos()


upgrades.forEach((botao, upgrade) => {
    botao.innerHTML = `${tipo[upgrade]} <br><br> Nível ${niveis[upgrade]}/${nivelMax[upgrade]} <br> $${precos[upgrade]}`;

    botao.addEventListener('click', ()=>{
            if(niveis[upgrade] < nivelMax[upgrade]){
                if(dinheiro >= precos[upgrade]){
                    dinheiro -= precos[upgrade];
                    niveis[upgrade] ++;

                    atualizarDinheiro();
                    salvarProgresso();

                    switch(upgrade) {
                        case 0: // Dinheiro ganho
                            Ganhar += 5 ;
                            precos[upgrade] += 50;
                            break;
                        case 1://Intervalo de Tiro
                            intAtirar -=10;
                            precos[upgrade] += 50;
                            break;
                        case 2: // Tempo
                            tempo -= 1;
                            precos[upgrade] += 200;
                            break;
                        case 3: // Tamanho do projetil
                            tamanahoTiro += 10;
                            precos[upgrade] += 100;
                            break;
                        case 4: // Itens de Cura
                            Cura += 1;
                            precos[upgrade] += 50;
                            break;
                        case 5: // Níveis instantâneos
                            instUp += 1;
                            precos[upgrade] += 400;
                            break;
                        case 6:
                            dropXP += 1;
                            precos[upgrade] += 100;
                            break;
                    }

                    botao.innerHTML = `${tipo[upgrade]} <br> <br> <p>Nível ${niveis[upgrade]}/${nivelMax[upgrade]} <br> $${precos[upgrade]}</p>`;
                    
                    
                }
            }else if(niveis[upgrade] === nivelMax[upgrade]){
                botao.innerHTML = `${tipo[upgrade]} <br> Nível Max.`;
            }
    })
});

// Cria o menu de dinheiro
const abaDinheiro = document.createElement('div');
abaDinheiro.id = 'aba-dinheiro';
abaDinheiro.style.position = 'fixed';
abaDinheiro.style.top = '50px';
abaDinheiro.style.right = '10px';
abaDinheiro.style.backgroundColor = '#181616ff';
abaDinheiro.style.color = '#fff';
abaDinheiro.style.padding = '10px 15px';
abaDinheiro.style.borderRadius = '8px';
abaDinheiro.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 1)';
abaDinheiro.style.fontFamily = 'Arial, sans-serif';
abaDinheiro.style.fontSize = '16px';
abaDinheiro.style.zIndex = '9999';
abaDinheiro.style.userSelect = 'none';
abaDinheiro.innerText = `Dinheiro: $${dinheiro}`;

document.body.appendChild(abaDinheiro);

function atualizarDinheiro() {
    abaDinheiro.innerText = `Dinheiro: $${dinheiro}`;
}




    let podeAtirar = true;

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

    container.appendChild(personagem);
    document.body.appendChild(container);

    // movimentação
    let posX = window.innerWidth / 2 - 25;
    let posY = window.innerHeight / 2 - 25;
    let keys = { w: false, a: false, s: false, d: false, W: false, A: false, S: false, D: false}; // controle de teclas
    let invulneravel = false;

    // Função para atualizar a exibição do XP na tela
    function atualizarXP() {
        const aba = document.getElementById('abaXP');
        if (aba) {
            aba.textContent = `XP: ${XP} / ${XPparaNivel}`;
        } else {
            const novaAba = document.createElement('div');
            novaAba.id = 'abaXP';
            novaAba.style.position = 'fixed';
            novaAba.style.bottom = '20px';
            novaAba.style.left = '50%';
            novaAba.style.transform = 'translateX(-50%)';
            novaAba.style.background = 'rgba(0, 0, 0, 0.5)';
            novaAba.style.color = '#fff';
            novaAba.style.padding = '10px 20px';
            novaAba.style.borderRadius = '10px';
            novaAba.style.fontFamily = 'Arial, sans-serif';
            novaAba.style.fontSize = '16px';
            novaAba.style.zIndex = '10000';
            novaAba.textContent = `XP: ${XP} / ${XPparaNivel}`;
            document.body.appendChild(novaAba);
        }
    }

    // Atualiza XP inicialmente
    setInterval(atualizarXP(), 1000);

    function checarColisao() {
        if (invulneravel) 
            return;
        const inimigos = document.querySelectorAll('.inimigo');
        const chefes = document.querySelectorAll('.chefe');
        const PosPersonagem = personagem.getBoundingClientRect();
        inimigos.forEach(inimigo => {
            const PosIn = inimigo.getBoundingClientRect();
            // checa a colisão do personagem com o inimigo
            if (
                PosPersonagem.left < PosIn.right &&
                PosPersonagem.right > PosIn.left &&
                PosPersonagem.top < PosIn.bottom &&
                PosPersonagem.bottom > PosIn.top
            ) {
                vida-= danoI;
                // tempo de invulnerabilidade
                invulneravel = true;
                personagem.style.opacity = '0.5';
                personagem.style.pointerEvents = 'none'; // intangibilidade
                setTimeout(() => {
                    invulneravel = false;
                    personagem.style.opacity = '1';
                    personagem.style.pointerEvents = 'auto';
                }, invulTempo);
                if (vida <= 0) {
                    // morte
                    window.location.href = "../index.html";
                    alert('Game Over!');
                }
            }
        });

        chefes.forEach(chefe => {
            const PosIn = chefe.getBoundingClientRect();
            // checa a colisão do personagem com o inimigo
            if (
                PosPersonagem.left < PosIn.right &&
                PosPersonagem.right > PosIn.left &&
                PosPersonagem.top < PosIn.bottom &&
                PosPersonagem.bottom > PosIn.top
            ) {
                vida-= chDmg;
                // tempo de invulnerabilidade
                invulneravel = true;
                personagem.style.opacity = '0.5';
                personagem.style.pointerEvents = 'none'; // intangibilidade
                setTimeout(() => {
                    invulneravel = false;
                    personagem.style.opacity = '1';
                    personagem.style.pointerEvents = 'auto';
                }, invulTempo);
                if (vida <= 0) {
                    // morte
                    window.location.reload();
                    alert('Game Over!');
                }
            }
        });
    }

    function Curar() {
        if (Cura === 0) return;

        for (let i = 0; i < Cura; i++) {
            const heal = document.createElement('div');
            heal.className = 'curar';
            heal.style.width = '20px';
            heal.style.height = '20px';
            heal.style.background = 'rgb(0, 255, 13)';
            heal.style.borderRadius = '50%';
            heal.style.position = 'absolute';

            // Posição aleatória
            heal.style.left = Math.random() * (window.innerWidth - 40) + 'px';
            heal.style.top = Math.random() * (window.innerHeight - 40) + 'px';

            container.appendChild(heal);
        }
    }

    // Chama Curar a cada 10 segundos 
    setInterval(Curar, 10000);

    function checarCura() {
        const heals = document.querySelectorAll('.curar');
        const PosPersonagem = personagem.getBoundingClientRect();

        heals.forEach(heal => {
            const PosHeal = heal.getBoundingClientRect();

            // checa a colisão do personagem com o heal
            if (
                PosPersonagem.left < PosHeal.right &&
                PosPersonagem.right > PosHeal.left &&
                PosPersonagem.top < PosHeal.bottom &&
                PosPersonagem.bottom > PosHeal.top
            ) {
                if (vida < vidamax) {
                    vida += 1; // cura
                    if(vida > vidamax){
                        vida -= vida - vidamax;
                    }
                }
                heal.remove(); // remove o elemento de cura
            }
        });
    }

    function moviment() {
        let dx = 0,
            dy = 0;
        if (keys.w || keys.W) dy -= 1;
        if (keys.s || keys.S) dy += 1;
        if (keys.a || keys.A) dx -= 1;
        if (keys.d || keys.D) dx += 1;
        if (dx !== 0 || dy !== 0) {
            // movimento diagonal sem aceleração extra
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
            posX += dx * speed;
            posY += dy * speed;
            // Limites
            posX = Math.max(0, Math.min(window.innerWidth - 50, posX));
            posY = Math.max(0, Math.min(window.innerHeight - 50, posY));
            personagem.style.left = posX + 'px';
            personagem.style.top = posY + 'px';
            personagem.textContent = vida.toFixed(1);
        }
        checarCura();
        checarColisao();
        requestAnimationFrame(moviment);
    }
    moviment();

    window.addEventListener('keydown', e => {
        if (e.key in keys) keys[e.key] = true;
    });
    window.addEventListener('keyup', e => {
        if (e.key in keys) keys[e.key] = false;
    });

    

    // Timer regressivo centralizado no topo
    let tempoRestante = tempo * 60; // X minutos
    const timerDiv = document.createElement('div');
    timerDiv.style.position = 'fixed';
    timerDiv.style.left = '50%';
    timerDiv.style.top = '40px';
    timerDiv.style.transform = 'translateX(-50%)';
    timerDiv.style.color = '#fff';
    timerDiv.style.fontSize = '2em';
    timerDiv.style.fontFamily = 'monospace';
    timerDiv.style.background = 'rgba(0,0,0,0.5)';
    timerDiv.style.padding = '8px 18px';
    timerDiv.style.borderRadius = '10px';
    timerDiv.style.zIndex = '9999';
    document.body.appendChild(timerDiv);

    function atualizarTimer() {
        let min = Math.floor(tempoRestante / 60);
        let seg = tempoRestante % 60;
        timerDiv.textContent = `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
        if(timerDiv.textContent === '04:00' || timerDiv.textContent === '03:00' || timerDiv.textContent === '02:00' ){
            let reliquia = Math.floor(Math.random() *3);
            switch(reliquia){
                case 0:
                    alert('Você encontrou a Relíquia do tempo! avance 30 segundos.');
                    tempoRestante -= 30;
                    break;
                case 1:
                    alert('Você encontrou a Relíquia da experiência! Xp para subir de nível necessário dividido por 2.');
                    XPparaNivel = Math.floor(XPparaNivel / 2);
                    atualizarXP();
                    subirNivel();
                    break;
                case 2:
                    alert('Você encontrou a Relíquia do sacerdore! Inimigos agora demoram 10% mais para nascer.');
                    intervalo += intervalo / 10;
                    break;
            }
        }

        if (tempoRestante > 0) {
            tempoRestante--;
            setTimeout(atualizarTimer, 1000);
        } else {
            timerDiv.textContent = '00:00';
            alert('Parabéns! Você sobreviveu!');
            window.location.reload();
        }
    }
    atualizarTimer();

    //intervalo de spanw de inimigo
    let intervalo = 10000/debuff;
    let intervaloMin = 500;
    let reducao = 0.95;

    let spawntime;
    //spawnar inimigo
    function spawnInimigo() {
        const personagem = document.getElementById('personagem');
        const personagemPos = personagem.getBoundingClientRect();

        let posX, posY;
        let distanciaSegura = 200;

        // Tenta gerar uma posição até que fique a uma distância segura do personagem
        do {
            posX = Math.random() * (window.innerWidth - 40);
            posY = Math.random() * (window.innerHeight - 40);
        } while (
            Math.abs(posX - personagemPos.left) < distanciaSegura &&
            Math.abs(posY - personagemPos.top) < distanciaSegura
        );

        const inimigo = document.createElement('div');
        inimigo.dataset.vida = vidamaxInimigo; // vida individual do inimigo
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

        inimigo.style.left = posX + 'px';
        inimigo.style.top = posY + 'px';

        container.appendChild(inimigo);
        
        intervalo = Math.max(intervaloMin, intervalo * reducao);
        spawntime = setTimeout(spawnInimigo, intervalo);
    }


    spawnInimigo();

    if(timerDiv.textContent === '05:00'){
        desafio = Math.floor(Math.random() * 5);
        switch(desafio){
            case 0:
                alert('Você encontrou a Relíquia do desafio! inimigos agora causam o triplo de dano, tem o dobro de vida,e aparecem 3x mais rápido, mas dropam 4x mais XP, são mais lentos, e o tempo está pela metade');
                vidamaxInimigo *= 2;
                velInimigo /= 2;
                dropXP *= 4;
                tempoRestante = 2.5 * 60;
                danoI *= 3;
                debuff = 3;
                break;
            default:
                break;
        }
    }   



    function status(){
        const statusDiv = document.createElement('div');
        statusDiv.id = 'statusDiv';
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '50px';
        statusDiv.style.left = '20px';
        statusDiv.style.background = 'rgba(0, 0, 0, .5)';
        statusDiv.style.color = '#fff';
        statusDiv.style.padding = '10px 20px';
        statusDiv.style.width = '400px'
        statusDiv.style.borderRadius = '10px';
        statusDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        document.body.appendChild(statusDiv);
    }

    //Status com a tecla esc
    let statusAtivo = false;

    //status
    // atualiza o status a cada segundo se estiver ativo
    setInterval(() => {
        if(statusAtivo){
            const statusDiv = document.getElementById('statusDiv');
            if (statusDiv) {
                statusDiv.innerHTML = "<em>Status:</em><br>" +
                `Vida: ${vida.toFixed(1)} / ${vidamax}<br>` +
                `Dano: ${dmg}<br>` +
                `Perfuração: ${perf}<br>` +
                `Velocidade: ${speed}<br>` +
                `Vida Inimiga: ${vidamaxInimigo}<br>` +
                `Velocidade Inimiga: ${velInimigo}<br>` +
                `Intervalo de Tiro: ${intAtirar} ms<br>` +
                `Invulnerabilidade: ${invulTempo} ms<br>` +
                `XP: ${XP} / ${XPparaNivel}<br>` +
                `XP Drop: ${dropXP}<br>` +
                `Roubo de Vida: ${HProubo}<br>` +
                `Vida Recuperada ao Subir de Nível: ${recover}<br>` +
                `Dano Inimigo: ${danoI}<br>` +
                `Tempo de nascimento inimigo: ${(intervalo/1000).toFixed(1)}s<br>`;
                
            }
        }
    }, 100);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!statusAtivo) {
                status();
                statusAtivo = true;
            } else {
                const statusDiv = document.getElementById('statusDiv');
                if (statusDiv) {
                    statusDiv.remove();
                }
                statusAtivo = false;
            }
        }
    })

    // inimigos seguindo o personagem
    function moverInimigos() {
        const inimigos = document.querySelectorAll('.inimigo');
        inimigos.forEach(inimigo => {
            let inimigoX = parseFloat(inimigo.style.left);
            let inimigoY = parseFloat(inimigo.style.top);
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

    
    //aumenta os stats dos inimigos com o tempo

    function promoverInimigo(){
        vidamaxInimigo += 1;
        velInimigo +=0.5;
        danoI += 1;
        vidaInimigo = vidamaxInimigo;
        dropXP += 2;
    }
    setInterval(promoverInimigo, 60000); // aumenta a dificuldade a cada 60 segundos

    function atirar(e) {
        if (!podeAtirar) return;
        podeAtirar = false;

        const tiro = document.createElement('div');
        tiro.className = 'tiro';
        tiro.style.width = '10px';
        tiro.style.height = tamanahoTiro + 'px';
        tiro.style.width = tamanahoTiro + 'px';
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
        dx /= dist;
        dy /= dist;

        const velTiro = 8;

        let perfTiro = perf;

        // Array para inimigos já atingidos por este tiro
        let inimigosAtingidos = [];

        function dTiro() {
            tiroX += dx * velTiro;
            tiroY += dy * velTiro;
            tiro.style.left = tiroX + 'px';
            tiro.style.top = tiroY + 'px';

            const inimigos = document.querySelectorAll('.inimigo');
            for (let i = 0; i < inimigos.length; i++) {
                const inimigo = inimigos[i];
                const posTiro = tiro.getBoundingClientRect();
                const posInimigo = inimigo.getBoundingClientRect();

                const colide =
                    (posTiro.left < posInimigo.right &&
                    posTiro.right > posInimigo.left &&
                    posTiro.top < posInimigo.bottom &&
                    posTiro.bottom > posInimigo.top)

                if (colide && !inimigosAtingidos.includes(inimigo)) {
                    inimigosAtingidos.push(inimigo);

                    let vidaInimigoAtual = parseInt(inimigo.dataset.vida);
                    vidaInimigoAtual -= dmg;

                    if (vidaInimigoAtual <= 0) {
                        inimigo.remove();
                        dinheiro += Ganhar;
                        atualizarDinheiro();
                        salvarProgresso();
                        XP += Math.floor(Math.random() * 3) + dropXP;
                        atualizarXP();  // Atualiza XP na tela
                        subirNivel();   // Verifica se sobe de nível
                        // Cura o personagem com base no roubo de vida
                        if (vida < vidamax) {
                            vida += parseFloat(Math.random().toFixed(1) * HProubo.toFixed(1));
                            if (vida > vidamax) vida = vidamax; // não ultrapassa a vida máxima
                            personagem.textContent = vida.toFixed(1); // Atualiza a vida exibida
                        }
                    } else {
                        inimigo.dataset.vida = vidaInimigoAtual;
                        inimigo.textContent = vidaInimigoAtual;
                    }

                    perfTiro--;

                    if (perfTiro <= 0) {
                        tiro.remove();
                        return;
                    }
                }
            }

            const chefe = document.querySelectorAll('.chefe');
            for (let i = 0; i < chefe.length; i++) {
                const ch = chefe[i];
                const posTiro = tiro.getBoundingClientRect();
                const poschefe = ch.getBoundingClientRect();
        
                const colide =
                    (posTiro.left < poschefe.right &&
                    posTiro.right > poschefe.left &&
                    posTiro.top < poschefe.bottom &&
                    posTiro.bottom > poschefe.top)

                if (colide && !inimigosAtingidos.includes(ch)) {
                    inimigosAtingidos.push(ch);

                    let vidaInimigoAtual = parseInt(ch.dataset.vida);
                    vidaInimigoAtual -= dmg;

                    if (vidaInimigoAtual <= 0) {
                        ch.remove();
                        for(let i = 0; i < 10; i++){
                            const personagem = document.getElementById('personagem');
                            const personagemPos = personagem.getBoundingClientRect();

                            let posX, posY;
                            let distanciaSegura = 200;

                            // Tenta gerar uma posição até que fique a uma distância segura do personagem
                            do {
                                posX = Math.random() * (window.innerWidth - 40);
                                posY = Math.random() * (window.innerHeight - 40);
                            } while (
                                Math.abs(posX - personagemPos.left) < distanciaSegura &&
                                Math.abs(posY - personagemPos.top) < distanciaSegura
                            );

                            const inimigo = document.createElement('div');
                            inimigo.dataset.vida = vidamaxInimigo; // vida individual do inimigo
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

                            inimigo.style.left = posX + 'px';
                            inimigo.style.top = posY + 'px';

                            container.appendChild(inimigo);
                        }
                        spawntime = setTimeout(spawnInimigo, intervalo);

                        dinheiro += Ganhar * 50;
                        atualizarDinheiro();
                        salvarProgresso();
                        XP += Math.floor(Math.random() * 3) + dropXP * 20;
                        atualizarXP();  // Atualiza XP na tela
                        subirNivel();   // Verifica se sobe de nível
                        // Cura o personagem com base no roubo de vida
                        if (vida < vidamax) {
                            vida += parseFloat(Math.random().toFixed(1) * HProubo.toFixed(1));
                            if (vida > vidamax) vida = vidamax; // não ultrapassa a vida máxima
                            personagem.textContent = vida.toFixed(1); // Atualiza a vida exibida
                        }
                    } else {
                        ch.dataset.vida = vidaInimigoAtual;
                        ch.textContent = vidaInimigoAtual;
                    }

                    perfTiro--;

                    if (perfTiro <= 0) {
                        tiro.remove();
                        return;
                    }
                }
            }

            // Remove o tiro se sair da tela
            if (
                tiroX < 0 ||
                tiroX > window.innerWidth ||
                tiroY < 0 ||
                tiroY > window.innerHeight
            ) {
                tiro.remove();
                return;
            }

            // Limpar inimigos atingidos para permitir dano novo quando sair do inimigo
            inimigosAtingidos = inimigosAtingidos.filter(inimigo => {
                const poschefe = inimigo.getBoundingClientRect();
                const posTiro = tiro.getBoundingClientRect();
                return (
                    posTiro.left < poschefe.right &&
                    posTiro.right > poschefe.left &&
                    posTiro.top < poschefe.bottom &&
                    posTiro.bottom > poschefe.top
                );
            });

            requestAnimationFrame(dTiro);
        }

        dTiro();

        setTimeout(() => {podeAtirar = true;}, intAtirar);
    }
    window.addEventListener('click', atirar);

    function aleatorizarStatus(){
        let randomizar = Math.floor(Math.random() * 12);


        switch (randomizar) {
            case 0:
                vidamax++;
                vida++;
                alert('Vida máxima aumentada em 1! Vida atual: ' + vidamax);
                break;
            case 1:
                dmg++;
                alert('Dano aumentado em 1! Dano atual: ' + dmg);
                break;
            case 2:
                perf++;
                alert('Perfuração aumentada em 1! Perfuração atual: ' + perf);
                break;
            case 3:
                speed += 0.5;
                speed = parseFloat(speed.toFixed(1));
                alert('Velocidade aumentada em 0.5! Velocidade atual: ' + speed);
                break;
            case 4:
                if (velInimigo > 0.5){
                    velInimigo -= 0.2;
                    velInimigo = parseFloat(velInimigo.toFixed(1));
                    alert('Velocidade inimiga diminuída em 0.2! Velocidade inimiga atual: ' +velInimigo);
                }else{
                    alert('Velocidade inimiga já está no mínimo!');
                }
                break;
            case 5:
                intAtirar -= intAtirar / 10;
                intAtirar = parseFloat(intAtirar.toFixed(1));
                alert(
                    'Intervalo de tiro diminuído em 10%! Intervalo atual: ' +intAtirar +'ms'
                    );
                break;
            case 6:
                invulTempo += invulTempo / 10;
                invulTempo = parseFloat(invulTempo.toFixed(1));
                alert('Tempo de invulnerabilidade aumentado em 10%! Tempo atual: ' + invulTempo +'ms');
                break;
            case 7:
                if (vidamaxInimigo > 1){
                    vidamaxInimigo--;
                    alert('Vida máxima dos inimigos diminuida em 1! Vida inimigos atual: ' + vidamaxInimigo);
                    break;
                }else{
                    alert('Vida máxima dos inimigos já está no mínimo!');
                    break;
                }
            case 8:
                dropXP++;
                alert('XP drop aumentada em 1! XP drop atual: ' + dropXP);
                break;
            case 9:
                recover += 0.5;
                recover = parseFloat(recover.toFixed(1));
                alert('Vida recuperada ao subir de nível aumentada em 0.5! Vida recuperada: ' + recover);
                break;
            case 10:
                HProubo += 0.2;
                HProubo = parseFloat(HProubo.toFixed(1));
                alert('Roubo de Vida aumentado em 0.2! Roubo de vida: ' + HProubo);
                break;
            case 11:
                if (danoI > 1){
                    danoI--;
                    alert('Dano inimigo diminuído em 1! Dano inimigo atual: ' + danoI);
                }else{
                    alert('Dano inimigo já está no mínimo!');
                }
            }
        }

    function subirNivel() {
        if (XP >= XPparaNivel) {
            XP -= XPparaNivel;//possibilita subir mais de um nível por vez
            XPparaNivel = Math.floor(XPparaNivel * 1.5); // aumenta a XP necessária para o próximo nível
            if(vida < vidamax){
                vida += recover;
            }
            if (vida > vidamax) {
                vida = vidamax;
            }
            aleatorizarStatus();
            atualizarXP();
        }
    }  

    for(let i = 0; i < instUp; i++){
        aleatorizarStatus();
    }

    function boss(){
        const personagem = document.getElementById('personagem');
        const personagemPos = personagem.getBoundingClientRect();

        let posX, posY;
        let distanciaSegura = 400;

        // Tenta gerar uma posição até que fique a uma distância segura do personagem
        do {
            posX = Math.random() * (window.innerWidth - 40);
            posY = Math.random() * (window.innerHeight - 40);
        } while (
            Math.abs(posX - personagemPos.left) < distanciaSegura &&
            Math.abs(posY - personagemPos.top) < distanciaSegura
        );

        const chefe = document.createElement('div');
        chefe.dataset.vida = vidamaxchefe; 
        chefe.className = 'chefe';
        chefe.style.width = '350px';
        chefe.style.height = '350px';
        chefe.style.background = 'rgb(204, 0, 255)';
        chefe.style.borderRadius = '10px';
        chefe.style.position = 'absolute';
        chefe.textContent = vidamaxchefe;
        chefe.style.display = 'flex';
        chefe.style.justifyContent = 'center';
        chefe.style.alignItems = 'center';
        chefe.style.fontFamily = 'Arial, sans-serif';
        chefe.style.fontSize = '18px';
        chefe.style.color = 'white'
        
        chefe.style.left = posX + 'px';
        chefe.style.top = posY + 'px';

        container.appendChild(chefe)
    }

    function moverChefe() {
        const chefe = document.querySelectorAll('.chefe');
        chefe.forEach(chefe => {
            let chefeX = parseFloat(chefe.style.left);
            let chefeY = parseFloat(chefe.style.top);
            let alvoX = posX;
            let alvoY = posY;
            let dx = alvoX - chefeX;
            let dy = alvoY - chefeY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
                dx /= dist;
                dy /= dist;
                chefeX += dx * velInimigo / 1.3;
                chefeY += dy * velInimigo / 1.3;
                chefe.style.left = chefeX + 'px';
                chefe.style.top = chefeY + 'px';
            }
        });
        requestAnimationFrame(moverChefe);
    }
    moverChefe();


    if(timerDiv.textContent === '10:00' || timerDiv.textContent === '05:00'){
        clearTimeout(spawntime);
        boss()
    }
}