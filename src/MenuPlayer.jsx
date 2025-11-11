import { useState } from 'react'
import './MenuPlayer.css'

const upgrades = [
  { id: 1, nome: 'Velocidade', custo: 100, descrição: 'Aumenta a velocidade do jogador' },
  { id: 2, nome: 'Dano', custo: 150, descrição: 'Aumenta o Dano do ataque' },
  { id: 3, nome: 'Defesa', custo: 120, descrição: 'Diminui a porcentagem do dano recebido' },
  { id: 4, nome: 'Regeneração', custo: 200, descrição: 'Recupera vida automaticamente' },
  { id: 5, nome: 'Crítico', custo: 180, descrição: 'Aumenta o dano crítico' },
  { id: 6, nome: 'Sorte', custo: 160, descrição: 'Aumenta a sorte em geral' },
  { id: 7, nome: 'Dash', custo: 600, descrição: 'Libera o Dash' },
  { id: 8, nome: 'Escudo', custo: 700, descrição: 'Gera um escudo que protege o jogador de tiros' },
]

function MenuPlayer() {
  const [playerMoney, setPlayerMoney] = useState(500);

  return (
    <>
      <main>
        <h1>Menu de Upgrades</h1>
        <section className = "menu">
          {upgrades.map((upgrade) => (
            <div key={upgrade.id} className="upgrade-card">
              <h2>{upgrade.nome}</h2>
              <p>{upgrade.descrição}</p>
              <p>Custo: ${upgrade.custo}</p>
              <button
                type="button"
                className="btn btn-outline-info"
                onClick={() => {
                  if (playerMoney >= upgrade.custo) {
                    setPlayerMoney(playerMoney - upgrade.custo);
                  }
                }}
              >
                Comprar
              </button>
            </div>
          ))}
        </section>
      </main>

      <aside>
        <div>
          <p>Dinheiro: ${playerMoney}</p>
        </div>
      </aside>
    </>
  )
}

export default MenuPlayer
