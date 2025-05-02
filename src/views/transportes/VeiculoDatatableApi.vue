<template>

  <!-- DataTables - Lista de Dados -->
  <CCol :xs="12">
    <!-- <DocsComponents href="components/table.html" /> -->
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Lista de Veículos</strong> <small> - permite administrar os veículos</small>
      </CCardHeader>
      <CCardBody>
        <!-- <p class="text-body-secondary small">
          Using the most basic table CoreUI, here&#39;s how
          <code>&lt;CTable&gt;</code>-based tables look in CoreUI.
        </p> -->
        <!-- <DocsExample href="components/table.html"></DocsExample> -->

        <div class="row mb-3">            

          <div class="col-8 text-start">
            <div v-if="alertMessage" class="alert alert-dismissible fade show py-1 px-3 mb-0"
              role="alert" :class="`alert-${alertType}`">{{ alertMessage }}
              <button type="button" class="btn btn-sm btn-close py-2" @click="alertMessage = ''" aria-label="Fechar"></button>
            </div>          
          </div>

          <div class="col-4 text-end">
            <button v-if="canInsert" class="btn btn-sm btn-outline-success me-1" @click="insertNewModal">Inserir Novo</button>
            <button class="btn btn-sm btn-outline-info me-1" @click="print">Imprimir</button>
            <button class="btn btn-sm btn-outline-secondary" title="Recarregar" @click="refreshTable"><CIcon icon="cil-task"/> Recarregar</button>            
          </div>

        </div>
        <div class="table-responsive col-md-12">
          <table id="dataTable" class="display table table-striped table-bordered table-hover table-sm compact" style="width:100%"></table>
        </div>

      </CCardBody>
    </CCard>
  </CCol>    

  <!-- Modal de Edição -->
  <CModal :visible="modalVisible" @close="closeModal" backdrop="static" v-close-on-esc="closeModal" >
  <CModalHeader>
    <CModalTitle>{{ isEditing ? (canUpdate ? 'Editar' : 'Ver') + ' Veículo' : 'Novo Veículo' }}</CModalTitle>
  </CModalHeader>
  <CModalBody>

    <CForm>
      <CFormInput v-model="form.descricao" label="Descrição" class="form-control" :class="{ 'is-invalid': fieldErrors.descricao }"/>
      <div class="form-error" v-if="fieldErrors.descricao">{{ fieldErrors.descricao }}</div>

      <CFormSelect v-model="form.tipo" :options="tipoOptions" label="Tipo"/>
      <div class="form-error" v-if="fieldErrors.tipo">{{ fieldErrors.tipo }}</div>

      <CFormInput v-model="form.marca_modelo" label="Marca/Modelo" />
      <div class="form-error" v-if="fieldErrors.marca_modelo">{{ fieldErrors.marca_modelo }}</div>

      <CFormInput v-model="form.capacidade" label="Capacidade" />
      <div class="form-error" v-if="fieldErrors.capacidade">{{ fieldErrors.capacidade }}</div>

      <CFormInput v-model="form.motorista" label="Motorista" />
      <div class="form-error" v-if="fieldErrors.motorista">{{ fieldErrors.motorista }}</div>

      <CFormInput v-model="form.telefone" label="Telefone" />
      <div class="form-error" v-if="fieldErrors.telefone">{{ fieldErrors.telefone }}</div>

      <CFormSelect v-model="form.ativo" :options="[{ value: 'Y', label: 'SIM' }, { value: 'N', label: 'NÃO' }]" label="Ativo" />
    </CForm>

  </CModalBody>
  <CModalFooter>

    <div class="d-flex w-100 align-items-center justify-content-end">
      <div class="text-danger small mt-2 me-auto" v-if="formError">{{ formError }}</div>
      <div>
        <CButton class="btn btn-secondary btn-sm me-1" @click="closeModal">Cancelar </CButton> 
        <CButton v-if="canUpdate" class="btn btn-primary btn-sm" @click="confirmSave()">{{ isEditing ? 'Salvar' : 'Criar' }}</CButton>
      </div>
    </div>    

  </CModalFooter>
  </CModal>

  <!-- Modal de Confirmação -->
  <CModal :visible="deleteConfirmVisible" @close="cancelDelete" backdrop="static" keyboard="true">
    <CModalHeader>
      <CModalTitle>Confirmar Exclusão</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <p>Tem certeza que deseja excluir este Registro: <br/><strong>{{ selectedToDelete?.descricao }}</strong> ?</p>
    </CModalBody>
    <CModalFooter>
      <CButton class="btn btn-secondary btn-sm me-1" @click="cancelDelete">Cancelar</CButton>
      <CButton class="btn btn-danger btn-sm" @click="confirmDelete">Excluir</CButton>
    </CModalFooter>
  </CModal>  

</template>

<script>

import $ from 'jquery';
import 'datatables.net-dt';
import api from '@/services/api'
import { useUserStore } from '@/stores/userStore'
import { can, canAny, canAll } from '@/services/AuthorizationsService'


export default {
  name: 'DataTableComponent',
  data() {
    return {
      // Flags de controle das autorizações do CRUD básico
      canList:    true,
      canShow:    false,
      canInsert:  false,
      canUpdate:  false,
      canDelete:  false,

      // Flags de controle das autorizações além do CRUD básico, como por exemplo, imprimir, calcular, exportar, etc
      canPrint:   false,      // usar no botão de impressão v-if="canPrint" para controlar a exibição
      canExport:  false,      
      canCalc:    false,

      // Demais Flags de controle 
      responseErrors: [401, 403, 404, 405, 422, 500],
      dataTable: null,
      alertMessage: '',             // usado para mostrar alertas
      alertType: '',                // usado para mostrar alertas
      deleteConfirmVisible: false,
      selectedToDelete: null,      
      modalVisible: false,
      formError: '',                // erros no rodapé do Form
      fieldErrors: {},              // erros erros por campo
      isEditing: false,             // Flag é uma Edição
      modalVisible: false,
      tipoOptions: [
        { value: '', label: 'Selecione o tipo' },
        { value: 'Automóvel', label: 'Automóvel' },
        { value: 'Van', label: 'Van' },
        { value: 'Micrônibus', label: 'Micrônibus' },
        { value: 'Ônibus', label: 'Ônibus' },
      ],      
    };
  },
  mounted() {
    const userStore = useUserStore() 

    // FUNCIONA - SERVICE - Atualiza as flags recuperando as abilities do token que estão NO AuthorizationsService que controla estado com Pinia
    this.canList   = can('veiculo.index')
    this.canShow   = can('veiculo.show')
    this.canInsert = can('veiculo.store')
    this.canUpdate = can('veiculo.update')    
    this.canDelete = can('veiculo.destroy') 

    // Outras opções - canAny, canAll
    // this.canInsert = canAny('veiculo.store', 'veiculo.update')            // se o usuário tiver qualquer uma das permissões (canAny)
    // this.canInsert = canAll('veiculo.store', 'veiculo.update', 'veiculo.destroy') // se o usuário tiver todas as permissões (canAll)

    // FUNCIONA - Atualiza as flags recuperando as abilities do token que estão com pinia no UserStore
    // this.canInsert = userStore.can('veiculo.store')
    // this.canUpdate = userStore.can('veiculo.update')    // ou veiculo.edit, como for o seu caso
    // this.canDelete = userStore.can('veiculo.destroy') 

    // console.log('canInsert', this.canInsert);
    // console.log('canUpdate', this.canUpdate);
    // console.log('Token atual:', userStore.token)
    // console.log('abilities:', userStore.abilities.join(', '))
    // console.log('roles:', userStore.roles.join(', '))

    // Acrescentar AQUI demais flags para outras ações nesta página, como por exemplo, imprimir, calcular, exportar, etc

    // Inicializa o DataTables só uma vez
    this.initDataTable();

    // Eventos dos Botões
    $('#dataTable').on('click', '.btnShow', (e) => {
      const id = $(e.currentTarget).data('id');
      this.editModal(id); // busca o registro via API
      this.isEditing = false;
    });    

    $('#dataTable').on('click', '.btnEdit', (e) => {
      const id = $(e.currentTarget).data('id');
      this.editModal(id); // busca o registro via API
      this.isEditing = true;
    });    

    $('#dataTable').on('click', '.btnDelete', (e) => {
      const id = $(e.currentTarget).data('id');
      const rowData = this.dataTable.row(`#${id}`).data();
      this.deleteConfirm(rowData);
    });    
  },
  methods: {
    initDataTable() {

        const vm = this; // <- captura o this      
        this.dataTable = $('#dataTable').DataTable({

        // dataTablesParams - pode ser usado para paginação e ordenação no servidor, pode usar esses params direto na sua chamada

        // Aqui usamos o Axios (com JWT já incluso no api instance)      
        ajax: function (dataTablesParams, callback) {

          api.get('veiculo')
            .then(response => {
              callback({ data: response.data });  // Entrega os dados ao DataTables
            })
            .catch(error => {
              vm.showAlert('danger', 'Erro ao carregar os dados. Tente novamente: ' + (error.response?.data?.error || error.message));
              callback({ data: [] }); // evita que a tabela quebre
            }
          );
        },  
        lengthMenu: [[5, 10, 15, 30, 50, -1], [5, 10, 15, 30, 50, "Todos"]],     
        language: { url: "/assets/DataTables.pt_BR.json" },
        processing: true,
        responsive: true,
        rowId: 'id',
        // dataSrc: '',
        dataSrc: function (response) {
          return response.data;
        },
        columns: [
          { title: 'ID', data: 'id', class: 'text-secondary small' },
          { title: 'Descrição', data: 'descricao', class: 'small' },
          { title: 'Tipo', data: 'tipo', class: 'small' },
          { title: 'Marca/Modelo', data: 'marca_modelo', class: 'small' },
          { title: 'Cpc', data: 'capacidade', class: 'small' },
          { title: 'Motorista', data: 'motorista', class: 'small' },
          { title: 'Fone', data: 'telefone', width: '120px', class: 'small' },
          { title: 'Ativo', data: 'ativo', class: 'dt-center small',
            render: function (data, type, row) {
              return `<span class="${row.ativo === 'Y' ? 'text-primary' : 'text-danger'}">${row.ativo === 'Y' ? 'SIM' : 'NÃO'}</span>`;
            },
          },
          { title: 'Ações', data: null, width: '120px', class: 'dt-center', className: 'text-center',
            render: function (data, type, row) {

              // console.log('canInsert', vm.canInsert);
              // console.log('canUpdate', vm.canUpdate); 
              // console.log('canDelete', vm.canDelete);

              // can('veiculo.store') funciona aqui direto mas fará uma chamada a cada linha, que não é o caso, basta ao carregar a página
              // const btnEdit    = can('veiculo.store') ? `<button class="btnEdit btn btn-xs btn-outline-primary me-1"  data-id="${row.id}">Editar</button>` : '';

              const btnShow    = !vm.canUpdate && vm.canShow ? `<button class="btnShow btn btn-xs btn-outline-primary me-1"  data-id="${row.id}">Ver</button>` : '';
              const btnEdit    = vm.canUpdate ? `<button class="btnEdit btn btn-xs btn-outline-primary me-1"  data-id="${row.id}">Editar</button>` : '';
              const btnDestroy = vm.canDelete ? `<button class="btnDelete btn btn-xs btn-outline-danger me-1" data-id="${row.id}">Excluir</button>` : '';
              
              return btnEdit + btnShow + btnDestroy;
            },
          },
        ],
      });
    },
  
    refreshTable() {
      if (this.dataTable) {
        this.dataTable.ajax.reload(null, false); // mantém a página atual
      }
    },

    // TODO - criar um botão de impressão
    // Modelo de metodo para novas operações
    // no Backend, ACL$, criar uma rota para imprimir e o metodo na classe Controller, depois a autorização na Role
    async print() {
      const id = 99;
      // api.get(`veiculo/modelo/1`)
      // api.get(`veiculo/${id}`)
      api.get(`viagem`)
        .then(() => {
          this.showAlert('success', 'Operação executada com sucesso!')
        })
        .catch(error => {
          this.showAlert('danger', 'Erro na Operação: ' + (error.response?.data?.message || error.message));
        });
    },      

    async editModal(id) {
      try {
        const response = await api.get(`veiculo/${id}`);
        this.form = response.data;
        this.modalModo = this.isEditing ? 'edit' : 'show';
        this.modalVisible = true;
        this.cleanMessages();
      } catch (error) {
        this.showAlert('danger', 'Erro ao excluir o registro: ' + (error.response?.data?.message || error.message));
      }
    },    

    closeModal() {
      this.modalVisible = false;
      this.form = {};
    },    

    deleteConfirm(rowData) {
        this.selectedToDelete = rowData;
        this.deleteConfirmVisible = true;
    },

    cancelDelete() {
      this.selectedToDelete = null;
      this.deleteConfirmVisible = false;
    },

    async confirmDelete() {
      const id = this.selectedToDelete.id;
      await api.delete(`veiculo/${id}`)
        .then(() => {
          this.deleteConfirmVisible = false;
          this.showAlert('success', 'Registro excluído com sucesso!')
          this.refreshTable();
        })
        .catch(error => {
          this.showAlert('danger', 'Erro ao excluir o registro: ' + (error.response?.data?.message || error.message));
          this.deleteConfirmVisible = false;
        });
    },  

    async confirmSave() {
      const id = this.form.id
      this.formError = ''
      this.fieldErrors = {}

      // caso o modo seja Show, não faz nada, pois as operações Update ou Insert não estão disponíveis
      if (this.modalModo === 'show') return

      try {
        // TODO v-if="canUpdate" no botao e abaixo edit v-if="canInsert"
        if (this.modalModo === 'edit') {
          await api.put(`veiculo/${this.form.id}`, this.form)           // atualiza o registro
        } else {
          await api.post('veiculo', this.form)                          // insere um novo registro
        }

        this.modalVisible = false
        this.showAlert('success', 'Registro ' + ( this.modalModo === 'edit' ? 'atualizado' : 'Inserido' ) + '  com sucesso!')
        this.refreshTable()
      } catch (error) {

        const status = error.response?.status;

        if (this.responseErrors.includes(status)) {
          // Validação da API (ex: Laravel retorna 422 com { errors: { campo: ['msg'] } })
          const errors = error.response.data.errors
          this.fieldErrors = {};

          for (const campo in errors) {
            this.fieldErrors[campo] = errors[campo][0]
          }
          this.formError = ( error.response.data.error ? error.response.data.error + ' ' : '') + error.response.data.message || 'Corrija os campos destacados.';
        }
      }      
    },

    insertNewModal() {
      this.cleanMessages();
      this.isEditing = false
      this.form = {
        id: null,
        descricao: '',
        tipo: '',
        marca_modelo: '',
        capacidade: '',
        motorista: '',
        telefone: '',
        ativo: 'Y',
      }
      this.modalVisible = true
    },    

    showAlert(type, message) {
      this.alertType = type     // 'success', 'danger', 'warning', etc
      this.alertMessage = message
      setTimeout(() => {
        this.alertMessage = ''
      }, 10000)                     // Auto-esconde depois de 10 segundos
    },  

    cleanMessages() {
      this.formError = '';      // limpa erros no rodapé do Form
      this.fieldErrors = {};    // limpa erros por campo
      this.alertMessage = '';   // limpa mensagens da página     
    },
  }
};
</script>

<style>

  @import 'datatables.net-dt/css/dataTables.dataTables.min.css';

  .btn-xs { 
    padding: 0.15rem 0.4rem;
    font-size: 0.75rem;
    line-height: 1;
    border-radius: 0.2rem;
  }

  .form-error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

</style>