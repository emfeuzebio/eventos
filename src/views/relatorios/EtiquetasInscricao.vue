<template>
  <div>
    <h1 class="mb-4">Etiquetas de Inscrição para crachá</h1>

    <div v-if="currentEvent" class="alert alert-secondary">
      <strong>Evento:</strong> {{ currentEvent.nome }}
    </div>

    <CButton
      class="'btn btn-lg btn-outline-info me-1'"
      size="lg"
      @click="gerarPDF"
      :disabled="loading"
    >
      <i class="fas fa-file-pdf me-2"></i>
      {{ loading ? 'Gerando...' : 'Gerar PDF' }}
    </CButton>

    <div v-if="erro" class="alert alert-danger mt-3">{{ erro }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCurrentEventStore } from '@/stores/currentEvent';
import api from '@/services/api';
import { useToast } from '@/composables/useToast';

const { showToast } = useToast();
const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);

const loading = ref(false);
const erro = ref(null);

const gerarPDF = async () => {
  if (!currentEvent.value?.id) {
    erro.value = 'Nenhum evento selecionado.';
    return;
  }

  loading.value = true;
  erro.value = null;

  try {
    const response = await api.get(
      `/inscricao/relatorio-etiquetas-inscricao/${currentEvent.value.id}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `etiquetas_inscricao_${currentEvent.value.sigla || 'evento'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showToast({
      title: 'Sucesso',
      message: 'PDF gerado com sucesso!',
      variant: 'success',
    });
  } catch (error) {
    erro.value = error.response?.data?.message || 'Erro ao gerar o relatório.';
    showToast({
      title: 'Erro',
      message: erro.value,
      variant: 'danger',
    });
  } finally {
    loading.value = false;
  }
};
</script>