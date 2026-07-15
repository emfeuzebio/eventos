<template>
   <div>
      <!-- Título -->
      <h1 class="mb-4">Operacional</h1>

      <!-- Explicação da página (neutro) -->
      <div
         class="alert alert-secondary d-flex align-items-center mb-4"
         role="alert"
      >
         <i class="fas fa-info-circle me-2"></i>
         <div>
            <strong>Sua central de tarefas:</strong>
            Aqui você encontra as pendências e ações rápidas para operar o sistema.
         </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
         <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
         </div>
      </div>

      <div v-else>

         <!-- RESUMO DO EVENTO (cards) -->
         <div v-if="currentEvent?.id && resumo" class="row mb-4">
            <div class="col-md-2 col-sm-4 col-6 mb-2">
               <CWidgetStatsA
                  class="h-100"
                  color="primary"
                  title="Inscrições Ativas"
                  :value="resumo.total || '0'"
                  :style="{ padding: '0.5rem' }"
               />
            </div>
            <div class="col-md-2 col-sm-4 col-6 mb-2">
               <CWidgetStatsA
                  class="h-100"
                  color="success"
                  title="Presenciais"
                  :value="resumo.presencial || '0'"
                  :style="{ padding: '0.5rem' }"
               />
            </div>
            <div class="col-md-2 col-sm-4 col-6 mb-2">
               <CWidgetStatsA
                  class="h-100"
                  color="info"
                  title="Virtuais"
                  :value="resumo.virtual || '0'"
                  :style="{ padding: '0.5rem' }"
               />
            </div>
            <div class="col-md-2 col-sm-4 col-6 mb-2">
               <CWidgetStatsA
                  class="h-100"
                  color="warning"
                  title="Credenciados"
                  :value="resumo.credenciados || '0'"
                  :style="{ padding: '0.5rem' }"
               />
            </div>
            <div class="col-md-2 col-sm-4 col-6 mb-2">
               <CWidgetStatsA
                  class="h-100"
                  color="danger"
                  title="Hospedagem FEB"
                  :value="resumo.hospedagem_feb || '0'"
                  :style="{ padding: '0.5rem' }"
               />
            </div>
            <div class="col-md-2 col-sm-4 col-6 mb-2">
               <CWidgetStatsA
                  class="h-100"
                  color="secondary"
                  title="Check-in"
                  :value="resumo.checkin_realizado || '0'"
                  :style="{ padding: '0.5rem' }"
               />
            </div>
         </div>

         <!-- TAREFAS PENDENTES (agrupadas por categoria) -->
         <div class="card mb-4">
            <div class="card-header bg-white">
               <h5 class="mb-0">
                  <i class="fas fa-tasks me-2 text-warning"></i>
                  Suas Tarefas Pendentes
               </h5>
            </div>
            <div class="card-body">

               <div v-if="!currentEvent?.id" class="alert alert-warning mb-4">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>Selecione um evento</strong> para visualizar suas tarefas pendentes.
               </div>
               <div v-else>

                  <!-- Se não houver tarefas -->
                  <div
                     v-if="tarefasPendentes.length === 0"
                     class="alert alert-info mb-0"
                  >
                     <i class="fas fa-check-circle me-2"></i>
                     Nenhuma tarefa pendente no momento. Ótimo trabalho!
                  </div>

                  <!-- Agrupar por categoria -->
                  <div v-else>
                     <div
                        v-for="categoria in tarefasPendentes"
                        :key="categoria.categoria"
                        class="mb-3"
                     >
                        <h6 class="fw-bold text-secondary">
                           <i class="fas fa-folder-open me-2"></i>
                           {{ categoria.categoria }}
                        </h6>

                        <div
                           v-for="item in categoria.itens"
                           :key="item.id"
                           class="alert alert-warning d-flex justify-content-between align-items-center mb-2"
                           role="alert"
                        >
                           <div>
                              <i class="fas fa-exclamation-triangle me-2"></i>
                              <strong>{{ item.modulo }}:</strong>
                              {{ item.descricao }}
                              <span class="badge bg-danger ms-2">{{ item.quantidade }}</span>
                           </div>
                           <button
                              class="btn btn-sm btn-warning"
                              @click="navegarPara(item.rota)"
                           >
                              <i class="fas fa-arrow-right"></i> {{ item.acao }}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- ACESSO RÁPIDO -->
         <div class="card mb-4">
            <div class="card-header bg-white">
               <h5 class="mb-0">
                  <i class="fas fa-bolt me-2 text-info"></i>
                  Acesso Rápido
               </h5>
            </div>
            <div class="card-body">
               <div
                  class="alert alert-info d-flex justify-content-between align-items-center mb-2"
               >
                  <span
                     ><i class="fas fa-clipboard-list me-2"></i> Gestão de
                     Inscrições</span
                  >
                  <button class="btn btn-sm btn-info" @click="navegarPara('/inscricoes/inscricoes')">
                     Acessar
                  </button>
               </div>
               <div
                  class="alert alert-info d-flex justify-content-between align-items-center mb-2"
               >
                  <span
                     ><i class="fas fa-bed me-2"></i> Gestão de Hospedagens</span
                  >
                  <button class="btn btn-sm btn-info" @click="navegarPara('/hospedagem/ghospedagem')">
                     Acessar
                  </button>
               </div>
               <div
                  class="alert alert-info d-flex justify-content-between align-items-center mb-2"
               >
                  <span
                     ><i class="fas fa-bus me-2"></i> Gestão de Traslados</span
                  >
                  <button class="btn btn-sm btn-info" @click="navegarPara('/transportes/chegadas')">
                     Chegadas
                  </button>
                  <button class="btn btn-sm btn-info" @click="navegarPara('/transportes/partidas')">
                     Partidas
                  </button>
               </div>
               <div
                  class="alert alert-info d-flex justify-content-between align-items-center"
               >
                  <span
                     ><i class="fas fa-utensils me-2"></i> Gestão de Alimentação</span
                  >
                  <button class="btn btn-sm btn-info" @click="navegarPara('/relatorios/alimentacao')">
                     Acessar
                  </button>
               </div>
            </div>
         </div>

         <!-- PRÓXIMOS EVENTOS -->
         <div class="card">
            <div class="card-header bg-white">
               <h5 class="mb-0">
                  <i class="fas fa-calendar-alt me-2 text-secondary"></i>
                  Próximos Eventos
               </h5>
            </div>
            <div class="card-body">
               <div
                  v-if="proximosEventos.length === 0"
                  class="alert alert-secondary mb-0"
               >
                  <i class="fas fa-info-circle me-2"></i>
                  Nenhum evento próximo cadastrado.
               </div>
               <div v-else>
                  <div
                     v-for="evento in proximosEventos"
                     :key="evento.id"
                     class="alert alert-light d-flex justify-content-between align-items-center mb-2 border"
                  >
                     <div>
                        <strong>{{ evento.nome }}</strong>
                        <small class="text-muted d-block">
                           <i class="fas fa-calendar me-1"></i>
                           {{ evento.periodo_datas }}
                           <span class="mx-2">|</span>
                           <i class="fas fa-users me-1"></i>
                           {{ evento.inscricoes }} inscrições
                        </small>
                     </div>
                     <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="verDetalhesEvento(evento.id)"
                     >
                        Ver detalhes
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from '@/composables/useToast';
import { useCurrentEventStore } from '@/stores/currentEvent';

const router = useRouter();
const { showToast } = useToast();

// ==============================================
// EVENTO ATUAL (do Pinia)
// ==============================================

const currentEventStore = useCurrentEventStore();
const currentEvent = computed(() => currentEventStore.currentEvent);

// ==============================================
// STATE
// ==============================================

const loading = ref(true);
const tarefasPendentes = ref([]);
const proximosEventos = ref([]);
const resumo = ref(null);
const error = ref(null);

// ==============================================
// CARREGAR DADOS DA API
// ==============================================

const carregarDados = async () => {
   const eventoId = currentEvent.value?.id;

   // Se não houver evento selecionado, limpa os dados e para
   if (!eventoId) {
      // proximosEventos.value = [];
      tarefasPendentes.value = [];
      loading.value = false;
      return;
   }

   loading.value = true;
   error.value = null;

   try {
      const response = await api.get('/dashboard/operacional', {
         params: { evento_id: eventoId }
      });

      proximosEventos.value = response.data.proximos_eventos || [];
      resumo.value = response.data.resumo || null;

      const tarefasRaw = response.data.tarefas_pendentes || {};
      tarefasPendentes.value = Object.keys(tarefasRaw).map((categoria) => ({
         categoria: categoria,
         itens: tarefasRaw[categoria] || [],
      }));

      tarefasPendentes.value = tarefasPendentes.value.filter(
         (cat) => cat.itens.length > 0
      );

   } catch (err) {
      console.error('❌ Erro ao carregar dashboard:', err);
      error.value = 'Não foi possível carregar os dados do dashboard.';
      showToast({
         title: 'Erro',
         message: 'Erro ao carregar dados do dashboard.',
         variant: 'danger',
      });
   } finally {
      loading.value = false;
   }
};

// ==============================================
// 🔄 OBSERVAR MUDANÇA DO EVENTO SELECIONADO
// ==============================================

watch(
   () => currentEvent.value?.id,
   (novoId, antigoId) => {
      // console.log(`🔄 Evento mudou: ${antigoId} → ${novoId}`);
      carregarDados();
   },
   { immediate: false } // Não carrega automaticamente na montagem (já tem onMounted)
);

// ==============================================
// NAVEGAÇÃO
// ==============================================

const navegarPara = (rota) => {
   router.push(rota);
};

const verDetalhesEvento = (eventoId) => {
   router.push(`/inscricoes/eventos/${eventoId}`);
};

// ==============================================
// FORMATADORES
// ==============================================

const formatarPeriodo = (periodoDatas) => {
   if (!periodoDatas) return 'Data não informada';
   return periodoDatas;
};

// ==============================================
// CICLO DE VIDA
// ==============================================

onMounted(() => {
   carregarDados();
});
</script>
<style scoped>
.card-header {
   border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.alert {
   cursor: pointer;
   transition: all 0.2s ease;
}

.alert:hover {
   transform: translateX(5px);
}

.alert-warning:hover {
   background-color: #fff3cd;
   border-color: #ffecb5;
}

.alert-info:hover {
   background-color: #cff4fc;
}

.alert-light:hover {
   background-color: #f8f9fa;
}

/* Garantir altura uniforme nos cards */
:deep(.card) {
   height: 100%;
   min-height: 80px;
}

/* Reduzir padding interno dos cards */
:deep(.card-body) {
   padding: 0.5rem 0.75rem !important;
}

/* Ajustar título e valor */
:deep(.card-title) {
   font-size: 0.7rem;
   margin-bottom: 0.15rem;
}

:deep(.card-value) {
   font-size: 1.3rem;
   font-weight: bold;
}
</style>