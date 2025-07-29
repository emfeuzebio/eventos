<template>
    <div>
      <button @click="reloadTable" class="btn btn-xs btn-outline-primary mb-3">
        Recarregar Dados
      </button>
  
      <DataTable
        :columns="columns"
        :options="options"
        class="display table table-striped table-bordered table-hover table-sm compact w-100"
      />
    </div>
</template>
  
<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import DataTable from 'datatables.net-vue3' 
  import DataTablesLib from 'datatables.net-bs5'
  import { useCurrentEventStore } from '@/stores/currentEvent'
  import api from '@/services/api';
  
  DataTable.use(DataTablesLib)
  
  const endpoint = 'quarto'

  const eventStore = useCurrentEventStore()
  const globalEventoId = computed(() => eventStore.currentEvent?.id || '');
  // console.log('Evento ID:', globalEventoId.value);
  
  // filtros externos (você pode mudar conforme o seu contexto)
  const externalFilters = ref({
    hotel_id: '1', // exemplo
    ativo: 'SIM', // exemplo
  })
  
  let dtInstance = null // armazenar instância da tabela para usar o reload
  
  const columns = [
    { title: 'ID', data: 'id', width: '30px' },
    { title: 'Número', data: 'numero', class: 'text-center fw-bold', className: 'text-center', width: '100px' },
    { title: 'Número no Hotel', data: 'numero_hotel', class: 'text-center', className: 'text-center', width: '160px' },
    { title: 'Tipo', data: 'tipo', width: '120px' },
    { title: 'Q Tipo', data: 'quarto_tipo.nome', width: 'auto' },
    { title: 'Capacidade', data: 'capacidade', width: '100px' },
    { title: 'Custeado	', data: 'custeado', class: 'text-center', width: '100px' },
    {
      title: 'Ativo',
      data: null,
      className: 'text-center', // título coluna
      class: 'text-center small',
      width: '80px',
      render: function (data, type, row) {
         return `<span class="${
            row.disponivel === 'SIM' ? 'text-primary' : 'text-danger'
         }">${row.disponivel}</span>`;
      },
    },
    {
      title: 'Ação',
      data: null,
      className: 'text-center', // título coluna
      class: 'text-center',     // dado da coluna
      width: '80px',
      // Com arrow function
      render: (data, type, row) => `<button class="btn btn-xs btn-outline-primary btn-edit" data-hotel_id="${row.hotel_id}">Editar ${row.hotel_id}</button>`

      // ANTIGO
      // render: function (data, type, row) {
      //   return `<button class="btn-edit btn btn-sm btn-outline-primary" data-evento_id="${globalEventoId.value}" data-hotel_id="${row.hotel_id}">Editar ${row.hotel_id}</button>`;
      // },
   },
  ]
  
  // Opções do DataTables
  const options = {
    responsive: true,
    serverSide: false,  // Se usar paginação do Laravel, mude para true
    processing: false,  // para ativer o "Carregando..." do DataTables
    order: [],
    rowId: 'id',
    dataSrc: '',        // se a resposta for um array simples, use ''
    lengthMenu: [
      [5, 10, 25, 50, 100, -1],
      [5, 10, 25, 50, 100, 'Todos'],
    ],
    pageLength: 5,
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
          console.error('Erro ao carregar dados:', error)
          if (error.response?.status === 401) {
            // Enviar para a página de login se não estiver autenticado
            router.push('/pages/login')     
          }
          callback({ data: [] }) // evitar quebra da tabela
        })
    },
    initComplete: function () {
      dtInstance = this.api() // salva instância para uso em reload()

      // Delegar evento click para os botões .btn-edit
      this.api().table().container().addEventListener('click', (e) => {

          const tr = e.target.closest('tr')           // Descobre a linha onde clicou
          const rowData = dtInstance.row(tr).data()   // pega os dados dessa linha
          const rowId = tr?.id                        // pega o ID da linha (se definido)

          // Pega os atributos data-* do botão clicado
          const eventoId = e.target.getAttribute('data-evento_id')
          const hotelId = e.target.getAttribute('data-hotel_id')
          const numero = e.target.getAttribute('data-numero')

          if (e.target && e.target.classList.contains('btn-edit')) {

            console.log('Editar Linha:', { rowId, eventoId, hotelId, numero, rowData });

            // envia objeto para a função editar
            editar({ rowId: rowId, eventoId: eventoId, hotelId: hotelId })
            // envia dados + objeto rowData para a função editar
            // editar(rowId, eventoId, hotelId, rowData)
            // envia apenas o objeto rowData a função editar
            // editar(rowData)
          }

          if (e.target && e.target.classList.contains('btn-delete')) {
            excluir(rowId, rowData)
          }

          if (e.target && e.target.classList.contains('btn-show')) {
            ver(rowId, rowData)
          }
        })      
    },
    language: {
      url: '/assets/DataTables.pt_BR.json', // continua usando tradução geral
    },
  }

  // Função para ver detalhes
  const editar = (linha) => {
    console.log('Editar Linha');
    alert('Editar Linha:', linha.id);
    // quartoSelecionado.value = { ...quarto };
    // quatosFormErros.value = {}; // limpa erros antigos
    // editarQuartoModal.value = true;
  };   
  
  // Função para recarregar os dados via botão
  function reloadTable() {
    if (dtInstance) {
      dtInstance.ajax.reload()
    }
  }

   // este faz com que a qualquer tempo, se o <select> do Evento for mudado, um reload seja disparado
    watch(globalEventoId, () => {
      reloadTable()
   });

</script>
  
<style>
 @import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

 .btn-xs {
   padding: 0.2rem 0.3rem;
   font-size: 0.85rem;
   line-height: 1;
   border-radius: 0.2rem;
}

.form-error {
   color: #dc3545;
   font-size: 0.875rem;
   margin-top: 0.25rem;
   font-weight: bold !important;
}

.dataTable tbody td {
   /* font-size: 14px; */
   font-size: medium;
   /* font-size: small; */
   /* font-size: smaller; */
}

/* Fonte dos botões Primeiro/Anterior/... */
.d-none.d-sm-inline {
   font-size: 13px;
}
</style>
