import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DEFAULT_MATRIX = [
  [8, 2, 4, 9],
  [1, 3, -2, 6],
  [6, 5, 3, 7],
  [4, -1, 5, 3],
]

const PLAYER_STRATEGIES = [
  {
    code: 'П1',
    name: 'Емпатія та діалог',
    desc: 'Встановити психологічний контакт, зрозуміти мотиви, затягувати час',
  },
  {
    code: 'П2',
    name: 'Силовий тиск',
    desc: 'Демонструвати оточення, бронетехніку, жорсткі ультиматуми',
  },
  {
    code: 'П3',
    name: 'Торгівля',
    desc: 'Пропонувати їжу, воду, медикаменти в обмін на заручників',
  },
  {
    code: 'П4',
    name: 'Дезінформація',
    desc: 'Хибні обіцянки, фіктивний вертоліт евакуації',
  },
]

const ENEMY_STRATEGIES = [
  { code: 'Т1', name: 'Переговори', desc: 'Іде на контакт, висуває чіткі вимоги' },
  { code: 'Т2', name: 'Ігнорування', desc: 'Відмовляється від будь-якого контакту' },
  { code: 'Т3', name: 'Погрози', desc: 'Демонструє насильство, психологічний тиск' },
  { code: 'Т4', name: 'Капітуляція', desc: 'Здається під тиском обставин' },
]

export const useGameStore = defineStore('game', () => {
  // Matrix
  const matrix = ref(DEFAULT_MATRIX.map(row => [...row]))

  // Strategies metadata
  const playerStrategies = PLAYER_STRATEGIES
  const enemyStrategies = ENEMY_STRATEGIES

  // Score
  const playerScore = ref(0)
  const round = ref(0)

  // Last move
  const lastMove = ref(null) // { playerIdx, enemyIdx, value }

  // History (last 8)
  const history = ref([])

  // Reset matrix
  function resetMatrix() {
    matrix.value = DEFAULT_MATRIX.map(row => [...row])
  }

  // Update matrix cell
  function setCell(r, c, val) {
    const v = Number(val)
    if (!isNaN(v)) matrix.value[r][c] = v
  }

  // Play a round: player picks row, enemy picks column randomly
  function playRound(playerIdx, enemyIdx) {
    const value = matrix.value[playerIdx][enemyIdx]
    playerScore.value += value
    round.value += 1
    lastMove.value = { playerIdx, enemyIdx, value }
    history.value.unshift({
      round: round.value,
      playerIdx,
      enemyIdx,
      value,
      playerName: PLAYER_STRATEGIES[playerIdx].code,
      enemyName: ENEMY_STRATEGIES[enemyIdx].code,
    })
    if (history.value.length > 8) history.value.pop()
  }

  // Reset game
  function resetGame() {
    playerScore.value = 0
    round.value = 0
    lastMove.value = null
    history.value = []
  }

  // Computed: average score per round
  const avgScore = computed(() => {
    if (round.value === 0) return 0
    return Math.round((playerScore.value / round.value) * 100) / 100
  })

  return {
    matrix,
    playerStrategies,
    enemyStrategies,
    playerScore,
    round,
    lastMove,
    history,
    avgScore,
    resetMatrix,
    setCell,
    playRound,
    resetGame,
  }
})
