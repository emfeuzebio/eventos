// src/stores/loading.js
import { ref } from 'vue';

const globalLoading = ref(false);
let count = 0;

function startLoading() {
  count++;
  globalLoading.value = true;
}

function stopLoading() {
  count = Math.max(0, count - 1);
  if (count === 0) globalLoading.value = false;
}

export function useGlobalLoading() {
  return { globalLoading, startLoading, stopLoading };
}
