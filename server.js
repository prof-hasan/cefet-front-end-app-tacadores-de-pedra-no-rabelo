
function parseTimeToSeconds(t) {
    if (!t) return 0;
    if (typeof t === 'number') return Math.floor(t);
    if (typeof t !== 'string') return 0;
    if (t.includes(':')) {
        const [mStr, sStr] = t.split(':');
        const m = parseInt(mStr, 10) || 0;
        const s = parseInt(sStr, 10) || 0;
        return m * 60 + s;
    }
    const n = parseInt(t, 10);
    return isNaN(n) ? 0 : n;
}

function formatSecondsToTime(secs) {
    const s = Number(secs) || 0;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function getLocalRecord() {
    const melhorTempo = localStorage.getItem('melhorTempo');
    const melhorSeg = localStorage.getItem('melhorTempoSeconds');
    const nome = localStorage.getItem('topNome') || localStorage.getItem('lastTopName') || null;
    const deviceId = localStorage.getItem('deviceId') || null;
    if (!melhorTempo && !melhorSeg) return null;
    const points = melhorSeg ? parseInt(melhorSeg, 10) || 0 : parseTimeToSeconds(melhorTempo);
    return { name: nome || 'Você', points: points, deviceId };
}

async function enviarPontuacao(nome, pontos) {
    try {
        const res = await fetch("https://jogodenave-10d2.restdb.io/rest/score", {
            method: "POST",
            headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" },
            body: JSON.stringify({ name: nome, points: pontos })
        });

            const data = await res.json();
            console.log("score enviado!", data);
            return data;
    } catch (err) {
        console.error('Erro ao enviar pontuação', err);
        throw err;
    }
}

async function enviarMelhorTempo() {
    const nomeEl = document.getElementById("topNome");
    if (!nomeEl) return console.warn('Elemento #topNome não encontrado');
    const nome = nomeEl.value && nomeEl.value.trim();
    if (!nome) return alert('Digite um nome antes de enviar.');

    const melhorTempo = localStorage.getItem("melhorTempo");
    if (!melhorTempo) {
        return alert('Nenhum tempo salvo para enviar.');
    }

    const segundos = parseTimeToSeconds(melhorTempo);
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'dev-' + Math.random().toString(36).slice(2, 10);
            localStorage.setItem('deviceId', deviceId);
        }

        try {
           const q = { "$or": [{ deviceId }, { name: nome }] };
            const query = encodeURIComponent(JSON.stringify(q));
            const urlQuery = `https://jogodenave-10d2.restdb.io/rest/score?q=${query}`;
            const resp = await fetch(urlQuery, { headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" } });
            const existing = await resp.json();

            if (existing && existing.length > 0) {
               existing.sort((a, b) => (b.points || 0) - (a.points || 0));
                const best = existing[0];

               for (let i = 1; i < existing.length; i++) {
                    const toDel = existing[i];
                    (async () => {
                        try {
                            await fetch(`https://jogodenave-10d2.restdb.io/rest/score/${toDel._id}`, {
                                method: 'DELETE',
                                headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" }
                            });
                        } catch (e) {
                            console.warn('Falha ao deletar duplicata', e);
                        }
                    })();
                }

               if (segundos > (best.points || 0)) {
                    const putUrl = `https://jogodenave-10d2.restdb.io/rest/score/${best._id}`;
                    await fetch(putUrl, {
                        method: 'PUT',
                        headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" },
                        body: JSON.stringify({ name: nome, points: segundos, deviceId })
                    });
                    try { localStorage.setItem('melhorTempo', formatSecondsToTime(segundos)); } catch(e){}
                    try { localStorage.setItem('melhorTempoSeconds', String(segundos)); } catch(e){}
                    try { localStorage.setItem('topNome', nome); } catch(e){}
                    alert('Tempo atualizado com sucesso!');
                } else {
                    alert('Você já tem um tempo igual ou melhor salvo neste dispositivo.');
                }
            } else {

                await fetch("https://jogodenave-10d2.restdb.io/rest/score", {
                    method: "POST",
                    headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" },
                    body: JSON.stringify({ name: nome, points: segundos, deviceId })
                });
                try { localStorage.setItem('melhorTempo', formatSecondsToTime(segundos)); } catch(e){}
                try { localStorage.setItem('melhorTempoSeconds', String(segundos)); } catch(e){}
                try { localStorage.setItem('topNome', nome); } catch(e){}
                alert('Tempo enviado com sucesso!');
            }
        } catch (err) {
            console.error('Erro ao enviar/atualizar pontuação', err);
            alert('Erro ao enviar pontuação. Veja console para detalhes.');
        }

    atualizarTopGlobal();
}

async function pegarTopLeader() {
    try {
            const url = 'https://jogodenave-10d2.restdb.io/rest/score?q={}&h={"$orderby":{"points":-1},"$limit":100}';
        const res = await fetch(url, { headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" } });
        if (!res.ok) throw new Error('Erro ao buscar leaderboard: ' + res.status);
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function atualizarTopGlobal() {
    const scores = await pegarTopLeader();
    const lista = document.querySelector(".lideres");
    if (!lista) return;
    lista.innerHTML = "";

    const unique = {};
    const filtered = [];
    for (const s of scores) {
        const id = s.deviceId || s.name;
        if (!unique[id]) {
            unique[id] = true;
            filtered.push(s);
        }
    }

    const localRec = getLocalRecord();
    if (localRec) {
        const localId = localRec.deviceId || localRec.name;
        if (!unique[localId]) {
            let inserted = false;
            for (let i = 0; i < filtered.length; i++) {
                if ((localRec.points || 0) > (filtered[i].points || 0)) {
                    filtered.splice(i, 0, localRec);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) filtered.push(localRec);
        }
    }

    //limite de 5 entradas
    const topList = filtered.slice(0, 5);
    topList.forEach((s, i) => {
        const time = formatSecondsToTime(s.points);
        const li = document.createElement('li');
        li.textContent = `${i+1}. ${s.name} — ${time}`;
        lista.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarTopGlobal();
    const btn = document.getElementById('sendTop');
    if (btn) btn.addEventListener('click', enviarMelhorTempo);
});
