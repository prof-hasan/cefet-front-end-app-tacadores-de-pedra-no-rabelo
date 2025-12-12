function converterTempoParaSegundos(t) {
    if (!t) return 0;
    if (typeof t === 'number') return Math.floor(t);
    if (typeof t !== 'string') return 0;

    if (t.includes(':')) {
        const [minStr, segStr] = t.split(':');
        const minutos = parseInt(minStr, 10) || 0;
        const segundos = parseInt(segStr, 10) || 0;
        return minutos * 60 + segundos;
    }
    const numero = parseInt(t, 10);
    return isNaN(numero) ? 0 : numero;
}

function formatarSegundosParaTempo(segundos) {
    const total = Number(segundos) || 0;
    const minutos = Math.floor(total / 60);
    const seg = total % 60;
    return `${String(minutos).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

function pegarRecordeLocal() {
    const melhorTexto = localStorage.getItem('melhorTempo');
    const melhorSeg = localStorage.getItem('melhorTempoSegundos');
    const nome = localStorage.getItem('topNome') || localStorage.getItem('ultimoNomeTop') || 'Você';
    const dispositivoId = localStorage.getItem('dispositivoId') || null;

    if (!melhorTexto && !melhorSeg) return null;

    const pontos = melhorSeg
        ? parseInt(melhorSeg, 10) || 0
        : converterTempoParaSegundos(melhorTexto);

    return { nome, pontos, dispositivoId };
}

const API_URL = "https://jogodenave-10d2.restdb.io/rest/score";
const API_HEADER = {
    "content-type": "application/json",
    "x-apikey": "691e2a001c64b94228dde39c"
};

async function enviarPontuacao(nome, pontos) {
    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: API_HEADER,
            body: JSON.stringify({ name: nome, points: pontos })
        });
        return await resposta.json();
    } catch (erro) {
        console.error("Erro ao enviar pontuação:", erro);
        throw erro;
    }
}

async function enviarMelhorTempo() {
    const campoNome = document.getElementById("topNome");
    if (!campoNome) return alert("Erro: Campo de nome não encontrado.");

    const nome = campoNome.value.trim();
    if (!nome) return alert("Digite um nome antes de enviar.");

    const tempoTexto = localStorage.getItem("melhorTempo");
    if (!tempoTexto) return alert("Nenhum tempo salvo para enviar.");

    const tempoSegundos = converterTempoParaSegundos(tempoTexto);

    let dispositivoId = localStorage.getItem('dispositivoId');
    if (!dispositivoId) {
        dispositivoId = "dev-" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('dispositivoId', dispositivoId);
    }

    try {
        const filtro = encodeURIComponent(JSON.stringify({
            "$or": [{ deviceId: dispositivoId }, { name: nome }]
        }));

        const buscaURL = `${API_URL}?q=${filtro}`;
        const resposta = await fetch(buscaURL, { headers: API_HEADER });
        const registros = await resposta.json();

        if (registros.length > 0) {
            registros.sort((a, b) => (b.points || 0) - (a.points || 0));
            const melhorRegistro = registros[0];

            for (let i = 1; i < registros.length; i++) {
                try {
                    await fetch(`${API_URL}/${registros[i]._id}`, {
                        method: "DELETE",
                        headers: API_HEADER
                    });
                } catch (err) {}
            }

            if (tempoSegundos > (melhorRegistro.points || 0)) {
                await fetch(`${API_URL}/${melhorRegistro._id}`, {
                    method: "PUT",
                    headers: API_HEADER,
                    body: JSON.stringify({
                        name: nome,
                        points: tempoSegundos,
                        deviceId: dispositivoId
                    })
                });

                localStorage.setItem('melhorTempo', formatarSegundosParaTempo(tempoSegundos));
                localStorage.setItem('melhorTempoSegundos', tempoSegundos);
                localStorage.setItem('topNome', nome);

                alert("Tempo atualizado com sucesso!");
            } else {
                alert("Você já possui um tempo igual ou melhor salvo.");
            }
        } else {
            await fetch(API_URL, {
                method: "POST",
                headers: API_HEADER,
                body: JSON.stringify({
                    name: nome,
                    points: tempoSegundos,
                    deviceId: dispositivoId
                })
            });

            localStorage.setItem('melhorTempo', formatarSegundosParaTempo(tempoSegundos));
            localStorage.setItem('melhorTempoSegundos', tempoSegundos);
            localStorage.setItem('topNome', nome);

            alert("Tempo enviado com sucesso!");
        }

        atualizarRankingGlobal();

    } catch (erro) {
        console.error("Erro ao enviar/atualizar tempo:", erro);
        alert("Erro ao enviar pontuação.");
    }
}

async function pegarRanking() {
    try {
        const url = API_URL + '?q={}&h={"$orderby":{"points":-1},"$limit":100}';
        const res = await fetch(url, { headers: API_HEADER });
        return await res.json();
    } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        return [];
    }
}

async function atualizarRankingGlobal() {
    const lista = document.querySelector(".lideres");
    if (!lista) return;

    lista.innerHTML = "";

    const ranking = await pegarRanking();

    const unico = {};
    const filtrado = [];

    for (const dado of ranking) {
        const id = dado.deviceId || dado.name;
        if (!unico[id]) {
            unico[id] = true;
            filtrado.push(dado);
        }
    }

    const local = pegarRecordeLocal();
    if (local) {
        const idLocal = local.dispositivoId || local.nome;
        if (!unico[idLocal]) {
            let inserido = false;
            for (let i = 0; i < filtrado.length; i++) {
                if ((local.pontos || 0) > (filtrado[i].points || 0)) {
                    filtrado.splice(i, 0, local);
                    inserido = true;
                    break;
                }
            }
            if (!inserido) filtrado.push(local);
        }
    }

    const top5 = filtrado.slice(0, 5);

    top5.forEach((item, indice) => {
        const tempo = formatarSegundosParaTempo(item.points);
        const li = document.createElement("li");
        li.textContent = `${indice + 1}. ${item.name || item.nome} — ${tempo}`;
        lista.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarRankingGlobal();
    const botao = document.getElementById("sendTop");
    if (botao) botao.addEventListener("click", enviarMelhorTempo);
});
