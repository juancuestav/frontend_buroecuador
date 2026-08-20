<template>
  <div
    class="planet-container q-mx-auto bg-body-backgrodund"
    :style="dotColorVarStyle"
  >
    <div
      class="planet"
      :class="{ animating: isAnimating }"
      :style="planetStyle"
    >
      <div
        v-for="(feature, index) in surfaceFeatures"
        :key="index"
        class="surface-feature"
        :style="feature"
      ></div>
    </div>

    <div class="planet-ring animating"></div>
    <div
      v-for="(object, index) in orbitingObjects"
      :key="index"
      class="orbiting-object"
      :style="object"
      :class="{ animating: isAnimating }"
    ></div>
    <div class="score-number rounded-card q-pa-xs">{{ animatedScore }}</div>
    <div class="score-label" :style="labelStyle">{{ scoreLabel }}</div>
  </div>
  <small v-if="!waiting" class="block text-center"
    >Puntaje calculado el {{ fechaActualizacion }}</small
  >
  <small class="block text-center">Provisto por Buró de Crédito Ecuador</small>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 1000,
  },
  fechaActualizacion: {
    type: String,
    required: true,
  },
  // Cuando es true, ignora `score` y en su lugar corre un relleno en
  // bucle (0 → arriba → 0 → ...) con `waitingLabel` como etiqueta, para
  // representar "calculando" mientras aún no hay un puntaje real.
  waiting: {
    type: Boolean,
    default: false,
  },
  waitingLabel: {
    type: String,
    default: 'En espera de activación. Calculando...',
  },
})

const animatedScore = ref(0)
const isAnimating = ref(false)

const getColorAndLabel = (score) => {
  if (score >= 930)
    return {
      color: '#00a86b',
      colorDark: '#006e46',
      label: 'AAA - Cliente excelente',
    }
  if (score >= 850)
    return {
      color: '#7cb342',
      colorDark: '#4b6e28',
      label: 'AA - Cliente bueno',
    }
  if (score >= 700)
    return {
      color: '#c0ca33',
      colorDark: '#7c8421',
      label: 'A - Cliente regular',
    }
  if (score >= 400)
    return { color: '#fdd835', colorDark: '#c6a700', label: 'B - Cliente bajo' }
  return { color: '#e53935', colorDark: '#ab000d', label: 'C - Cliente malo' }
}

const planetStyle = computed(() => {
  const { color, colorDark } = getColorAndLabel(animatedScore.value)
  return {
    background: `radial-gradient(circle at 30% 30%, ${color} 0%, ${colorDark} 70%, rgba(0,0,0,0.5) 100%)`,
    boxShadow: `0 0 30px 10px ${color}`,
    animation: 'glow 1.5s infinite',
  }
})

const labelStyle = computed(() => {
  const { color } = getColorAndLabel(animatedScore.value)
  return { color }
})

// Variable CSS en el contenedor: un solo cambio de color por frame (no 100),
// heredado por los puntos orbitantes vía `background-color: var(--dot-color)`.
const dotColorVarStyle = computed(() => {
  const { color } = getColorAndLabel(animatedScore.value)
  return { '--dot-color': color }
})

const scoreLabel = computed(() =>
  props.waiting
    ? props.waitingLabel
    : getColorAndLabel(animatedScore.value).label
)

const surfaceFeatures = ref(
  Array.from({ length: 7 }, () => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    width: `${Math.random() * 30 + 10}px`,
    height: `${Math.random() * 30 + 10}px`,
    animationDelay: `${Math.random() * 2}s`,
  }))
)

const orbitingObjects = ref(
  Array.from({ length: 100 }, (_, i) => ({
    animationDelay: `${i * 0.2}s`,
    top: `${50 + Math.random() * 20 - 10}%`, // Posición aleatoria en el eje vertical
    left: `${50 + Math.random() * 20 - 10}%`, // Posición aleatoria en el eje horizontal
    width: '4px', // Ancho del punto
    height: '4px', // Alto del punto
  }))
)

let rafId = null
let loopTimeoutId = null

const stopAnimationLoops = () => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (loopTimeoutId !== null) clearTimeout(loopTimeoutId)
  rafId = null
  loopTimeoutId = null
}

// Empieza rápido y desacelera suave hacia el final (deceleración cúbica).
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const animateScore = () => {
  stopAnimationLoops()
  isAnimating.value = true
  const duration = props.score <= 500 ? 3000 : 6000 // 2 seconds
  const start = animatedScore.value
  const end = props.score
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    const eased = easeOutCubic(progress)
    animatedScore.value = Math.round(start + (end - start) * eased)

    if (progress < 1) {
      rafId = requestAnimationFrame(animate)
    } else {
      isAnimating.value = false
    }
  }

  rafId = requestAnimationFrame(animate)
}

// Mientras se espera la activación no hay un puntaje real: se anima un
// relleno de 0 a un valor alto y se reinicia en bucle, como indicador de
// "calculando", hasta que `waiting` pase a false.
const WAITING_TARGET = 950
const WAITING_FILL_DURATION = 2200
const WAITING_PAUSE_AT_FULL = 400

const runWaitingLoop = () => {
  isAnimating.value = true
  const start = animatedScore.value
  const startTime = performance.now()

  const step = (currentTime) => {
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / WAITING_FILL_DURATION, 1)
    const eased = easeOutCubic(progress)
    animatedScore.value = Math.round(
      start + (WAITING_TARGET - start) * eased
    )

    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      loopTimeoutId = setTimeout(() => {
        animatedScore.value = 0
        if (props.waiting) runWaitingLoop()
      }, WAITING_PAUSE_AT_FULL)
    }
  }

  rafId = requestAnimationFrame(step)
}

watch(
  () => props.waiting,
  (waiting) => {
    stopAnimationLoops()
    if (waiting) runWaitingLoop()
    else animateScore()
  }
)

onBeforeUnmount(stopAnimationLoops)

watch(
  () => props.score,
  () => {
    if (!props.waiting) animateScore()
  }
)

onMounted(() => {
  if (props.waiting) runWaitingLoop()
  else animateScore()
})
</script>

<style lang="scss" scoped>
.planet-container {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  animation: stars 10s linear infinite;
}

@media only screen and (max-width: 768px) {
  .planet-container {
    width: 350px !important;
    height: 400px !important;
  }
}

@media only screen and (max-width: 390px) {
  .planet-container {
    width: 330px !important;
    height: 400px !important;
  }
}

.planet {
  position: absolute;
  width: 200px;
  height: 200px;
  z-index: 4;
  border-radius: 50%;
  overflow: hidden;
  animation: rotate 30s linear infinite !important;
  transition: all 0.5s ease;
}

.planet.animating {
  animation: rotate 5s linear infinite !important;
}

.planet-ring {
  position: absolute;
  width: 240px;
  height: 240px;
  z-index: 12;
  border-radius: 50%;
  border: 15px solid rgba(255, 255, 255, 0.1);
  top: 50%;
  left: 50%;
  transition: all 0.5s ease;
  animation: pulse 0.9s ease-in-out infinite alternate;
}

.score-number {
  position: relative;
  font-size: 58px;
  font-weight: bold;
  color: #fff;
  z-index: 8;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 1);
}

.score-label {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border-radius: 16px;
  transition: color 0.5s ease;
}

.surface-feature {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse2 3s ease-in-out infinite;
}

.orbiting-object {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  background-color: var(--dot-color, #fff);
  animation: orbit 10s linear infinite;
  transition: background-color 0.5s ease;
}

.orbiting-object.animating {
  animation: orbit 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(140px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(140px) rotate(-360deg);
  }
}

@keyframes pulse2 {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.9);
    transform: translate(-50%, -50%) rotateX(70deg);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    transform: translate(-50%, -50%) rotateX(75deg);
    opacity: 1;
  }
}

@keyframes glow {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

@keyframes stars {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -2000px -2000px;
  }
}
</style>
