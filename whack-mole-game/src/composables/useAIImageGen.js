/**
 * AI Image Generation Composable
 * Manages AI image generation state and operations
 */

import { ref, computed } from 'vue'
import { generateImage, isValidImageFormat, isValidImageDimensions } from '@services/aiImageService.js'
import { saveCharacter, getCharacter } from '@services/storageService.js'

/**
 * Composable for AI image generation
 */
export function useAIImageGen() {
  const isGenerating = ref(false)
  const error = ref(null)
  const generatedCharacter = ref(null)
  const generationProgress = ref(0)

  /**
   * Generate an AI character image
   * @param {string} prompt - Character description prompt
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated character object
   */
  async function generateCharacter(prompt, options = {}) {
    isGenerating.value = true
    error.value = null
    generationProgress.value = 0

    try {
      // Validate prompt
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt cannot be empty')
      }

      // Validate options
      const { width = 512, height = 512, format = 'png' } = options

      if (!isValidImageDimensions(width, height)) {
        throw new Error('Invalid image dimensions')
      }

      if (!isValidImageFormat(format)) {
        throw new Error('Invalid image format')
      }

      generationProgress.value = 20

      // Generate image
      const imageData = await generateImage(prompt, options)
      generationProgress.value = 60

      // Create character object
      const character = {
        id: `character-${Date.now()}`,
        prompt,
        promptTheme: options.theme || null,
        imageData: imageData.dataUrl,
        imageFormat: format,
        width: imageData.width,
        height: imageData.height,
        aspectRatio: imageData.width / imageData.height,
        gridConfig: options.gridConfig || { rows: 3, cols: 3 },
        pieceWidth: imageData.width / (options.gridConfig?.cols || 3),
        pieceHeight: imageData.height / (options.gridConfig?.rows || 3),
        createdAt: Date.now(),
        generationDuration: imageData.generationDuration,
        generationService: imageData.generationService || 'placeholder',
        isDefault: imageData.isDefault || false
      }

      // Save to IndexedDB
      await saveCharacter(character)
      generationProgress.value = 80

      generatedCharacter.value = character
      generationProgress.value = 100

      return character
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isGenerating.value = false
      setTimeout(() => {
        generationProgress.value = 0
      }, 1000)
    }
  }

  /**
   * Load an existing character from IndexedDB
   * @param {string} characterId - Character ID
   * @returns {Promise<Object|null>} Character object or null
   */
  async function loadCharacter(characterId) {
    try {
      const character = await getCharacter(characterId)
      if (character) {
        generatedCharacter.value = character
        return character
      }
      return null
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  /**
   * Reset generation state
   */
  function reset() {
    isGenerating.value = false
    error.value = null
    generatedCharacter.value = null
    generationProgress.value = 0
  }

  /**
   * Check if a character is currently being generated
   */
  const loading = computed(() => isGenerating.value)

  /**
   * Get current error message
   */
  const errorMessage = computed(() => error.value)

  /**
   * Get current generated character
   */
  const character = computed(() => generatedCharacter.value)

  /**
   * Get generation progress percentage
   */
  const progress = computed(() => generationProgress.value)

  return {
    // State
    loading,
    errorMessage,
    character,
    progress,
    isGenerating,

    // Methods
    generateCharacter,
    loadCharacter,
    reset
  }
}

export default useAIImageGen
