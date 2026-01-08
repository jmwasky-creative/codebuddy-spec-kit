/**
 * AI Image Generation Service
 * Handles integration with AI image generation APIs
 */

import { createPlaceholderImage } from '@utils/puzzleGenerator.js'

/**
 * Generate an AI image from a prompt
 * @param {string} prompt - Text prompt for image generation
 * @param {Object} options - Generation options
 * @param {number} options.width - Image width (default: 512)
 * @param {number} options.height - Image height (default: 512)
 * @param {string} options.format - Image format (default: 'png')
 * @returns {Promise<{dataUrl: string, width: number, height: number, generationDuration: number}>}
 */
export async function generateImage(prompt, options = {}) {
  const startTime = Date.now()

  const { width = 512, height = 512, format = 'png' } = options

  try {
    // Check if AI service is configured
    const apiUrl = import.meta.env.VITE_AI_IMAGE_API_URL
    const apiKey = import.meta.env.VITE_AI_IMAGE_API_KEY

    if (!apiUrl || !apiKey) {
      console.warn('AI image service not configured, using placeholder')
      return await generatePlaceholderImage(prompt, width, height)
    }

    // Call AI image generation API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: `${width}x${height}`,
        response_format: 'b64_json'
      })
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Handle different API response formats
    let base64Image
    if (data.data && data.data[0]) {
      base64Image = data.data[0].b64_json || data.data[0].url
    } else if (data.image) {
      base64Image = data.image
    } else {
      throw new Error('Unexpected API response format')
    }

    // Convert to data URL if needed
    const dataUrl = base64Image.startsWith('data:')
      ? base64Image
      : `data:image/${format};base64,${base64Image}`

    const generationDuration = Date.now() - startTime

    return {
      dataUrl,
      width,
      height,
      generationDuration,
      generationService: 'AI'
    }
  } catch (error) {
    console.error('Failed to generate AI image:', error)
    console.warn('Falling back to placeholder image')
    return await generatePlaceholderImage(prompt, width, height)
  }
}

/**
 * Generate a placeholder image as fallback
 * @param {string} prompt - Prompt (used to determine color)
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Promise<{dataUrl: string, width: number, height: number}>}
 */
async function generatePlaceholderImage(prompt, width, height) {
  // Generate color based on prompt hash
  const hash = hashString(prompt)
  const hue = hash % 360
  const color = `hsl(${hue}, 70%, 50%)`

  const dataUrl = createPlaceholderImage(width, height, color)

  return {
    dataUrl,
    width,
    height,
    generationDuration: 0,
    generationService: 'placeholder',
    isDefault: true
  }
}

/**
 * Hash a string to generate a consistent color
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Validate image format
 * @param {string} format - Image format
 * @returns {boolean} True if format is valid
 */
export function isValidImageFormat(format) {
  const validFormats = ['png', 'jpeg', 'webp']
  return validFormats.includes(format.toLowerCase())
}

/**
 * Validate image dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {boolean} True if dimensions are valid
 */
export function isValidImageDimensions(width, height) {
  const minSize = 64
  const maxSize = 4096
  return (
    width >= minSize &&
    width <= maxSize &&
    height >= minSize &&
    height <= maxSize
  )
}

export default {
  generateImage,
  isValidImageFormat,
  isValidImageDimensions
}
