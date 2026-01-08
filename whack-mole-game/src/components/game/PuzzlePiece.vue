<template>
  <div
    v-if="piece.collected && !piece.placedInGrid"
    class="puzzle-piece"
    :class="{ 'dragging': isDragging, 'placed': piece.placedInGrid, 'correct': piece.correctPosition }"
    :style="pieceStyle"
    draggable="true"
    @dragstart="handleDragStart"
    @drag="handleDrag"
    @dragend="handleDragEnd"
    @drop="handleDrop"
  >
    <img :src="piece.imageData" :alt="`Puzzle piece ${piece.id}`" draggable="false" />
  </div>
</template>

<script setup>
/**
 * Draggable puzzle piece component for user interaction and assembly
 */

import { ref, computed } from 'vue'

const props = defineProps({
  piece: {
    type: Object,
    required: true
  },
  size: {
    type: Number,
    default: 100
  },
  snappingTolerance: {
    type: Number,
    default: 30
  },
  onDrop: {
    type: Function,
    required: true
  },
  onSnap: {
    type: Function,
    required: true
  }
})

const isDragging = ref(false)
const dragPosition = ref({ x: 0, y: 0 })

function handleDragStart(event) {
  isDragging.value = true
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', props.piece.id)

  // Set drag image
  const img = event.target.querySelector('img')
  event.dataTransfer.setDragImage(img, props.size / 2, props.size / 2)
}

function handleDrag(event) {
  if (isDragging.value) {
    dragPosition.value = {
      x: event.clientX,
      y: event.clientY
    }
  }
}

function handleDragEnd(event) {
  isDragging.value = false
  event.preventDefault()
}

function handleDrop(event) {
  event.preventDefault()
  event.stopPropagation()

  const rect = event.currentTarget.getBoundingClientRect()
  const position = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }

  // Check if within snapping tolerance
  const isNear = checkSnapPosition(position)

  if (isNear) {
    props.onSnap(props.piece.id, true)
  } else {
    props.onSnap(props.piece.id, false)
  }

  props.onDrop(props.piece.id, position)
  isDragging.value = false
}

function checkSnapPosition(position) {
  const distance = Math.sqrt(
    Math.pow(position.x - props.piece.correctX, 2) +
    Math.pow(position.y - props.piece.correctY, 2)
  )
  return distance <= props.snappingTolerance
}

const pieceStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  left: `${props.piece.dropX}px`,
  top: `${props.piece.dropY}px`,
  opacity: props.piece.collected ? 1 : 0.5
}))
</script>

<script>
export default {
  name: 'PuzzlePiece'
}
</script>

<style scoped>
.puzzle-piece {
  position: absolute;
  cursor: grab;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.puzzle-piece img {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.puzzle-piece:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: scale(1.05);
  z-index: 10;
}

.puzzle-piece.dragging {
  opacity: 0.7;
  cursor: grabbing;
  z-index: 1000;
}

.puzzle-piece.placed {
  cursor: default;
  box-shadow: none;
  border: 2px solid #4CAF50;
}

.puzzle-piece.correct {
  border-color: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.puzzle-piece::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
  pointer-events: none;
}
</style>
