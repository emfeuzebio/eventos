<template>
   <div>
     <DataTable
       :columns="columns"
       :data="quartos"
       class="table table-striped table-bordered"
       :options="options"
     />
   </div>
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue'
 import DataTable from 'datatables.net-vue3'
 import DataTablesLib from 'datatables.net-bs5'
 import api from '@/services/api';
 
 // registra DataTables com Bootstrap 5
 DataTable.use(DataTablesLib)
 
 const quartos = ref([])
 
 // Colunas do DataTable
 const columns = [
   { title: 'ID', data: 'id' },
   { title: 'Número', data: 'numero' },
   { title: 'Capacidade', data: 'capacidade' },
 ]
 
 // Opções do DataTable
 const options = {
   responsive: true,
   paging: true,
   pageLength: 10,
   dataSrc: '',
 }
 
 // Busca dados da API
 onMounted(async () => {
   try {
     const { data } = await api.get('https://apieventos.fazcomphp.com.br/api/quarto?evento_id=1&hotel_id=1')
     quartos.value = data 
   } catch (err) {
     console.error('Erro ao carregar quartos:', err)
   }
 })
 </script>
 
 <style scoped>
 @import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
 </style>
 