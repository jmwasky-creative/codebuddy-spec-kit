<template>
  <div
    v-if="isVisible"
    class="mole"
    :class="[`mole--${mole.state}`, { 'mole--hit': mole.hit }]"
    :style="moleStyle"
    @click="handleClick"
  >
    <div class="mole-body">
      <div class="mole-face">
        <div class="mole-eye mole-eye--left"></div>
        <div class="mole-eye mole-eye--right"></div>
        <div class="mole-nose"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Individual mole component for rendering and interaction
 */

const props = defineProps({
  mole: {
    type: Object,
    required: true
  },
  size: {
    type: Number,
    default: 80
  },
  onHit: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['hit'])

function handleClick() {
  if (!props.mole.hit && !props.mole.expired) {
    emit('hit', props.mole.id)
  }
}

const isVisible = computed(() => {
  return !props.mole.expired && props.mole.state !== 'removed'
})

const moleStyle = computed(() => ({
  left: `${props.mole.x}px`,
  top: `${props.mole.y}px`,
  width: `${props.size}px`,
  height: `${props.size}px`
}))
</script>

<script>
export default {
  name: 'Mole'
}
</script>

<style scoped>
.mole {
  position: absolute;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
  user-select: none;
}

.mole--appearing {
  opacity: 0;
  transform: scale(0.5);
}

.mole--visible {
  opacity: 1;
  transform: scale(1);
}

.mole--hit {
  opacity: 0.5;
  transform: scale(0.8);
}

.mole--expired {
  opacity: 0;
  transform: scale(0.5);
}

.mole:hover:not(.mole--hit):not(.mole--expired) {
  transform: scale(1.1);
}

.mole-body {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
  border-radius: 50% 50% 45% 45%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.mole-body::before {
  content: '';
  position: absolute;
  top: 5%;
  left: 20%;
  width: 60%;
  height: 40%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.mole-face {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 40%;
}

.mole-eye {
  position: absolute;
  width: 20%;
  height: 25%;
  background: white;
  border-radius: 50%;
  top: 20%;
}

.mole-eye--left {
  left: 15%;
}

.mole-eye--right {
  right: 15%;
}

.mole-eye::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  background: #000;
  border-radius: 50%;
}

.mole-nose {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25%;
  height: 20%;
  background: #FF6B6B;
  border-radius: 50%;
}

.mole--hit .mole-body {
  animation: hitShake 0.3s ease;
}

@keyframes hitShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px) rotate(-5deg);
  }
  75% {
    transform: translateX(5px) rotate(5deg);
  }
}
</style>
