// src/composables/useToast.js
import { ref } from 'vue'

const toasts = ref([])

/**
 * Tipos semânticos de toast.
 * Cada tipo define cor CoreUI, ícone Font Awesome, título padrão,
 * autohide e delay (ms) padrão.
 *
 * O caller pode sobrescrever qualquer campo individualmente.
 */
const TIPOS = {
  success: {
    color: 'success',
    icon: 'fas fa-check-circle',
    title: 'Sucesso',
    autohide: true,
    delay: 3500,
  },
  error: {
    color: 'danger',
    icon: 'fas fa-times-circle',
    title: 'Erro',
    autohide: true,
    delay: 7000,           // erro fica mais tempo
  },
  warning: {
    color: 'warning',
    icon: 'fas fa-exclamation-triangle',
    title: 'Atenção',
    autohide: true,
    delay: 5000,
  },
  info: {
    color: 'info',
    icon: 'fas fa-info-circle',
    title: 'Informação',
    autohide: true,
    delay: 4000,
  },
  primary: {
    color: 'primary',
    icon: 'fas fa-bell',
    title: '',
    autohide: true,
    delay: 4000,
  },
  secondary: {
    color: 'secondary',
    icon: 'fas fa-comment',
    title: '',
    autohide: true,
    delay: 4000,
  },
}

/**
 * Normaliza a "cor" recebida para um tipo conhecido.
 * - Se for uma chave de TIPOS, usa direto.
 * - Se for 'danger' (CoreUI), mapeia para 'error'.
 * - Se for 'warn', mapeia para 'warning'.
 * - Caso contrário, cai em 'primary'.
 */
function resolverTipo(color, variant) {
  const entrada = (color || variant || 'primary').toString().toLowerCase()

  const mapa = {
    danger: 'error',
    warn: 'warning',
    notice: 'info',
    ok: 'success',
    message: 'info',
  }

  const chave = mapa[entrada] || entrada
  return TIPOS[chave] ? chave : 'primary'
}

export function useToast() {
  /**
   * showToast aceita:
   *   showToast({ type: 'success', message: '...' })
   *   showToast({ color: 'danger', message: '...' })     ← compat
   *   showToast({ variant: 'warning', message: '...' })  ← compat
   *
   * Qualquer campo individual sobrescreve o padrão do tipo.
   */
  const showToast = ({
    type,
    message,
    color,
    variant,
    title,
    icon,
    autohide,
    delay,
  }) => {
    const chaveTipo = type || resolverTipo(color, variant)
    const base = TIPOS[chaveTipo]

    toasts.value.push({
      id: Date.now() + Math.random(),
      type: chaveTipo,
      color: color && TIPOS[color] ? color : base.color,
      icon: icon ?? base.icon,
      title: title ?? base.title,
      message,
      autohide: autohide ?? base.autohide,
      delay: delay ?? base.delay,
    })
  }

  // ---------- Atalhos semânticos ----------
  const showSuccess = (message, opts = {}) =>
    showToast({ type: 'success', message, ...opts })

  const showError = (message, opts = {}) =>
    showToast({ type: 'error', message, ...opts })

  const showWarning = (message, opts = {}) =>
    showToast({ type: 'warning', message, ...opts })

  const showInfo = (message, opts = {}) =>
    showToast({ type: 'info', message, ...opts })

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    showToast,
    // atalhos
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  }
}