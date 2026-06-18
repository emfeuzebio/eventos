<template>
  <div>
    <h1 class="mb-4">Previsão de Alimentação</h1>

    <!-- Evento atual -->
    <div v-if="currentEvent" class="alert alert-secondary">
      <strong>Evento:</strong> {{ currentEvent.nome }}
      <span class="badge bg-info ms-2">{{ currentEvent.periodo_datas }}</span>
    </div>

    <!-- Botão para gerar PDF -->
    <CButton
      class="'btn btn-lg btn-outline-info me-1"
      @click="gerarPDF"
      :disabled="loading"
    >
      <i class="fas fa-file-pdf me-2"></i>
      {{ loading ? 'Gerando...' : 'Gerar PDF' }}
    </CButton>

    <hr />

    <!-- Mensagem de erro -->
    <div v-if="erro" class="alert alert-danger">
      {{ erro }}
    </div>

    <!-- Resumo -->
    <div v-if="dadosResumo" class="row mt-4">
      <div class="col-md-3">
        <CWidgetStatsA
          color="info"
          title="Total de Refeições"
          :value="dadosResumo.total_geral"
        />
      </div>
      <div class="col-md-3">
        <CWidgetStatsA
          color="success"
          title="FEB"
          :value="dadosResumo.total_feb"
        />
      </div>
      <div class="col-md-3">
        <CWidgetStatsA
          color="warning"
          title="Particular"
          :value="dadosResumo.total_part"
        />
      </div>
      <div class="col-md-3">
        <CWidgetStatsA
          color="danger"
          title="Valor Total"
          :value="`R$ ${dadosResumo.valor_total}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

console.log('✅ PrevisaoAlimentacao carregado!')


import { ref, computed } from 'vue';
import { useCurrentEventStore } from '@/stores/currentEvent';
import api from '@/services/api';
import { useToast } from '@/composables/useToast';
import { useUserStore } from '@/stores/userStore';
import { getAbilities } from '@/services/AuthorizationsService';

const { showToast } = useToast();
const userStore = useUserStore();

// Evento atual
const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);

// Estado
const loading = ref(false);
const erro = ref(null);
const dadosResumo = ref(null);

// Verificar permissão
const podeAcessar = computed(() => {
  const abilities = getAbilities();
  // console.log('Abilities do usuário:', abilities);
  // return abilities.includes('relatorio.alimentacao');
  // return abilities.includes('inscricao.rel.alimentacao.prev'); // incluida a autotirization no ACL4
  return abilities.includes('inscricao.update');
});

// Gerar PDF
const gerarPDF = async () => {
  if (!currentEvent.value?.id) {
    erro.value = 'Nenhum evento selecionado.';
    return;
  }

  if (!podeAcessar.value) {
    erro.value = 'Acesso Negado. Seu Perfil de Acesso não permite gerar este relatório.';
    return;
  }

  loading.value = true;
  erro.value = null;

  try {
    const response = await api.get(
      `/inscricao/relatorio-alimentacao/${currentEvent.value.id}`,
      // /inscricao/relatorio-alimentacao - este está na API
      {
        responseType: 'blob',
      }
    );

    // Criar link para download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentEvent.value.sigla || 'evento'}_previsao_alimentacao.pdf`;
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
    console.error('Erro ao gerar PDF:', error);
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

// Se não tiver permissão, redireciona
if (!podeAcessar.value) {
  // Opcional: redirecionar para página de acesso negado
  // router.push('/pages/403');
}
</script>

<style scoped>
  .btn-success {
    min-width: 200px;
  }
</style>

