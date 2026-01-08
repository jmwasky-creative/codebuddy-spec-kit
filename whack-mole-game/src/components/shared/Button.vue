<template>
  <button
    :class="['button', variantClass, sizeClass, { disabled, loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-if="icon" class="icon">{{ icon }}</span>
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Reusable button component with variants and states
 */

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}

const variantClass = computed(() => `button--${props.variant}`)
const sizeClass = computed(() => `button--${props.size}`)
</script>

<script>
export default {
  name: 'Button'
}
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover:not(.disabled):not(.loading) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button:active:not(.disabled):not(.loading) {
  transform: translateY(0);
}

.button--primary {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.button--secondary {
  background: #f5f5f5;
  color: #333;
}

.button--danger {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
}

.button--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.button--medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.button--large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button.loading {
  opacity: 0.7;
  cursor: wait;
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

.icon {
  font-size: 1.125rem;
}
</style>
