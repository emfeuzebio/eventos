<template>
  <div>
    <h1 class="mb-4">Etiqueta Customizada para Crachá</h1>

    <!-- Evento atual -->
    <div v-if="currentEvent" class="alert alert-secondary">
      <strong>Evento:</strong> {{ currentEvent.nome }}
      <span class="badge bg-info ms-2">{{ currentEvent.periodo_datas }}</span>
    </div>
    <div v-else class="alert alert-warning">
      <i class="fas fa-exclamation-triangle me-2"></i>
      Nenhum evento selecionado. Selecione um evento para continuar.
    </div>

    <hr />

    <!-- Configuração das Linhas -->
    <div class="row">
      <!-- Linha 1 -->
      <div class="col-md-12 mb-3">
        <h5>Linha 1</h5>
        <div class="row">
          <div class="col-md-4">
            <label class="form-label fw-bold">Campo</label>
            <select v-model="config.linha1_campo" class="form-select">
              <option v-for="campo in camposDisponiveis" :key="campo.value" :value="campo.value">
                {{ campo.label }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Tamanho (px)</label>
            <select v-model="config.linha1_tamanho" class="form-select">
              <option v-for="t in tamanhos" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Cor</label>
            <select v-model="config.linha1_cor" class="form-select">
              <option v-for="cor in cores" :key="cor.value" :value="cor.value">
                <span :style="{ color: cor.hex }">{{ cor.label }}</span>
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Linha 2 -->
      <div class="col-md-12 mb-3">
        <h5>Linha 2</h5>
        <div class="row">
          <div class="col-md-4">
            <label class="form-label fw-bold">Campo</label>
            <select v-model="config.linha2_campo" class="form-select">
              <option v-for="campo in camposDisponiveis" :key="campo.value" :value="campo.value">
                {{ campo.label }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Tamanho (px)</label>
            <select v-model="config.linha2_tamanho" class="form-select">
              <option v-for="t in tamanhos" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Cor</label>
            <select v-model="config.linha2_cor" class="form-select">
              <option v-for="cor in cores" :key="cor.value" :value="cor.value">
                {{ cor.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Linha 3 -->
      <div class="col-md-12 mb-3">
        <h5>Linha 3</h5>
        <div class="row">
          <div class="col-md-4">
            <label class="form-label fw-bold">Campo</label>
            <select v-model="config.linha3_campo" class="form-select">
              <option v-for="campo in camposDisponiveis" :key="campo.value" :value="campo.value">
                {{ campo.label }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Tamanho (px)</label>
            <select v-model="config.linha3_tamanho" class="form-select">
              <option v-for="t in tamanhos" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Cor</label>
            <select v-model="config.linha3_cor" class="form-select">
              <option v-for="cor in cores" :key="cor.value" :value="cor.value">
                {{ cor.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <!-- Pré-visualização (opcional) -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-light">
            <strong>Pré-visualização</strong>
          </div>
          <div class="card-body">
            <div class="etiqueta-preview">
              <div class="preview-linha1" :style="previewEstiloLinha1">
                {{ previewLinha1 }}
              </div>
              <div class="preview-linha2" :style="previewEstiloLinha2">
                {{ previewLinha2 }}
              </div>
              <div class="preview-linha3" :style="previewEstiloLinha3">
                {{ previewLinha3 }}
              </div>
              <div class="preview-evento">Evento: {{ currentEvent?.sigla || '---' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão Gerar PDF -->
    <CButton color="success" size="lg" @click="gerarPDF" :disabled="loading || !currentEvent">
      <i class="fas fa-file-pdf me-2"></i>
      {{ loading ? 'Gerando...' : 'Gerar PDF' }}
    </CButton>

    <!-- Mensagem de erro -->
    <div v-if="erro" class="alert alert-danger mt-3">
      {{ erro }}
    </div>
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

// Opções
const tamanhos = [12, 14, 16, 18, 20, 22];

const cores = [
  { value: 'preto', label: 'Preto', hex: '#000000' },
  { value: 'cinza_escuro', label: 'Cinza Escuro', hex: '#333333' },
  { value: 'cinza_super_escuro', label: 'Cinza Super Escuro', hex: '#1a1a1a' },
  { value: 'cinza', label: 'Cinza', hex: '#666666' },
  { value: 'azul', label: 'Azul', hex: '#0044cc' },
  { value: 'vermelho', label: 'Vermelho', hex: '#cc0000' },
  { value: 'verde', label: 'Verde', hex: '#008800' },
];

const camposDisponiveis = [
  { value: 'nome_completo', label: 'Nome Completo' },
  { value: 'nome_social', label: 'Nome Social' },
  { value: 'funcao', label: 'Função/Papel no Evento' },
  { value: 'entidade', label: 'Sigla da Entidade' },
  { value: 'evento', label: 'Evento' },
];

// Configuração padrão
const config = ref({
  linha1_campo: 'nome_social',
  linha1_tamanho: 20,
  linha1_cor: 'preto',
  linha2_campo: 'funcao',
  linha2_tamanho: 18,
  linha2_cor: 'preto',
  linha3_campo: 'entidade',
  linha3_tamanho: 14,
  linha3_cor: 'preto',
});

// Estado
const loading = ref(false);
const erro = ref(null);

// Pré-visualização
const previewLinha1 = computed(() => {
  const map = {
    nome_completo: 'João da Silva',
    nome_social: 'Joãozinho',
    funcao: 'Representante',
    entidade: 'FEEAL',
    evento: 'ENAPSE 2026',
  };
  return map[config.value.linha1_campo] || '---';
});

const previewLinha2 = computed(() => {
  const map = {
    nome_completo: 'João Silva',
    nome_social: 'Joãozinho',
    funcao: 'Representante',
    entidade: 'FEEAL',
    evento: 'ENAPSE 2026',
  };
  return map[config.value.linha2_campo] || '---';
});

const previewLinha3 = computed(() => {
  const map = {
    nome_completo: 'João Silva',
    nome_social: 'Joãozinho',
    funcao: 'Representante',
    entidade: 'FEEAL',
    evento: 'ENAPSE 2026',
  };
  return map[config.value.linha3_campo] || '---';
});

const previewEstiloLinha1 = computed(() => ({
  fontSize: `${config.value.linha1_tamanho}px`,
  color: cores.find(c => c.value === config.value.linha1_cor)?.hex || '#000000',
  fontWeight: 'bold',
}));

const previewEstiloLinha2 = computed(() => ({
  fontSize: `${config.value.linha2_tamanho}px`,
  color: cores.find(c => c.value === config.value.linha2_cor)?.hex || '#000000',
  fontWeight: 'bold',
}));

const previewEstiloLinha3 = computed(() => ({
  fontSize: `${config.value.linha3_tamanho}px`,
  color: cores.find(c => c.value === config.value.linha3_cor)?.hex || '#000000',
}));

// Gerar PDF
const gerarPDF = async () => {
  if (!currentEvent.value?.id) {
    erro.value = 'Nenhum evento selecionado.';
    return;
  }

  loading.value = true;
  erro.value = null;

  const params = new URLSearchParams({
    linha1_campo: config.value.linha1_campo,
    linha1_tamanho: config.value.linha1_tamanho,
    linha1_cor: config.value.linha1_cor,
    linha2_campo: config.value.linha2_campo,
    linha2_tamanho: config.value.linha2_tamanho,
    linha2_cor: config.value.linha2_cor,
    linha3_campo: config.value.linha3_campo,
    linha3_tamanho: config.value.linha3_tamanho,
    linha3_cor: config.value.linha3_cor,
  });

  try {
    const response = await api.get(
      `/inscricao/relatorio-etiquetas-customizadas/${currentEvent.value.id}?${params}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `etiquetas_customizadas_${currentEvent.value.sigla || 'evento'}.pdf`;
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
</script>

<style scoped>
.etiqueta-preview {
  width: 120mm;
  height: 30mm;
  border: 1px dashed #999;
  border-radius: 4px;
  padding: 4mm 6mm;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  line-height: 1.3;
}

.preview-linha1 {
  font-weight: bold;
}

.preview-linha2 {
  font-weight: bold;
}

.preview-evento {
  font-size: 8px;
  color: #aaa;
  margin-top: 4px;
  border-top: 0.5px dashed #ccc;
  padding-top: 4px;
}
</style>