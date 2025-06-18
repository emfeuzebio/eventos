// src/composables/useToast.js
import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const showToast = ({ message, color = 'primary', title = '', autohide = true, delay = 4000 }) => {
    toasts.value.push({
      message,
      color,
      title,
      autohide,
      delay,
      id: Date.now() + Math.random(),
    })
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, showToast, removeToast }
}
