<template>
  <div class="config-panel">
    <div class="config-header">
      <h2>Game Configuration</h2>
      <button class="back-button" @click="$emit('back')">
        ← Back
      </button>
    </div>

    <div class="config-content">
      <!-- Difficulty Presets -->
      <section class="config-section">
        <h3>Difficulty Presets</h3>
        <div class="preset-grid">
          <div
            v-for="preset in presets"
            :key="preset.id"
            :class="['preset-card', { active: selectedPresetId === preset.id }]"
            @click="selectPreset(preset)"
          >
            <div class="preset-name">{{ preset.name }}</div>
            <div class="preset-desc">{{ preset.description }}</div>
            <div
              v-if="preset.id.startsWith('custom')"
              class="preset-delete"
              @click.stop="deletePreset(preset)"
            >
              ×
            </div>
          </div>
        </div>
      </section>

      <!-- Grid Settings -->
      <section class="config-section">
        <h3>Grid Settings</h3>
        <ParameterSlider
          v-model="config.gridRows"
          label="Grid Rows"
          :min="2"
          :max="6"
          @update:model-value="updateValue('gridRows', $event)"
        />
        <ParameterSlider
          v-model="config.gridCols"
          label="Grid Columns"
          :min="2"
          :max="6"
          @update:model-value="updateValue('gridCols', $event)"
        />
      </section>

      <!-- Mole Settings -->
      <section class="config-section">
        <h3>Mole Settings</h3>
        <ParameterSlider
          v-model="config.moleFrequency"
          label="Mole Frequency (ms)"
          :min="500"
          :max="4000"
          :step="100"
          :format="formatMs"
          @update:model-value="updateValue('moleFrequency', $event)"
        />
        <ParameterSlider
          v-model="config.moleStayTime"
          label="Mole Stay Time (ms)"
          :min="500"
          :max="3000"
          :step="100"
          :format="formatMs"
          @update:model-value="updateValue('moleStayTime', $event)"
        />
      </section>

      <!-- Scoring -->
      <section class="config-section">
        <h3>Scoring</h3>
        <ParameterSlider
          v-model="config.scoreThreshold"
          label="Score Threshold"
          :min="100"
          :max="2000"
          :step="50"
          @update:model-value="updateValue('scoreThreshold', $event)"
        />
      </section>

      <!-- AI Prompt -->
      <section class="config-section">
        <h3>AI Image Prompt</h3>
        <PromptEditor
          v-model="config.aiPrompt"
          @save="savePrompt"
        />
      </section>

      <!-- Validation Errors -->
      <div v-if="validationErrors.length > 0" class="validation-errors">
        <div class="error-title">Configuration Errors:</div>
        <ul>
          <li v-for="(error, idx) in validationErrors" :key="idx">
            {{ error }}
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="config-actions">
        <Button variant="secondary" @click="handleReset">
          Reset to Defaults
        </Button>
        <Button
          variant="primary"
          :disabled="!isValid"
          @click="handleApply"
        >
          Apply Configuration
        </Button>
        <Button
          v-if="isCustom"
          variant="outline"
          @click="handleSavePreset"
        >
          Save as Preset
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useConfig } from '../../composables/useConfig.js';
import Button from '../shared/Button.vue';
import ParameterSlider from './ParameterSlider.vue';
import DifficultyPreset from './DifficultyPreset.vue';
import PromptEditor from './PromptEditor.vue';

const emit = defineEmits(['apply', 'reset', 'back', 'save-preset']);

const {
  config,
  presets,
  selectedPresetId,
  validationErrors,
  isValid,
  isCustom,
  updateConfig,
  resetConfig,
  applyPreset,
  saveCustomPreset,
  deleteCustomPreset
} = useConfig();

const selectPreset = (preset) => {
  applyPreset(preset);
};

const updateValue = (key, value) => {
  updateConfig({ [key]: value });
};

const handleApply = () => {
  if (validate()) {
    emit('apply', { ...config });
  }
};

const handleReset = () => {
  resetConfig();
  emit('reset');
};

const handleSavePreset = () => {
  const name = prompt('Enter preset name:');
  if (name && name.trim()) {
    saveCustomPreset(name.trim());
    emit('save-preset', { name, config: { ...config } });
  }
};

const deletePreset = (preset) => {
  if (confirm(`Delete preset "${preset.name}"?`)) {
    deleteCustomPreset(preset.name);
  }
};

const savePrompt = (prompt) => {
  updateConfig({ aiPrompt: prompt });
};

const formatMs = (val) => `${val}ms`;
</script>

<style scoped>
.config-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #2c3e50;
}

.config-header h2 {
  margin: 0;
  color: #2c3e50;
}

.back-button {
  padding: 8px 16px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.back-button:hover {
  background: #7f8c8d;
}

.config-content {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
}

.config-section {
  margin-bottom: 30px;
}

.config-section h3 {
  margin: 0 0 20px 0;
  color: #34495e;
  font-size: 1.2em;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.preset-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.preset-card:hover {
  border-color: #3498db;
  transform: translateY(-2px);
}

.preset-card.active {
  border-color: #3498db;
  background: #e8f4fc;
}

.preset-name {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
}

.preset-desc {
  font-size: 0.9em;
  color: #7f8c8d;
}

.preset-delete {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.validation-errors {
  background: #fff5f5;
  border: 1px solid #fc8181;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.error-title {
  font-weight: bold;
  color: #c53030;
  margin-bottom: 10px;
}

.validation-errors ul {
  margin: 0;
  padding-left: 20px;
}

.validation-errors li {
  color: #c53030;
}

.config-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
</style>
