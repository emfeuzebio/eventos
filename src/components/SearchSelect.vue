<template>
    <div class="position-relative">
      <input
        type="text"
        class="form-control"
        v-model="search"
        @focus="dropdownVisible = true"
        @blur="handleBlur"
        :placeholder="placeholder"
      />
  
      <ul
        v-if="dropdownVisible && filteredOptions.length"
        class="list-group position-absolute w-100 zindex-dropdown shadow-sm"
        style="max-height: 300px; overflow-y: auto;"
      >
        <li
          v-for="(option, index) in visibleOptions"
          :key="index"
          class="list-group-item list-group-item-action"
          :class="{ active: option === modelValue }"
          @mousedown.prevent="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
  
      <div v-if="dropdownVisible && !filteredOptions.length" class="position-absolute w-100 bg-white border p-2 text-muted">
        Nenhuma opção encontrada
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  
  const props = defineProps({
    modelValue: Object,
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Selecione',
    },
    limit: {
      type: Number,
      default: 10,
    },
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const search = ref('')
  const dropdownVisible = ref(false)
  
  const filteredOptions = computed(() =>
    props.options.filter((opt) =>
      opt.label.toLowerCase().includes(search.value.toLowerCase())
    )
  )
  
  const visibleOptions = computed(() =>
    filteredOptions.value.slice(0, props.limit)
  )
  
  function selectOption(option) {
    emit('update:modelValue', option)
    search.value = option.label
    dropdownVisible.value = false
  }
  
  function handleBlur() {
    setTimeout(() => {
      dropdownVisible.value = false
    }, 200) // Dá tempo de selecionar
  }
  
  // Inicializa com valor se já estiver selecionado
  watch(
    () => props.modelValue,
    (val) => {
      if (val?.label) {
        search.value = val.label
      }
    },
    { immediate: true }
  )
  </script>
  
  <style scoped>
  .zindex-dropdown {
    z-index: 1000;
  }
  </style>
  