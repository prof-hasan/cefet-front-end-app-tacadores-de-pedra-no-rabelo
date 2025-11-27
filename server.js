async function enviarPontuacao(nome, pontos) {
    await fetch("https://jogodenave-10d2.restdb.io/rest/score", 
        { method: "POST", 
        headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" }, 
        body: JSON.stringify({ name: nome, points: pontos }) }) 

        .then(res => res.json()) 
        .then(data => console.log("score enviado!", data)) 
}

function enviarMelhorTempo() {
    const nome = document.getElementById("topNome").value;
    const melhorTempo = localStorage.getItem("melhorTempo");

    if (!melhorTempo) {
        console.log("Nenhum tempo salvo");
        return;
    }

    enviarPontuacao(nome, Number(melhorTempo));
}

async function pegarDoHTML() { 
    const nome = document.getElementById("topNome").value; 
    const tempo = document.getElementById("topTempo").value; 
}

async function pegarTopLeader() { 
    const url = 'https://jogodenave-10d2.restdb.io/rest/score?q={}&h={"$orderby":{"points":-1},"$limit":5}' 
    const res = await fetch(url, 
        { headers: { "content-type": "application/json", "x-apikey": "691e2a001c64b94228dde39c" }
     })

    return await res.json(); 
}

let topGlobal = [];
pegarTopLeader().then(data => {
    topGlobal = data; console.log(topGlobal); 
})

async function atualizarTopGlobal() {
    const scores = await pegarTopLeader();
    const lista = document.querySelector(".lideres");
    lista.innerHTML = "";
    scores.forEach((s, i) => {
        lista.innerHTML += <li>${i+1}. ${s.name} — ${s.points} pts</li>; 
    }); 
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarTopGlobal();
});
