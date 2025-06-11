import { ref } from 'vue'

// Estado global simples
const visible = ref(false)
const message = ref('')

/**
 * Abre o modal de erro com a mensagem dada
 */
function showError(msg) {
  message.value = msg
  visible.value = true
}

/**
 * Fecha o modal de erro
 */
function close() {
  visible.value = false
}

/**
 * Composable para modal global de erro
 */
export function useGlobalError() {
  return {
    visible,
    message,
    showError,
    close,
  }
}
