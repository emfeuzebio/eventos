<template>
    <div>
      <button @click="reloadTable" class="btn btn-outline-primary mb-3">
        Recarregar Dados
      </button>
  
      <DataTable
        :columns="columns"
        :options="options"
        class="table table-striped table-bordered"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import DataTable from 'datatables.net-vue3'
  import DataTablesLib from 'datatables.net-bs5'
  import api from '@/services/api';
  
  DataTable.use(DataTablesLib)
  
  const endpoint = 'https://apieventos.fazcomphp.com.br/api/quarto?evento_id=1&hotel_id=1'
  
  // filtros externos (você pode mudar conforme o seu contexto)
  const externalFilters = ref({
    ativo: true, // exemplo
  })
  
  const globalEventoId = ref(1) // substitua pelo valor real do evento
  
  let dtInstance = null // armazenar instância da tabela para usar o reload
  
  const columns = [
    { title: 'ID', data: 'id' },
    { title: 'Número', data: 'numero' },
    { title: 'Capacidade', data: 'capacidade' },
    { title: 'Tipo', data: 'tipo' },
  ]
  
  // ⚙️ Opções do DataTables
  const options = {
    responsive: true,
    processing: true,
    serverSide: false, // Se usar paginação do Laravel, mude para true
    ajax: function (_data, callback, _settings) {
      const filters = {
        ...externalFilters.value,
        evento_id: globalEventoId.value,
      }
  
      api.get(endpoint, { params: filters })
        .then(response => {
          callback({ data: response.data.data || response.data })
        })
        .catch(error => {
          console.error('❌ Erro ao carregar dados:', error)
          callback({ data: [] }) // evitar quebra da tabela
        })
    },
    initComplete: function () {
      dtInstance = this.api() // salva instância para uso em reload()
    },
    language: {
      url: '/assets/DataTables.pt_BR.json', // continua usando tradução geral
    },
  }
  
  // Função para recarregar os dados via botão
  function reloadTable() {
    if (dtInstance) {
      dtInstance.ajax.reload()
    }
  }
  </script>
  
 <style scoped>
 @import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
 </style>