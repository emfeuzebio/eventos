<template>
  <CFooter class="px-4">
    <div>
      <a href="https://coreui.io" target="_blank" class="text-mobile-compact">CoreUI</a>
      <span class="ms-1 text-mobile-compact">&copy; {{ new Date().getFullYear() }} creativeLabs.</span>
    </div>
    <div class="ms-auto">
      <span class="me-1 text-mobile-compact" target="_blank">Powered by</span>
      <a href="https://coreui.io/vue" class="text-mobile-compact">CoreUI for Vue</a>
    </div>
  </CFooter>
</template>

<style scoped>
  /* Classe que só afeta mobile */
  .text-mobile-compact {
    font-size: 0.9rem;
    letter-spacing: -0.9px;
  }
  /* Sobrescreve no desktop */
  @media (min-width: 576px) {
    .text-mobile-compact {
      font-size: inherit;
      letter-spacing: normal;
    }
  }
</style>
