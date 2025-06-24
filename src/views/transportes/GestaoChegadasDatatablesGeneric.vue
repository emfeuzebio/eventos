<script setup>
import { computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import 'datatables.net-dt';
import { formatToBrDateTime } from '@/utils/dateFormat';
import { ref } from 'vue';
import { useToast } from '@/composables/useToast';
import api from '@/services/api'; 

// import { h } from 'vue'

const { showToast } = useToast();

import { useEventos } from '@/composables/useEventos';
// const { fetchRotas, fetchViagensDaRota, rotas, salvarViagem, viagensDaRota } = useEventos();
const { fetchRotas, fetchViagensDaRota, rotas, salvarViagem } = useEventos();

// const vnode = h(
//   'div', // type
//   { id: 'foo', class: 'bar' }, // props
//   [
//     /* children */
//   ]
// )

function bindsAds(table){
   table.on('click', '.btnToggleChegadaTraslado', (e) => {
      const inscricaoId = $(e.currentTarget).data('inscricao_id');
      const ativo = e.target.checked ? 'SIM' : 'NÃO';
      console.log(`btnSelecionarViagem > Alterar inscricaoId ${inscricaoId} para ${ativo}`);         
      // if (onClickEdit) onClickEdit(inscricaoId);
      // abrirModal();
   });

   table.on('click', '.btnSelecionarViagem', (e) => {
      const inscricaoId = $(e.currentTarget).data('inscricao_id');
      const viagemId = $(e.currentTarget).data('viagem_id');
      const rotaId = $(e.currentTarget).data('rota_id');
      console.log(`btnToggleChegadaTraslado > InscricaoId ${inscricaoId}; ViagemId ${viagemId}; RotaId ${rotaId}`);         
      if (onClickSelectViagem) onClickSelectViagem(inscricaoId);
   });
}

const mostrarModal = ref(false)

// const viagens = ref([])          // será preenchida dinamicamente
const rotaSelecionada = ref('')  // ID da rota selecionada
const viagemSelecionada = ref('') // ID da viagem selecionada
const viagensDaRota = ref([]);

const fetchViagensPorRota = async (rotaId) => {
  try {
   viagensDaRota.value = []   // limpa anterior
    const res = await api.get(`/viagem`, { params: { rota_id: rotaId } })
    viagensDaRota.value = res.data
  } catch (err) {
    console.error('Erro ao buscar viagens:', err)
  }
}

function abrirModal() {
  fetchRotas();
  mostrarModal.value = true
}

function fecharModal() {
  mostrarModal.value = false
}

function salvarViagemModal() {

   const inscricaoId = 1;
   console.log('Salvar viagem:', inscricaoId, viagemSelecionada.value)

   // api.axios Salvar Viagem
   // const sucesso = salvarViagem(123, { chegou: 'SIM' });
   const sucesso = salvarViagem(inscricaoId, { chegada_traslado: viagemSelecionada.value });

   if (sucesso) {
      mostrarModal.value = false
      showToast({
         title: 'Sucesso',
         message: 'Dados salvos com sucesso!',
         color: 'success',
      });
      return;
   }
   
}



// define a Entidade Principal da View
const entity = 'inscricao';

// recuperas as Autorizações (abilities) do JWT
const { can } = useAbilities();
const { abilities } = useAbilities();

// Permissões específicas para a entidade "veiculo"
const canList = can(`${entity}.index`); // recupera do JWT se a autorização 'veiculo.index'   é verdadeiro
const canShow = can(`${entity}.show`); // recupera do JWT se a autorização 'veiculo.show'   é verdadeiro
const canInsert = can(`${entity}.store`); // recupera do JWT se a autorização 'veiculo.store'   é verdadeiro
const canUpdate = can(`${entity}.update`); // recupera do JWT se a autorização 'veiculo.update'  é verdadeiro
const canDelete = can(`${entity}.destroy`); // recupera do JWT se a autorização 'veiculo.destroy' é verdadeiro

var canPrint = can(`${entity}.print`);
var canPrint = false;

// DEBUG de todas abilities do User Logado
// console.log('Abilities carregadas:', abilities.value);
// console.log('canList:', canList); // Isso deve ser true ou false
// console.log('canShow:', canShow); // Isso deve ser true ou false
// console.log('canInsert:', canInsert); // Isso deve ser true ou false
// console.log('canUpdate:', canUpdate); // Isso deve ser true ou false
// console.log('canDelete:', canDelete); // Isso deve ser true ou false
// console.log('canPrint:', canPrint); // Isso deve ser true ou false

function selecionarViagem(row) {
  alert(`Selecionar Viagem: ${row.nome} (ID: ${row.viagem_id})`)
}



// define parâmetros das tabela de dados
const columns = [
   { title: 'ID', data: 'id', width: '30px'},
   {
      title: 'Evento',
      data: 'evento.sigla',
      render: (data) => `${data} `,
      className: 'text-left',
      width: '90px',
   },
   {
      title: 'Chegada',
      data: null,
      render: function (data, type, row) {
         const meio = row.chegada_meio_transp || 'Meio';
         const cia = row.chegada_cia_transp || 'Cia';
         const dh = row.chegada_data_hora
            ? formatToBrDateTime(`${row.chegada_data_hora}`)
            : 'Data/Hora';
         return `<span class="">${meio} - ${cia}</span> <br/> <small class="text-muted">${dh}</small>`;
      },
      className: 'text-left',
      width: '180px',
   },
   {
      title: 'Pessoa',
      data: null, // importante usar null quando o render vai acessar múltiplos campos
      width: '300px',
      className: 'text-left',
      render: function (data, type, row) {
         const nome = row.pessoa?.nome_social || 'Sem Nome';
         const entidade = row.pessoa.entidade?.sigla || 'Sem Entidade';
         const papel = row.funcao?.descricao || 'Sem Papel';
         const modalidade = row.modalidade || 'Sem Modalidade';
         return `<span class="fw-bold">${nome}</span> <br/> <small class="text-muted">${entidade}</small> <br/> <small class="text-muted">${papel} - ${modalidade}</small>`;
      },
   },
   {
      title: 'Traslado Chegada',
      // data: 'regiao.descricao',
      data: null,
      className: 'text-left',
      render: function (data, type, row) {
         // const nome = row.pessoa?.nome_social || 'Sem Nome';
         // const entidade = row.pessoa.entidade?.sigla || 'Sem Entidade';
         // const papel = row.funcao?.descricao || 'Sem Papel';
         const viagem = 'Sem Viagem definida';
         // const chegada_traslado = row.chegada_traslado;
         const isChecked = row.chegada_traslado === 'SIM' ? 'checked' : '';
         const viagemAcoes = `
            <div class="row" style="padding: 1px 12px">
               <div class="col-sm-2" style="padding: 2px">
                  <button class="btn btn-primary btn-xs btnSelecionarViagem"  data-inscricao_id="${row.id}" data-viagem_id="75" data-rota_id="7"> x </button>
                  <button class="btn btn-warning btn-xs btnZapCopiar"         data-inscricao_id="${row.id}" data-viagem_id="75" data-rota_id="7"> x </button> 
                  <button class="btn btn-info    btn-xs btnViagensZapCopiar"  data-inscricao_id="${row.id}" data-viagem_id="75" data-rota_id="7"> x </button> 
                  <button class="btn btn-danger  btn-xs btnExcluirViagem"     data-inscricao_id="${row.id}" data-viagem_id="75" data-rota_id="7"> x </button>
               </div>
               <div class="col-sm-9" style="padding: 2px">
                  Viagem
               </div>
               <div class="col-sm-1" style="padding: 0px">
                  <div class="form-check form-switch">
                     <input class="form-check-input btnToggleChegadaTraslado" type="checkbox" data-inscricao_id="${row.id}" ${isChecked} >
                  </div>                  
               </div>
            </div>
         `;
         return viagemAcoes;
         // return vnode;

         // return `<span class="fw-bold">Botoes Ação</span> <br/> 
         //         <small class="text-muted">${viagem}</small> <br/> 
         //         <small class="text-muted">Botão Check Chegou</small>
         //        `;
      },
   },
   {
      title: 'Hospedagem',
      data: null,
      class: 'dt-center small',
      width: '100px',
      render: function (data, type, row) {
         return `<span class="">COLMEIA</span>`;
      },
   },
];

// define os valores padrão dos campos do formulário
const defaultValues = {
   regiao_id: null,
   sigla: 'Sigla',
   descricao: 'Descrição',
};

// carrega listas de estidades da API para popular listas: <selects> os filtros
// fetchRegioes();

// filtro da página - usar quando não há filtros
const filters = [{}]; // nessse caso sem filtros

// Filtros da Página com valores fixos - filtro reativo aos dados carregados
// const filters = computed(() => [
//    {
//       label: 'Estado',
//       field: 'estado_id',
//       type: 'select',
//       options: estados.value.map((estado) => ({
//          value: estado.id,
//          label: estado.descricao,
//       })),
//    },
// ]);

</script>

<template>

   <div>
    <button @click="abrirModal" class="btn btn-primary">Abrir Modal</button>
   </div>   

      <!-- Modal Selecionar Viagem de Traslado Chegada -->
      <CModal
         :visible="mostrarModal"
         backdrop="static"
         keyboard="true"
      >
         <CModalHeader>
            <strong>Titulo</strong>
         </CModalHeader>
         <CModalBody>
            <label class="form-label fw-bold">Selecione a Rota</label>
            <CFormSelect
               v-model="rotaSelecionada"
               :options="[
                  { value: '', label: 'Selecione' },
                  ...rotas.map((rota) => ({
                     value: rota.id,
                     label: rota.nome,
                  })),
               ]"
               @change="fetchViagensPorRota(rotaSelecionada)"
            />

            <label class="form-label fw-bold">Selecione a Viagem</label>
            <CFormSelect
               v-model="viagemSelecionada"
               :options="[
                  { value: '', label: 'Selecione' },
                  ...viagensDaRota.map((viagem) => ({
                     value: viagem.id,
                     label: 'Id: ' + viagem.id + ' - ' + formatToBrDateTime(`${viagem.data_hora}`) + ' - ' + viagem.veiculo.descricao,
                  })),
               ]"
            />

         </CModalBody>
         <CModalFooter>
            <CButton @click="fecharModal" class="btn btn-outline-secondary" size="sm">Cancelar</CButton>   
            <CButton @click="salvarViagemModal" class="btn btn-outline-primary" size="sm">Salvar</CButton>
         </CModalFooter>
      </CModal>

   <GenericCrud
      title="Cadastro de Estados "
      description="Gerenciamento do cadastro de Estados da Federação"
      endpoint="inscricao"
      :bindsAds="bindsAds"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :abilities="abilities"
      :canList="canList"
      :canShow="canShow"
      :canInsert="canInsert"
      :canUpdate="canUpdate"
      :canDelete="canDelete"
      :canPrint="canPrint"
   >
      <template #form="{ form, errors }">
         <!-- {{ form.value.estados }} -->
         <!-- {{ estados }} -->

         <label class="form-label fw-bold">Nome do Estado da Federação</label>
         <CFormInput
            v-model="form.value.descricao"
            :class="{ 'is-invalid': errors.descricao }"
         />
         <div class="form-error" v-if="errors.value.descricao">
            {{ errors.value.descricao[0] }}
         </div>

         <label class="form-label fw-bold">Sigla</label>
         <CFormInput
            v-model="form.value.sigla"
            :class="{ 'is-invalid': errors.sigla }"
         />
         <div class="form-error" v-if="errors.value.sigla">
            {{ errors.value.sigla[0] }}
         </div>

         <label class="form-label fw-bold">Região do País</label>
         <CFormSelect
            v-model="form.value.regiao_id"
            :options="[
               { value: '', label: 'Selecione' },
               ...regioes.map((regiao) => ({
                  value: regiao.id,
                  label: regiao.descricao,
               })),
            ]"
         />
         <div class="form-error" v-if="errors.value.regiao_id">
            {{ errors.value.regiao_id[0] }}
         </div>
      </template>

   </GenericCrud>
</template>
