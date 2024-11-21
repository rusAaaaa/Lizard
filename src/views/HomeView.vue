<template>
  <div class="game-container">
    <ScoreProgress />
    <div class="header">
      <img src="../assets/coin.png" alt="coin" />
      <h2 class="score" id="score">{{ store.score }}</h2>
    </div>
    <div class="circle">
      <img @click="increment" ref="img" id="circle" :src="imgSrc" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ScoreProgress from '@/components/ScoreProgress.vue'
import { useScoreStore } from '@/stores/score'
import frog from '@/assets/frog.png'
import lizard from '@/assets/lizzard.png'

// Ссылка на элемент изображения
const img = ref(null)
const imgSrc = computed(() => store.score > 25 ? lizard : frog)

// Инициализация Pinia-хранилища
const store = useScoreStore()

function increment(event) {
  // Увеличиваем счёт
  store.add(1)

  // Получаем размеры элемента
  const rect = event.target.getBoundingClientRect()

  // Рассчитываем смещения
  const offsetX = event.clientX - rect.left - rect.width / 2
  const offsetY = event.clientY - rect.top - rect.height / 2

  // Угол наклона
  const DEG = 40
  const tiltX = (offsetY / rect.height) * DEG
  const tiltY = (offsetX / rect.width) * -DEG

  // Применяем стиль наклона через CSS-переменные
  if (img.value) {
    img.value.style.setProperty('--tiltX', `${tiltX}deg`)
    img.value.style.setProperty('--tiltY', `${tiltY}deg`)

    // Сбрасываем наклон
    setTimeout(() => {
      img.value.style.setProperty('--tiltX', `0deg`)
      img.value.style.setProperty('--tiltY', `0deg`)
    }, 300)
  }

  // Создаем анимацию "+1"
  const plusOne = document.createElement('div')
  plusOne.classList.add('plus-one')
  plusOne.textContent = '+1'

  // Позиционируем элемент
  plusOne.style.left = `${event.clientX - rect.left}px`
  plusOne.style.top = `${event.clientY - rect.top}px`

  // Добавляем элемент в DOM
  if (img.value?.parentElement) {
    img.value.parentElement.appendChild(plusOne)

    // Удаляем элемент через 2 секунды
    setTimeout(() => plusOne.remove(), 2000)
  }
}
</script>
