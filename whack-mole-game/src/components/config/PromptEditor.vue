<template>
  <div class="prompt-editor">
    <label class="editor-label">Character Description Prompt</label>
    <textarea
      v-model="localPrompt"
      class="prompt-textarea"
      placeholder="Describe your character... (e.g., 'A cute fantasy hero with magical powers')"
      :maxlength="500"
      @input="handleInput"
    ></textarea>
    
    <div class="prompt-actions">
      <div class="preset-dropdown">
        <select 
          v-model="selectedPresetIndex" 
          @change="handlePresetSelect"
          class="preset-select"
        >
          <option value="">Select Preset...</option>
          <option 
            v-for="(preset, index) in presets" 
            :key="index" 
            :value="index"
          >
            {{ preset.name }}
          </option>
        </select>
      </div>
      
      <Button 
        variant="primary" 
        size="medium" 
        :loading="loading"
        @click="handleGenerate"
        class="generate-button"
      >
        <span v-if="!loading" class="button-icon">🎨</span>
        <span v-else class="spinner"></span>
        {{ loading ? 'Generating...' : 'Generate Character' }}
      </Button>
    </div>

    <div v-if="history.length > 0" class="prompt-history">
      <h4 class="history-title">Recent Prompts</h4>
      <div class="history-list">
        <div
          v-for="(prompt, index) in history.slice(0, 5)"
          :key="index"
          class="history-item"
          @click="localPrompt = prompt"
        >
          {{ prompt.substring(0, 50) }}{{ prompt.length > 50 ? '...' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * AI prompt input with preset selection and history
 */

import { ref, computed, watch } from 'vue'
import Button from '@components/shared/Button.vue'

const props = defineProps({
  currentPrompt: {
    type: String,
    default: ''
  },
  presets: {
    type: Array,
    default: () => []
  },
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['prompt-change', 'generate', 'preset-select'])

const localPrompt = ref(props.currentPrompt)
const selectedPresetIndex = ref('')
const loading = ref(false)

function handleInput() {
  emit('prompt-change', localPrompt.value)
}

function handlePresetSelect() {
  const index = parseInt(selectedPresetIndex.value)
  if (!isNaN(index) && props.presets[index]) {
    const preset = props.presets[index]
    localPrompt.value = preset.prompt
    emit('preset-select', preset)
  }
}

function handleGenerate() {
  loading.value = true
  emit('generate', localPrompt.value)
  
  // Simulate loading (in real implementation, this would be async)
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

// Watch for prop changes
watch(() => props.currentPrompt, (newVal) => {
  localPrompt.value = newVal
})
</script>

<script>
export default {
  name: 'PromptEditor'
}
</script>

<style scoped>
.prompt-editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.editor-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
}

.prompt-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.prompt-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.preset-dropdown {
  flex: 1;
}

.preset-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.preset-select:focus {
  outline: none;
  border-color: #667eea;
}

.generate-button {
  flex-shrink: 0;
}

.prompt-history {
  margin-top: 0.5rem;
}

.history-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #555;
}

.history-item:hover {
  background: #e9ecef;
  transform: translateX(2px);
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.button-icon {
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .prompt-actions {
    flex-direction: column;
  }

  .generate-button {
    width: 100%;
  }

  .preset-select {
    width: 100%;
  }
}
</style>
