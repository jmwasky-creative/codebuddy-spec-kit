import { ref, reactive, computed } from 'vue';
import configService from '../services/configService.js';

/**
 * Config Composable
 * Manages game configuration state with persistence
 */
export function useConfig() {
  // Reactive config state
  const config = reactive({ ...configService.getConfig() });
  const presets = ref(configService.getAllPresets());
  const selectedPresetId = ref('medium');

  // Validation errors
  const validationErrors = ref([]);

  /**
   * Update config with validation
   */
  const updateConfig = (updates) => {
    const result = configService.updateConfig(updates);

    if (result.valid) {
      Object.assign(config, result.config);
      validationErrors.value = [];
      return true;
    } else {
      validationErrors.value = result.errors;
      return false;
    }
  };

  /**
   * Reset to defaults
   */
  const resetConfig = () => {
    const newConfig = configService.resetConfig();
    Object.assign(config, newConfig);
    validationErrors.value = [];
    selectedPresetId.value = 'medium';
  };

  /**
   * Apply a preset
   */
  const applyPreset = (preset) => {
    const result = configService.applyPreset(preset.config);

    if (result.valid) {
      Object.assign(config, result.config);
      selectedPresetId.value = preset.id;
      validationErrors.value = [];
      return true;
    } else {
      validationErrors.value = result.errors;
      return false;
    }
  };

  /**
   * Save custom preset
   */
  const saveCustomPreset = (name) => {
    const result = configService.saveCustomPreset(name, { ...config });
    if (result.success) {
      presets.value = configService.getAllPresets();
      validationErrors.value = [];
      return true;
    } else {
      validationErrors.value = result.errors;
      return false;
    }
  };

  /**
   * Delete custom preset
   */
  const deleteCustomPreset = (name) => {
    configService.deleteCustomPreset(name);
    presets.value = configService.getAllPresets();
  };

  /**
   * Validate current config
   */
  const validate = () => {
    const result = configService.validate(config);
    validationErrors.value = result.errors;
    return result.valid;
  };

  /**
   * Get selected preset
   */
  const selectedPreset = computed(() => {
    return presets.value.find(p => p.id === selectedPresetId.value);
  });

  /**
   * Is valid config
   */
  const isValid = computed(() => {
    return validationErrors.value.length === 0;
  });

  /**
   * Is custom config (not matching any preset)
   */
  const isCustom = computed(() => {
    return !presets.value.some(p =>
      JSON.stringify(p.config) === JSON.stringify(config)
    );
  });

  return {
    // State
    config,
    presets,
    selectedPresetId,
    validationErrors,

    // Computed
    selectedPreset,
    isValid,
    isCustom,

    // Actions
    updateConfig,
    resetConfig,
    applyPreset,
    saveCustomPreset,
    deleteCustomPreset,
    validate
  };
}
