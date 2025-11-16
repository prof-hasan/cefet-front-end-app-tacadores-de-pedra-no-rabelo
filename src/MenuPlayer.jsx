import { useState, useEffect } from 'react';
import './MenuPlayer.css';

const upgrades = [
  { id: 1, nome: 'Velocidade', baseCusto: 100, descricao: 'Aumenta a velocidade do jogador', maxNivel: 5 },
  { id: 2, nome: 'Dano', baseCusto: 150, descricao: 'Aumenta o dano do ataque', maxNivel: 5 },
  { id: 3, nome: 'Defesa', baseCusto: 120, descricao: 'Diminui o dano recebido', maxNivel: 5 },
  { id: 4, nome: 'Regeneração', baseCusto: 200, descricao: 'Recupera vida automaticamente', maxNivel: 5 },
  { id: 5, nome: 'Crítico', baseCusto: 180, descricao: 'Aumenta o dano crítico', maxNivel: 5 },
  { id: 6, nome: 'Sorte', baseCusto: 160, descricao: 'Aumenta a sorte em geral', maxNivel: 5 },
  { id: 7, nome: 'Dash', baseCusto: 600, descricao: 'Libera o Dash', maxNivel: 1 },
  { id: 8, nome: 'Escudo', baseCusto: 700, descricao: 'Gera um escudo que protege o jogador de tiros', maxNivel: 1 },
];

function MenuPlayer() {
  const [playerMoney, setPlayerMoney] = useState(0);
  const [nivelUpgrades, setNivelUpgrades] = useState({});

  useEffect(() => {
    const savedMoney = localStorage.getItem('playerMoney');
    const savedUpgrades = localStorage.getItem('nivelUpgrades');
    if (savedMoney) setPlayerMoney(parseInt(savedMoney));
    if (savedUpgrades) setNivelUpgrades(JSON.parse(savedUpgrades));
  }, []);

  const melhorTempo = () => {
    const tempo = localStorage.getItem('melhorTempo');
    return tempo ? tempo : '00:00';
  };

  const calcularCusto = (upgrade) => {
    const nivelAtual = nivelUpgrades[upgrade.nome] || 0;
    return Math.floor(upgrade.baseCusto * (1.3 ** nivelAtual));
  };

  const comprarUpgrade = (upgrade) => {
    const nivelAtual = nivelUpgrades[upgrade.nome] || 0;
    const custo = calcularCusto(upgrade);

    if (playerMoney >= custo && nivelAtual < upgrade.maxNivel) {
      const novoNivel = nivelAtual + 1;
      const novoDinheiro = playerMoney - custo;

      const novosUpgrades = { ...nivelUpgrades, [upgrade.nome]: novoNivel };
      setNivelUpgrades(novosUpgrades);
      setPlayerMoney(novoDinheiro);

      localStorage.setItem('playerMoney', novoDinheiro);
      localStorage.setItem('nivelUpgrades', JSON.stringify(novosUpgrades));
    }
  };

  const resetarProgresso = () => {
    if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
      localStorage.removeItem('playerMoney');
      localStorage.removeItem('nivelUpgrades');
      setPlayerMoney(0);
      setNivelUpgrades({});
    }
  };

  const jogar = () => {
    window.location.href = 'jogo/jogo.html';
  };

  return (
    <>
      <main>
        <section className="menu">
          <h1>Menu de Upgrades</h1>
          <p>💰 Dinheiro: ${playerMoney}</p>

          <section className='upgrades'>
            {upgrades.map((upgrade) => {
              const nivel = nivelUpgrades[upgrade.nome] || 0;
              const custo = calcularCusto(upgrade);
              const max = nivel >= upgrade.maxNivel;

              return (
                <div key={upgrade.id} className="upgrade-card">
                  <h2>{upgrade.nome}</h2>
                  <p>{upgrade.descricao}</p>
                  <p>Nível: {nivel}/{upgrade.maxNivel}</p>
                  <p>Custo: ${custo}</p>

                  <button
                    disabled={max || playerMoney < custo}
                    onClick={() => comprarUpgrade(upgrade)}
                    className="btn btn-outline-info"
                  >
                    {max ? 'Máx' : 'Comprar'}
                  </button>
                </div>
              );
            })}
          </section>

          <div className="reset-container">
            <button onClick={resetarProgresso} className="btn btn-outline-danger">
              🔁 Resetar Progresso
            </button>
          </div>
        </section>

        <section id="start-section">
          <h2>NOME DO PLAYER</h2>
          <h3>Melhor Tempo: {melhorTempo()}</h3>

          <div className="start-container">
            <button id="start-btn" onClick={jogar} className="btn btn-outline-success">
              Jogar
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default MenuPlayer;
