let estrelas = [];

function Estrela() {
    this.el = document.createElement('img');
    this.el.src = 'https://img.freepik.com/vetores-premium/ilustracao-vetorial-isolada-do-icone-shine-star-black_34480-1056.jpg?semt=ais_incoming&w=740&q=80';
    this.el.style.width = '40px';
    this.el.style.position = 'fixed';
    this.el = document.body.appendChild(this.el);
}

Estrela.prototype.remove = function() {
    document.body.removeChild(this.el);
};

Estrela.prototype.posicao = function(tempoDeInicio){
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
}