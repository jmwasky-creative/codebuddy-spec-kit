<template>
  <div class="puzzle-grid" :style="gridStyle">
    <div
      v-for="(piece, index) in gridSlots"
      :key="index"
      class="puzzle-grid-slot"
      :style="slotStyle"
      :class="{ 'filled': piece }"
    >
      <img
        v-if="piece && piece.placedInGrid"
        :src="piece.imageData"
        :alt="`Piece ${piece.rowIndex}-${piece.colIndex}`"
        class="placed-piece"
        :style="{ width: `${pieceSize}px`, height: `${pieceSize}px` }"
      />
      <div v-else class="placeholder"></div>
    </div>
  </div>
</template>

<script setup>
/**
 * Puzzle assembly grid for dragging and dropping pieces to complete character image
 */

import { ref, computed, watch } from 'vue'

const props = defineProps({
  rows: {
    type: Number,
    default: 3
  },
  cols: {
    type: Number,
    default: 3
  },
  pieceSize: {
    type: Number,
    default: 100
  },
  completedImage: {
    type: String,
    default: ''
  },
  onPiecePlaced: {
    type: Function,
    default: () => {}
  }
})

const placedPieces = ref([])

const gridSlots = computed(() => {
  const slots = []
  for (let row = 0; row < props.rows; row++) {
    for (let col = 0; col < props.cols; col++) {
      const piece = placedPieces.value.find(
        (p) => p.rowIndex === row && p.colIndex === col && p.placedInGrid
      )
      slots.push(piece || null)
    }
  }
  return slots
})

const gridStyle = computed(() => ({
  width: `${props.cols * props.pieceSize}px`,
  height: `${props.rows * props.pieceSize}px`,
  backgroundColor: '#f5f5f5',
  border: '2px solid #ddd',
  display: 'grid',
  gridTemplateColumns: `repeat(${props.cols}, ${props.pieceSize}px)`,
  gridTemplateRows: `repeat(${props.rows}, ${props.pieceSize}px)`
}))

const slotStyle = computed(() => ({
  border: '1px dashed #ccc',
  position: 'relative'
}))

function handlePieceDropped(piece) {
  if (piece.placedInGrid && !placedPieces.value.some((p) => p.id === piece.id)) {
    placedPieces.value.push(piece)
    props.onPiecePlaced(piece)

    // Check if puzzle is complete
    checkCompletion()
  }
}

function checkCompletion() {
  if (placedPieces.value.length === props.rows * props.cols) {
    // All pieces placed
    // Emit complete event if needed
  }
}

function getCompletionStatus() {
  return {
    total: props.rows * props.cols,
    placed: placedPieces.value.length,
    correct: placedPieces.value.filter((p) => p.correctPosition).length
  }
}

// Expose methods for parent components
defineExpose({
  handlePieceDropped,
  getCompletionStatus
})
</script>

<script>
export default {
  name: 'PuzzleGrid'
}
</script>

<style scoped>
.puzzle-grid {
  position: relative;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.puzzle-grid-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.puzzle-grid-slot:hover {
  background-color: #e8f5e9;
}

.placeholder {
  width: 80%;
  height: 80%;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  border: 2px dashed #ccc;
}

.placed-piece {
  object-fit: contain;
  display: block;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
