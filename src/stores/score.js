import { defineStore } from 'pinia'

const baseLevelScore = 25

// Генерация уровней
const levels = new Array(15)
  .fill(0)
  .map((_, i) => baseLevelScore * Math.pow(2, i))

// Расчёт накопленных очков для каждого уровня
const levelScores = levels.reduce((acc, value) => {
  acc.push((acc[acc.length - 1] || 0) + value)
  return acc
}, [])

// Функция для вычисления уровня по текущему счёту
function computeLevelByScore(score) {
  for (let [index, value] of levelScores.entries()) {
    if (score <= value) {
      return {
        level: index,
        value: levels[index],
      }
    }
  }
  return {
    level: levels.length - 1,
    value: levels[levels.length - 1],
  }
}

// Определение хранилища
export const useScoreStore = defineStore('score', {
  state: () => ({
    score: 0,
  }),
  getters: {
    // Текущий уровень
    level: (state) => computeLevelByScore(state.score),
    // Счёт внутри текущего уровня
    currentScore(state) {
      if (this.level.level === 0) {
        return state.score
      }
      return state.score - levelScores[this.level.level - 1]
    },
  },
  actions: {
    // Увеличение счёта
    add(score = 1) {
      this.score = Math.max(0, this.score + score)
    },
    // Установка нового счёта
    setScore(score) {
      this.score = Math.max(0, score)
    },
  },
})
