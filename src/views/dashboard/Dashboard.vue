<template>
   <div>
      <CCol :xs="12">
         <CRow class="form-group mx-auto">
            <label class="form-label fw-bold">Categoria</label>
            <CCol sm="3">

               <SearchSelect v-model="selectedItem" :options="listaDeOpcoes" placeholder="Selecione a cidade" />
               <br />

               <CoreUIMultiselect
                  v-model="selectedValue"
                  :options="[
                     { value: '', label: 'Open this select menu' },
                     { value: '1', label: 'One' },
                     { value: '2', label: 'Two' },
                     { value: '3', label: 'Three' },
                     { value: '4', label: 'Four' },
                     { value: '5', label: 'Five' },
                  ]"
                  placeholder="Selecione..."
               />
               <br />

               <CFormSelect
                  :options="[
                     { value: '', label: 'Open this select menu' },
                     { value: '1', label: 'One' },
                     { value: '2', label: 'Two' },
                     { value: '3', label: 'Three' },
                     { value: '4', label: 'Four' },
                     { value: '5', label: 'Five' },
                  ]"
               />
            </CCol>
         </CRow>

         <br />
         <br />
         <br />

         <!-- <DocsComponents href="components/table.html" /> -->
         <CCard class="mb-4">
            <CCardHeader>
               <span class="smaler">Meu texto</span><br />
               <strong>Vue Table</strong> <small>Basic example xx</small> meu
               texto

               <button><i class="fa fa-chevron-left"></i> Anterior</button>
               <button><i class="fa fa-chevron-right"></i> Próximo</button>

               <i class="fa fa-university"></i>
               <i class="fa fa-save"></i>
               <i class="fa fa-trash"></i>
               <i class="fa fa-edit"></i>
               <i class="fa fa-refresh"></i>
               <i class="fa fa-ban"></i>
               <i class="fa fa-times"></i>
            </CCardHeader>
            <CCardBody>
               <!-- <p class="text-body-secondary small">
            Using the most basic table CoreUI, here&#39;s how
            <code>&lt;CTable&gt;</code>-based tables look in CoreUI.
          </p> -->
               <!-- <DocsExample href="components/table.html"> -->
               <CTable>
                  <CTableHead>
                     <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                     </CTableRow>
                  </CTableHead>
                  <CTableBody>
                     <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Mark</CTableDataCell>
                        <CTableDataCell>Otto</CTableDataCell>
                        <CTableDataCell>@mdo</CTableDataCell>
                     </CTableRow>
                     <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Jacob</CTableDataCell>
                        <CTableDataCell>Thornton</CTableDataCell>
                        <CTableDataCell>@fat</CTableDataCell>
                     </CTableRow>
                     <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell colspan="2"
                           >Larry the Bird</CTableDataCell
                        >
                        <CTableDataCell>@twitter</CTableDataCell>
                     </CTableRow>
                  </CTableBody>
               </CTable>
               <!-- </DocsExample> -->
            </CCardBody>
         </CCard>
      </CCol>
   </div>
</template>

<script setup>
import avatar1 from '@/assets/images/avatars/1.jpg';
import avatar2 from '@/assets/images/avatars/2.jpg';
import avatar3 from '@/assets/images/avatars/3.jpg';
import avatar4 from '@/assets/images/avatars/4.jpg';
import avatar5 from '@/assets/images/avatars/5.jpg';
import avatar6 from '@/assets/images/avatars/6.jpg';
import MainChart from './MainChart.vue';
import WidgetsStatsA from './../widgets/WidgetsStatsTypeA.vue';
import WidgetsStatsD from './../widgets/WidgetsStatsTypeD.vue';

import { getToken, removeToken, getIssuer } from '@/services/authService';
// console.log('getIssuer', getIssuer())

import { ref } from 'vue';
import Multiselect from '@vueform/multiselect';

import SearchSelect from '@/components/SearchSelect.vue'

const selectedItem = ref(null)
const listaDeOpcoes = [
  { label: 'São Paulo', value: 1 },
  { label: 'Rio de Janeiro', value: 2 },
  { label: 'Belo Horizonte', value: 3 },
  { label: 'Brasília', value: 4 },
  { label: 'Salvador', value: 5 },
  { label: 'Fortaleza', value: 6 },
  { label: 'Curitiba', value: 7 },
  { label: 'Manaus', value: 8 },
  { label: 'Recife', value: 9 },
  { label: 'Porto Alegre', value: 10 },
  { label: 'Belém', value: 11 },
]




const progressGroupExample1 = [
   { title: 'Monday', value1: 34, value2: 78 },
   { title: 'Tuesday', value1: 56, value2: 94 },
   { title: 'Wednesday', value1: 12, value2: 67 },
   { title: 'Thursday', value1: 43, value2: 91 },
   { title: 'Friday', value1: 22, value2: 73 },
   { title: 'Saturday', value1: 53, value2: 82 },
   { title: 'Sunday', value1: 9, value2: 69 },
];
const progressGroupExample2 = [
   { title: 'Male', icon: 'cil-user', value: 53 },
   { title: 'Female', icon: 'cil-user-female', value: 43 },
];
const progressGroupExample3 = [
   {
      title: 'Organic Search',
      icon: 'cib-google',
      percent: 56,
      value: '191,235',
   },
   { title: 'Facebook', icon: 'cib-facebook', percent: 15, value: '51,223' },
   { title: 'Twitter', icon: 'cib-twitter', percent: 11, value: '37,564' },
   { title: 'LinkedIn', icon: 'cib-linkedin', percent: 8, value: '27,319' },
];
const tableExample = [
   {
      avatar: { src: avatar1, status: 'success' },
      user: {
         name: 'Yiorgos Avraamu',
         new: true,
         registered: 'Jan 1, 2023',
      },
      country: { name: 'USA', flag: 'cif-us' },
      usage: {
         value: 50,
         period: 'Jun 11, 2023 - Jul 10, 2023',
         color: 'success',
      },
      payment: { name: 'Mastercard', icon: 'cib-cc-mastercard' },
      activity: '10 sec ago',
   },
   {
      avatar: { src: avatar2, status: 'danger' },
      user: {
         name: 'Avram Tarasios',
         new: false,
         registered: 'Jan 1, 2023',
      },
      country: { name: 'Brazil', flag: 'cif-br' },
      usage: {
         value: 22,
         period: 'Jun 11, 2023 - Jul 10, 2023',
         color: 'info',
      },
      payment: { name: 'Visa', icon: 'cib-cc-visa' },
      activity: '5 minutes ago',
   },
   {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: 'cif-in' },
      usage: {
         value: 74,
         period: 'Jun 11, 2023 - Jul 10, 2023',
         color: 'warning',
      },
      payment: { name: 'Stripe', icon: 'cib-cc-stripe' },
      activity: '1 hour ago',
   },
   {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: 'cif-fr' },
      usage: {
         value: 98,
         period: 'Jun 11, 2023 - Jul 10, 2023',
         color: 'danger',
      },
      payment: { name: 'PayPal', icon: 'cib-cc-paypal' },
      activity: 'Last month',
   },
   {
      avatar: { src: avatar5, status: 'success' },
      user: {
         name: 'Agapetus Tadeáš',
         new: true,
         registered: 'Jan 1, 2023',
      },
      country: { name: 'Spain', flag: 'cif-es' },
      usage: {
         value: 22,
         period: 'Jun 11, 2023 - Jul 10, 2023',
         color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: 'cib-cc-apple-pay' },
      activity: 'Last week',
   },
   {
      avatar: { src: avatar6, status: 'danger' },
      user: {
         name: 'Friderik Dávid',
         new: true,
         registered: 'Jan 1, 2023',
      },
      country: { name: 'Poland', flag: 'cif-pl' },
      usage: {
         value: 43,
         period: 'Jun 11, 2023 - Jul 10, 2023',
         color: 'success',
      },
      payment: { name: 'Amex', icon: 'cib-cc-amex' },
      activity: 'Last week',
   },
];

const selectedValue = ref(null);
</script>
