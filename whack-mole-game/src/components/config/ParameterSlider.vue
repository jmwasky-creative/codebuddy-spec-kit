<template>
  <div class="parameter-slider">
    <label class="slider-label">{{ label }}</label>
    <div class="slider-container">
      <input
        :id="`slider-${_uid}`"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="handleInput"
        class="slider-input"
      />
      <div class="slider-value">{{ formattedValue }} {{ unit }}</div>
    </div>
  </div>
</template>

<script setup>
/**
 * Reusable adjustable parameter control with min/max and value display
 */

import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function handleInput(event) {
  const value = parseFloat(event.target.value)
  emit('update:modelValue', value)
}

const formattedValue = computed(() => {
  return props.step >= 1 
    ? Math.round(props.modelValue)
    : props.modelValue.toFixed(1)
})

const _uid = Math.random().toString(36).substr(2, 9)
</script>

<script>
export default {
  name: 'ParameterSlider'
}
</script>

<style scoped>
.parameter-slider {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slider-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider-input {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  outline: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.slider-value {
  min-width: 80px;
  text-align: right;
  font-weight: 700;
  color: #667eea;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .slider-container {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .slider-value {
    text-align: center;
  }
}
</style>
