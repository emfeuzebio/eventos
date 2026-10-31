<template>
   <GenericCrud
      ref="crudRef"
      modalSize="small"
      title="Administração de Usuários"
      description="Gerenciamento dos usuários do sistema"
      endpoint="admin/users"
      columnActionsWidth="420px"
      :pageButtons="{ btnInsertNew: false, btnRefreshTable: true }"
      :pageExtraButtons="pageExtraButtons"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="{ update: false, delete: false, show: false }"
      :extra-column-render="extraColumnRender"
      :abilities="abilities"
      :api-instance="apiAcl"
      :include-evento-id="false"
      @extraAction="onExtraAction"
      @pageExtraButtonsActions="onPageExtraAction"
      @afterSave="onSaved"
   >
      <template #form="{ form, errors }">
         <CFormLabel class="form-label fw-bold">Nome</CFormLabel>
         <CFormInput v-model="form.value.name" :class="{ 'is-invalid': errors.value.name }" />
         <div class="form-error" v-if="errors.value.name">{{ errors.value.name[0] }}</div>

         <CFormLabel class="form-label fw-bold mt-2">E-mail</CFormLabel>
         <CFormInput v-model="form.value.email" type="email" :class="{ 'is-invalid': errors.value.email }" />
         <div class="form-error" v-if="errors.value.email">{{ errors.value.email[0] }}</div>

         <CFormLabel class="form-label fw-bold mt-2">Telefone</CFormLabel>
         <CFormInput v-model="form.value.phone" :class="{ 'is-invalid': errors.value.phone }" @input="maskPhone($event, form)" />
         <div class="form-error" v-if="errors.value.phone">{{ errors.value.phone[0] }}</div>
      </template>
   </GenericCrud>

   <!-- Modal Perfis -->
   <CModal :visible="profilesModal" @close="profilesModal = false" backdrop="static" size="md">
      <CModalHeader><strong>Perfis de Acesso — {{ selectedUser?.name }}</strong></CModalHeader>
      <CModalBody>
         <div v-if="profilesLoading">Carregando…</div>
         <table v-else class="table table-sm table-striped">
            <thead>
               <tr><th>#</th><th>Perfil</th><th class="text-center">Concedido</th></tr>
            </thead>
            <tbody>
               <tr v-for="(p, i) in profilesList" :key="p.id">
                  <td>{{ i + 1 }}</td>
                  <td>{{ p.name }}</td>
                  <td class="text-center">
                     <input type="checkbox" :checked="p.granted" :disabled="profilesSaving" @change="toggleProfile(p)" />
                  </td>
               </tr>
            </tbody>
         </table>
      </CModalBody>
      <CModalFooter>
         <CButton color="secondary" size="sm" @click="profilesModal = false">Fechar</CButton>
      </CModalFooter>
   </CModal>

   <!-- Modal Autorizações -->
   <CModal :visible="authModal" @close="authModal = false" backdrop="static" size="lg">
      <CModalHeader><strong>Autorizações — {{ selectedUser?.name }}</strong></CModalHeader>
      <CModalBody>
         <div v-if="authLoading">Carregando…</div>
         <table v-else class="table table-sm table-striped">
            <thead>
               <tr><th>#</th><th>Entidade</th><th>Ação</th><th>Rota</th><th>Perfil</th></tr>
            </thead>
            <tbody>
               <tr v-for="(a, i) in authList" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ a.entity }}</td>
                  <td>{{ a.action }}</td>
                  <td>{{ a.route }}</td>
                  <td>{{ a.profile }}</td>
               </tr>
            </tbody>
         </table>
      </CModalBody>
      <CModalFooter>
         <CButton color="secondary" size="sm" @click="authModal = false">Fechar</CButton>
      </CModalFooter>
   </CModal>

   <!-- Modal Histórico -->
   <CModal :visible="historyModal" @close="historyModal = false" backdrop="static" size="lg">
      <CModalHeader><strong>Histórico — {{ selectedUser?.name }}</strong></CModalHeader>
      <CModalBody>
         <div v-if="historyLoading">Carregando…</div>
         <table v-else class="table table-sm table-striped">
            <thead>
               <tr><th>Data</th><th>Ação</th><th>Ator</th><th>Antes</th><th>Depois</th></tr>
            </thead>
            <tbody>
               <tr v-for="h in historyList" :key="h.id">
                  <td>{{ formatDateTime(h.created_at) }}</td>
                  <td>{{ h.action }}</td>
                  <td>{{ h.actor?.name || '-' }}</td>
                  <td style="white-space: normal; word-break: break-word; max-width: 250px;">
                    <code class="small">{{ JSON.stringify(h.payload_before) }}</code>
                  </td>
                  <td style="white-space: normal; word-break: break-word; max-width: 250px;">
                    <code class="small">{{ JSON.stringify(h.payload_after) }}</code>
                  </td>                  
               </tr>
            </tbody>
         </table>
      </CModalBody>
      <CModalFooter>
         <CButton color="secondary" size="sm" @click="historyModal = false">Fechar</CButton>
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import apiAcl from '@/services/apiAcl';
import userAdminService from '@/services/userAdminService';
import { getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import { useGlobalError } from '@/composables/useGlobalError';
import 'datatables.net-bs5'; // registra o plugin JS do DataTables para Bootstrap 5

const crudRef = ref(null);
const { showToast } = useToast();
const { showError } = useGlobalError();
const abilities = getAbilities();

const can = (ability) => abilities.includes(ability);
const refresh = () => crudRef.value?.refreshTable();

// ===== Form =====
const defaultValues = { name: '', email: '', phone: null };

function maskPhone(e, form) {
   let v = e.target.value.replace(/\D/g, '');
   if (!v) { e.target.value = ''; form.value.phone = null; return; }
   v = v.substring(0, 11);
   v = v.length > 10
      ? v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
      : v.length > 6
         ? v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
         : v.length > 2
            ? v.replace(/^(\d{2})(\d{0,5})/, '($1) $2')
            : v.replace(/^(\d{1,2})/, '($1');
   e.target.value = v;
   form.value.phone = v;
}

const onSaved = () => refresh();

// ===== Page extra buttons =====
const pageExtraButtons = computed(() =>
   can('user.store')
      ? [{ label: '<i class="fa fa-plus"></i> Inserir Novo', action: 'insertNew', class: 'btn btn-sm btn-outline-success me-1' }]
      : []
);

const onPageExtraAction = ({ action }) => {
   if (action === 'insertNew') crudRef.value?.form?.insertNewModal();
};

// ===== Columns / Filters =====
const STATUS_MAP = { invited: 'secondary', pending: 'warning', active: 'success', suspended: 'danger' };
const STATUS_LBL = { invited: 'Convidado', pending: 'Pendente', active: 'Ativo', suspended: 'Suspenso' };

const columns = [
   { title: 'ID', data: 'id', width: '50px' },
   { title: 'Nome', data: 'name', width: '300px', class: 'fw-bold' },
   { title: 'E-mail', data: 'email', width: '120px' },
   {
      title: 'Status', data: 'status', width: '80px', className: 'text-center',
      render: (d) => `<span class="badge bg-${STATUS_MAP[d] || 'secondary'}">${STATUS_LBL[d] || d}</span>`,
   },
   {
      title: 'Ativo', data: 'active', width: '60px', className: 'text-center',
      render: (d) => `<span class="${d === 'Y' ? 'text-primary' : 'text-danger'}">${d === 'Y' ? 'SIM' : 'NÃO'}</span>`,
   },
   {
      title: 'Perfis', data: null, width: 'auto',
      render: (_, __, row) => row.profiles?.length
         ? row.profiles.map(p => `<span class="badge bg-info me-1">${p.acronym}</span>`).join('')
         : '<span class="text-muted">—</span>',
   },
];

const filters = [
   { label: 'Status', field: 'status', type: 'select', options: Object.entries(STATUS_LBL).map(([value, label]) => ({ value, label })) },
   { label: 'Ativo', field: 'active', type: 'select', options: [{ value: 'Y', label: 'SIM' }, { value: 'N', label: 'NÃO' }] },
];

// ===== Extra column / actions =====
const extraColumnRender = (row) => {
   let html = '';

   if (can('user.update')) {
      html += row.active === 'Y'
         ? `<button class="btn btn-xs btn-outline-warning me-1" data-custom-action="suspend" data-id="${row.id}" title="Suspender"><i class="fa fa-ban"></i> Suspender</button>`
         : `<button class="btn btn-xs btn-outline-success me-1" data-custom-action="activate" data-id="${row.id}" title="Ativar"><i class="fa fa-check"></i> Ativar</button>`;
   }

   if (can('profile.index')) {
      html += `<button class="btn btn-xs btn-outline-info me-1" data-custom-action="profiles" data-id="${row.id}" title="Perfis"><i class="fa fa-shield-alt"></i> Perfis</button>`;
   }

   const items = [];
   if (can('user.update')) items.push(`<li><a class="dropdown-item" href="#" data-custom-action="edit" data-id="${row.id}">Editar</a></li>`);
   if (can('user.store')) items.push(`<li><a class="dropdown-item" href="#" data-custom-action="resend" data-id="${row.id}">Reenviar convite</a></li>`);
   if (can('user.update')) items.push(`<li><a class="dropdown-item" href="#" data-custom-action="force-reset" data-id="${row.id}">Forçar reset de senha</a></li>`);
   if (can('user.listActiveAuth')) items.push(`<li><a class="dropdown-item" href="#" data-custom-action="authorizations" data-id="${row.id}">Autorizações</a></li>`);
   if (can('user.show')) items.push(`<li><a class="dropdown-item" href="#" data-custom-action="history" data-id="${row.id}">Histórico</a></li>`);
   if (can('user.destroy')) items.push(`<li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-danger" href="#" data-custom-action="destroy" data-id="${row.id}">Excluir</a></li>`);

   if (items.length) {
      html += `<div class="dropdown d-inline-block">
         <button class="btn btn-xs btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Mais</button>
         <ul class="dropdown-menu">${items.join('')}</ul>
      </div>`;
   }

   return html;
};

const onExtraAction = async ({ id, action, row }) => {
   const userId = Number(id || row?.id);
   try {
      switch (action) {
         case 'activate':   await userAdminService.activate(userId);   showToast({ message: 'Usuário ativado.' });   refresh(); break;
         case 'suspend':    if (!confirm(`Suspender ${row.name}?`)) return;
                            await userAdminService.suspend(userId);    showToast({ message: 'Usuário suspenso.' });  refresh(); break;
         case 'resend':     await userAdminService.resendInvite(userId); showToast({ message: 'Convite reenviado.' }); break;
         case 'force-reset':await userAdminService.forceReset(userId); showToast({ message: 'E-mail de redefinição enviado.' }); break;
         case 'destroy':    if (!confirm(`Excluir ${row.name}?`)) return;
                            await userAdminService.destroy(userId);    showToast({ message: 'Usuário excluído.' });  refresh(); break;
         case 'edit':       crudRef.value?.form?.load(userId); break;
         case 'profiles':   selectedUser.value = row; await loadProfiles(userId); break;
         case 'authorizations': selectedUser.value = row; await loadAuthorizations(userId); break;
         case 'history':    selectedUser.value = row; await loadHistory(userId); break;
      }
   } catch (e) {
      const msg = e.response?.status === 409
         ? `<b>Conflito</b><br/>${e.response.data.error}<br/>Dependências: ${(e.response.data.dependencies || []).join(', ')}`
         : e.response?.status === 422
            ? `<b>Estado inválido</b><br/>${e.response.data.error}`
            : `<b>Erro</b><br/>${e.response?.data?.message || e.message}`;
      showError(msg);
   }
};

// ===== Modais =====
const selectedUser = ref(null);

const profilesModal = ref(false);
const profilesLoading = ref(false);
const profilesSaving = ref(false);
const profilesList = ref([]);

const authModal = ref(false);
const authLoading = ref(false);
const authList = ref([]);

const historyModal = ref(false);
const historyLoading = ref(false);
const historyList = ref([]);

async function loadProfiles(id) {
   profilesModal.value = true; profilesLoading.value = true;
   try { profilesList.value = (await userAdminService.listProfiles(id)).data; }
   catch { showError('Erro ao carregar perfis.'); profilesModal.value = false; }
   finally { profilesLoading.value = false; }
}

async function toggleProfile(p) {
   profilesSaving.value = true;
   const id = selectedUser.value.id;
   try {
      p.granted ? await userAdminService.revokeProfile(id, p.id) : await userAdminService.grantProfile(id, p.id);
      p.granted = !p.granted;
      refresh();
   } catch (e) {
      showError(e.response?.status === 403 ? 'O perfil administrador não pode ser alterado por aqui.' : 'Erro ao alterar perfil.');
   } finally {
      profilesSaving.value = false;
   }
}

async function loadAuthorizations(id) {
   authModal.value = true; authLoading.value = true;
   try { authList.value = (await userAdminService.authorizations(id)).data; }
   catch { showError('Erro ao carregar autorizações.'); authModal.value = false; }
   finally { authLoading.value = false; }
}

async function loadHistory(id) {
   historyModal.value = true; historyLoading.value = true;
   try { historyList.value = (await userAdminService.history(id)).data.data || []; }
   catch { showError('Erro ao carregar histórico.'); historyModal.value = false; }
   finally { historyLoading.value = false; }
}

const formatDateTime = (dt) => dt ? new Date(dt).toLocaleString('pt-BR') : '-';
</script>