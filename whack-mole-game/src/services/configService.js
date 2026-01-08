import { DEFAULT_CONFIG } from '../utils/constants.js';
import { validateConfig } from '../utils/validation.js';

/**
 * Configuration Service
 * Manages game configuration with validation and persistence
 */
class ConfigService {
  constructor() {
    this.currentConfig = { ...DEFAULT_CONFIG };
    this.customPresets = [];
    this.loadConfig();
  }

  /**
   * Load configuration from storage (synchronous)
   */
  loadConfig() {
    try {
      const stored = localStorage.getItem('gameConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validation = validateConfig(parsed);

        if (validation.valid) {
          this.currentConfig = { ...DEFAULT_CONFIG, ...parsed };
        } else {
          console.warn('Invalid stored config, using defaults:', validation.errors);
        }
      }

      const storedPresets = localStorage.getItem('customPresets');
      if (storedPresets) {
        this.customPresets = JSON.parse(storedPresets);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      this.currentConfig = { ...DEFAULT_CONFIG };
    }
  }

  /**
   * Save current configuration to storage
   */
  saveConfig() {
    try {
      localStorage.setItem('gameConfig', JSON.stringify(this.currentConfig));
      localStorage.setItem('customPresets', JSON.stringify(this.customPresets));
      return true;
    } catch (error) {
      console.error('Failed to save config:', error);
      return false;
    }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.currentConfig };
  }

  /**
   * Update configuration with validation
   * @param {Object} updates - Partial config updates
   * @returns {Object} { valid: boolean, errors: string[], config: Object }
   */
  updateConfig(updates) {
    const newConfig = { ...this.currentConfig, ...updates };
    const validation = validateConfig(newConfig);

    if (validation.valid) {
      this.currentConfig = newConfig;
      this.saveConfig();
      return { valid: true, errors: [], config: this.currentConfig };
    } else {
      return { valid: false, errors: validation.errors, config: this.currentConfig };
    }
  }

  /**
   * Reset to default configuration
   */
  resetConfig() {
    this.currentConfig = { ...DEFAULT_CONFIG };
    this.saveConfig();
    return this.currentConfig;
  }

  /**
   * Apply a preset
   * @param {Object} preset - Preset configuration
   */
  applyPreset(preset) {
    return this.updateConfig(preset);
  }

  /**
   * Save a custom preset
   * @param {string} name - Preset name
   * @param {Object} config - Preset configuration
   */
  saveCustomPreset(name, config) {
    const validation = validateConfig(config);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const existingIndex = this.customPresets.findIndex(p => p.name === name);
    if (existingIndex >= 0) {
      this.customPresets[existingIndex] = { name, config };
    } else {
      this.customPresets.push({ name, config });
    }

    this.saveConfig();
    return { success: true, errors: [] };
  }

  /**
   * Delete a custom preset
   * @param {string} name - Preset name
   */
  deleteCustomPreset(name) {
    this.customPresets = this.customPresets.filter(p => p.name !== name);
    this.saveConfig();
  }

  /**
   * Get all presets (built-in + custom)
   */
  getAllPresets() {
    return [
      {
        id: 'easy',
        name: 'Easy',
        description: 'Relaxed gameplay with larger targets',
        config: {
          gridRows: 3,
          gridCols: 3,
          moleFrequency: 2000,
          moleStayTime: 2500,
          scoreThreshold: 300
        }
      },
      {
        id: 'medium',
        name: 'Medium',
        description: 'Balanced challenge',
        config: { ...DEFAULT_CONFIG }
      },
      {
        id: 'hard',
        name: 'Hard',
        description: 'Fast-paced with higher requirements',
        config: {
          gridRows: 5,
          gridCols: 5,
          moleFrequency: 600,
          moleStayTime: 800,
          scoreThreshold: 1000
        }
      },
      ...this.customPresets.map((p, idx) => ({
        id: `custom-${idx}`,
        name: p.name,
        description: 'Custom preset',
        config: p.config
      }))
    ];
  }

  /**
   * Validate configuration before applying
   * @param {Object} config - Configuration to validate
   */
  validate(config) {
    return validateConfig(config);
  }
}

// Singleton instance
const configService = new ConfigService();

export default configService;
