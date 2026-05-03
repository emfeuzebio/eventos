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
            Aqui você encontra as pendências e ações rápidas para operar o
            sistema.
         </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
         <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
         </div>
      </div>

      <div v-else>
         <!-- TAREFAS PENDENTES (com warning) -->
         <div class="card mb-4">
            <div class="card-header bg-white">
               <h5 class="mb-0">
                  <i class="fas fa-tasks me-2 text-warning"></i>
                  Suas Tarefas Pendentes ({{ tarefasPendentes.length }})
               </h5>
            </div>
            <div class="card-body">
               <!-- Apenas se houver pendências mostra warning -->
               <div
                  v-if="tarefasPendentes.length === 0"
                  class="alert alert-info mb-0"
               >
                  <i class="fas fa-check-circle me-2"></i>
                  Nenhuma tarefa pendente no momento. Ótimo trabalho!
               </div>

               <div v-else>
                  <div
                     v-for="tarefa in tarefasPendentes"
                     :key="tarefa.id"
                     class="alert alert-warning d-flex justify-content-between align-items-center mb-2"
                     role="alert"
                  >
                     <div>
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>{{ tarefa.modulo }}:</strong>
                        {{ tarefa.descricao }}
                     </div>
                     <button class="btn btn-sm btn-warning">
                        <i class="fas fa-arrow-right"></i> Resolver
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <!-- ACESSO RÁPIDO (neutro - info) -->
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
                  <button class="btn btn-sm btn-info">Acessar</button>
               </div>
               <div
                  class="alert alert-info d-flex justify-content-between align-items-center mb-2"
               >
                  <span
                     ><i class="fas fa-bed me-2"></i> Gestão de
                     Hospedagens</span
                  >
                  <button class="btn btn-sm btn-info">Acessar</button>
               </div>
               <div
                  class="alert alert-info d-flex justify-content-between align-items-center mb-2"
               >
                  <span
                     ><i class="fas fa-bus me-2"></i> Gestão de Traslados</span
                  >
                  <button class="btn btn-sm btn-info">Acessar</button>
               </div>
               <div
                  class="alert alert-info d-flex justify-content-between align-items-center"
               >
                  <span
                     ><i class="fas fa-utensils me-2"></i> Gestão de
                     Alimentação</span
                  >
                  <button class="btn btn-sm btn-info">Acessar</button>
               </div>
            </div>
         </div>

         <!-- PRÓXIMOS EVENTOS (neutro - light) -->
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
                           {{ evento.data }}
                           <span class="mx-2">|</span>
                           <i class="fas fa-users me-1"></i>
                           {{ evento.inscricoes }} inscrições
                        </small>
                     </div>
                     <button class="btn btn-sm btn-outline-secondary">
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
import { ref, onMounted } from 'vue';

// State
const loading = ref(true);
const tarefasPendentes = ref([]);
const proximosEventos = ref([]);

// Dados mockados (depois substituir pela API)
const carregarDados = async () => {
   loading.value = true;

   // Simula chamada API
   setTimeout(() => {
      // Tarefas pendentes (usa WARNING)
      tarefasPendentes.value = [
         {
            id: 1,
            modulo: 'Inscrições',
            descricao: '12 novas solicitações aguardando aprovação',
         },
         {
            id: 2,
            modulo: 'Hospedagens',
            descricao: '8 reservas não confirmadas',
         },
         {
            id: 3,
            modulo: 'Traslados',
            descricao: '3 viagens sem motorista atribuído',
         },
      ];

      // Próximos eventos (usa LIGHT - neutro)
      proximosEventos.value = [
         {
            id: 1,
            nome: 'Tech Conference 2025',
            data: '10/05/2025',
            inscricoes: 145,
         },
         {
            id: 2,
            nome: 'Fórum de Vendas',
            data: '15/05/2025',
            inscricoes: 89,
         },
         {
            id: 3,
            nome: 'Encontro de Líderes',
            data: '22/05/2025',
            inscricoes: 234,
         },
      ];

      loading.value = false;
   }, 500);
};

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
</style>
