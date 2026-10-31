<template>
   <GenericCrud
      ref="crudRef"
      modalSize="small"
      title="Administração de Usuários"
      description="Gerenciamento dos usuários do sistema"
      endpoint="admin/users"
      columnActionsWidth="420px"
      :pageButtons="{ btnInsertNew: true, btnRefreshTable: true }"
      :pageExtraButtons="[]"
      :filters="filters"
      :columns="columns"
      :defaultValues="defaultValues"
      :buttons="{ update: false, delete: false, show: false }"
      :extra-column-render="extraColumnRender"
      :abilities="abilities"
      :api-instance="apiAcl"
      :include-evento-id="false"
      @extraAction="onExtraAction"
      @afterSave="onSaved"
   >
      <template #form="{ form, errors }">
         <CFormLabel class="form-label fw-bold">Nome</CFormLabel>
         <CFormInput
            v-model="form.value.name"
            :class="{ 'is-invalid': errors.value.name }"
         />
         <div class="form-error" v-if="errors.value.name">{{ errors.value.name[0] }}</div>

         <CFormLabel class="form-label fw-bold mt-2">E-mail</CFormLabel>
         <CFormInput
            v-model="form.value.email"
            type="email"
            :class="{ 'is-invalid': errors.value.email }"
         />
         <div class="form-error" v-if="errors.value.email">{{ errors.value.email[0] }}</div>

         <CFormLabel class="form-label fw-bold mt-2">Telefone</CFormLabel>
         <CFormInput
            v-model="form.value.phone"
            :class="{ 'is-invalid': errors.value.phone }"
         />
         <div class="form-error" v-if="errors.value.phone">{{ errors.value.phone[0] }}</div>
      </template>
   </GenericCrud>

   <!-- Modal Perfis -->
   <CModal :visible="profilesModal" @close="profilesModal = false" backdrop="static" size="lg">
      <CModalHeader><strong>Perfis de Acesso — {{ selectedUser?.name }}</strong></CModalHeader>
      <CModalBody>
         <div v-if="profilesLoading">Carregando…</div>
         <table v-else class="table table-sm table-striped">
            <thead>
               <tr><th>#</th><th>Perfil</th><th>Sigla</th><th class="text-center">Concedido</th></tr>
            </thead>
            <tbody>
               <tr v-for="(p, i) in profilesList" :key="p.id">
                  <td>{{ i + 1 }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.acronym }}</td>
                  <td class="text-center">
                     <input
                        type="checkbox"
                        :checked="p.granted"
                        :disabled="profilesSaving"
                        @change="toggleProfile(p)"
                     />
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
   <CModal :visible="authModal" @close="authModal = false" backdrop="static" size="xl">
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
   <CModal :visible="historyModal" @close="historyModal = false" backdrop="static" size="xl">
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
                  <td><code>{{ JSON.stringify(h.payload_before) }}</code></td>
                  <td><code>{{ JSON.stringify(h.payload_after) }}</code></td>
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
import { ref, computed, onMounted } from 'vue';
import GenericCrud from '@/components/GenericCrud.vue';
import apiAcl from '@/services/apiAcl';
import userAdminService from '@/services/userAdminService';
import { useAbilities, getAbilities } from '@/services/AuthorizationsService';
import { useToast } from '@/composables/useToast';
import { useGlobalError } from '@/composables/useGlobalError';

const crudRef = ref(null);
const { showToast } = useToast();
const { showError } = useGlobalError();
const abilities = getAbilities();

const defaultValues = {
   name: '',
   email: '',
   phone: null,
};

const columns = [
   { title: 'ID', data: 'id', width: '50px' },
   { title: 'Nome', data: 'name', width: '350px', class: 'fw-bold' },
   { title: 'E-mail', data: 'email', width: '150px' },
   {
      title: 'Status',
      data: 'status',
      width: '80px',
      className: 'text-center',
      render: (data) => {
         const map = { invited: 'secondary', pending: 'warning', active: 'success', suspended: 'danger' };
         const lbl = { invited: 'Convidado', pending: 'Pendente', active: 'Ativo', suspended: 'Suspenso' };
         return `<span class="badge bg-${map[data] || 'secondary'}">${lbl[data] || data}</span>`;
      },
   },
   {
      title: 'Ativo',
      data: 'active',
      width: '60px',
      className: 'text-center',
      render: (data) => `<span class="${data === 'Y' ? 'text-primary' : 'text-danger'}">${data === 'Y' ? 'SIM' : 'NÃO'}</span>`,
   },
   {
      title: 'Perfis',
      data: null,
      width: 'auto',
      render: (data, type, row) => {
         if (!row.profiles || row.profiles.length === 0) return '<span class="text-muted">—</span>';
         return row.profiles.map(p => `<span class="badge bg-info me-1">${p.acronym}</span>`).join('');
      },
   },
];

const filters = [
   {
      label: 'Status',
      field: 'status',
      type: 'select',
      options: [
         { value: 'invited', label: 'Convidado' },
         { value: 'pending', label: 'Pendente' },
         { value: 'active', label: 'Ativo' },
         { value: 'suspended', label: 'Suspenso' },
      ],
   },
   {
      label: 'Ativo',
      field: 'active',
      type: 'select',
      options: [
         { value: 'Y', label: 'SIM' },
         { value: 'N', label: 'NÃO' },
      ],
   },
];

const can = (ability) => abilities.includes(ability);

const extraColumnRender = (row) => {
   let html = '';

   // Ativar / Suspender
   if (row.active === 'Y' && can('user.update')) {
      html += `<button class="btn btn-xs btn-outline-warning me-1" data-custom-action="suspend" data-id="${row.id}" title="Suspender"><i class="fa fa-ban"></i> Suspender</button>`;
   } else if (row.active === 'N' && can('user.update')) {
      html += `<button class="btn btn-xs btn-outline-success me-1" data-custom-action="activate" data-id="${row.id}" title="Ativar"><i class="fa fa-check"></i> Ativar</button>`;
   }

   // Perfis
   if (can('profile.index')) {
      html += `<button class="btn btn-xs btn-outline-info me-1" data-custom-action="profiles" data-id="${row.id}" title="Perfis"><i class="fa fa-shield-alt"></i> Perfis</button>`;
   }

   // Dropdown "Mais"
   const items = [];
   if (can('user.update'))    items.push(`<li><a class="dropdown-item" href="#" data-custom-action="edit" data-id="${row.id}">Editar</a></li>`);
   if (can('user.store'))     items.push(`<li><a class="dropdown-item" href="#" data-custom-action="resend" data-id="${row.id}">Reenviar convite</a></li>`);
   if (can('user.update'))    items.push(`<li><a class="dropdown-item" href="#" data-custom-action="force-reset" data-id="${row.id}">Forçar reset de senha</a></li>`);
   if (can('user.listActiveAuth')) items.push(`<li><a class="dropdown-item" href="#" data-custom-action="authorizations" data-id="${row.id}">Autorizações</a></li>`);
   if (can('user.show'))      items.push(`<li><a class="dropdown-item" href="#" data-custom-action="history" data-id="${row.id}">Histórico</a></li>`);
   if (can('user.destroy'))   items.push(`<li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-danger" href="#" data-custom-action="destroy" data-id="${row.id}">Excluir</a></li>`);

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
      if (action === 'activate') {
         await userAdminService.activate(userId);
         showToast({ title: 'Sucesso', message: 'Usuário ativado.' });
         crudRef.value?.refreshTable();
      }
      if (action === 'suspend') {
         if (!confirm(`Suspender o usuário ${row.name}?`)) return;
         await userAdminService.suspend(userId);
         showToast({ title: 'Sucesso', message: 'Usuário suspenso.' });
         crudRef.value?.refreshTable();
      }
      if (action === 'resend') {
         await userAdminService.resendInvite(userId);
         showToast({ title: 'Sucesso', message: 'Convite reenviado.' });
      }
      if (action === 'force-reset') {
         await userAdminService.forceReset(userId);
         showToast({ title: 'Sucesso', message: 'E-mail de redefinição enviado.' });
      }
      if (action === 'destroy') {
         if (!confirm(`Excluir o usuário ${row.name}?`)) return;
         await userAdminService.destroy(userId);
         showToast({ title: 'Sucesso', message: 'Usuário excluído.' });
         crudRef.value?.refreshTable();
      }
      if (action === 'edit') {
         crudRef.value?.form?.load(userId);
      }
      if (action === 'profiles') {
         selectedUser.value = row;
         await loadProfiles(userId);
      }
      if (action === 'authorizations') {
         selectedUser.value = row;
         await loadAuthorizations(userId);
      }
      if (action === 'history') {
         selectedUser.value = row;
         await loadHistory(userId);
      }
   } catch (e) {
      if (e.response?.status === 409) {
         showError(`<b>Conflito</b><br/>${e.response.data.error}<br/>Dependências: ${(e.response.data.dependencies || []).join(', ')}`);
      } else if (e.response?.status === 422) {
         showError(`<b>Estado inválido</b><br/>${e.response.data.error}`);
      } else {
         showError(`<b>Erro</b><br/>${e.response?.data?.message || e.message}`);
      }
   }
};

const onSaved = () => {
   crudRef.value?.refreshTable();
};

// ===== Modais =====
const selectedUser = ref(null);

// Perfis
const profilesModal = ref(false);
const profilesLoading = ref(false);
const profilesSaving = ref(false);
const profilesList = ref([]);

async function loadProfiles(id) {
   profilesLoading.value = true;
   profilesModal.value = true;
   try {
      const { data } = await userAdminService.listProfiles(id);
      profilesList.value = data;
   } catch (e) {
      showError('Erro ao carregar perfis.');
      profilesModal.value = false;
   } finally {
      profilesLoading.value = false;
   }
}

async function toggleProfile(p) {
   profilesSaving.value = true;
   const id = selectedUser.value.id;
   try {
      if (p.granted) {
         await userAdminService.revokeProfile(id, p.id);
      } else {
         await userAdminService.grantProfile(id, p.id);
      }
      p.granted = !p.granted;
      crudRef.value?.refreshTable();   // ← ADICIONAR
   } catch (e) {
      if (e.response?.status === 403) showError('O perfil administrador não pode ser alterado por aqui.');
      else showError('Erro ao alterar perfil.');
   } finally {
      profilesSaving.value = false;
   }
}

// Autorizações
const authModal = ref(false);
const authLoading = ref(false);
const authList = ref([]);

async function loadAuthorizations(id) {
   authLoading.value = true;
   authModal.value = true;
   try {
      const { data } = await userAdminService.authorizations(id);
      authList.value = data;
   } catch (e) {
      showError('Erro ao carregar autorizações.');
      authModal.value = false;
   } finally {
      authLoading.value = false;
   }
}

// Histórico
const historyModal = ref(false);
const historyLoading = ref(false);
const historyList = ref([]);

async function loadHistory(id) {
   historyLoading.value = true;
   historyModal.value = true;
   try {
      const { data } = await userAdminService.history(id);
      historyList.value = data.data || [];
   } catch (e) {
      showError('Erro ao carregar histórico.');
      historyModal.value = false;
   } finally {
      historyLoading.value = false;
   }
}

function formatDateTime(dt) {
   if (!dt) return '-';
   return new Date(dt).toLocaleString('pt-BR');
}
</script>