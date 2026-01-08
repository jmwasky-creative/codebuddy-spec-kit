<template>
  <div class="difficulty-preset">
    <label class="preset-label">Difficulty Preset</label>
    <div class="preset-buttons">
      <Button
        v-for="preset in presets"
        :key="preset.name"
        :variant="currentPreset === preset.name ? 'primary' : 'secondary'"
        size="small"
        @click="handlePresetSelect(preset.name)"
        class="preset-button"
      >
        {{ preset.label }}
      </Button>
    </div>
  </div>
</template>

<script setup>
/**
 * Preset selection for difficulty levels (Easy, Medium, Hard)
 */

import Button from '@components/shared/Button.vue'
import { DIFFICULTY_PRESETS } from '@utils/constants.js'

const props = defineProps({
  currentPreset: {
    type: String,
    default: 'Custom'
  },
  onPresetSelect: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['preset-select'])

const presets = [
  { name: 'Easy', label: 'Easy', config: DIFFICULTY_PRESETS.Easy },
  { name: 'Medium', label: 'Medium', config: DIFFICULTY_PRESETS.Medium },
  { name: 'Hard', label: 'Hard', config: DIFFICULTY_PRESETS.Hard }
]

function handlePresetSelect(presetName) {
  const preset = presets.find((p) => p.name === presetName)
  if (preset) {
    emit('preset-select', preset.name, preset.config)
  }
}
</script>

<script>
export default {
  name: 'DifficultyPreset'
}
</script>

<style scoped>
.difficulty-preset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preset-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .preset-buttons {
    gap: 0.25rem;
  }

  .preset-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
