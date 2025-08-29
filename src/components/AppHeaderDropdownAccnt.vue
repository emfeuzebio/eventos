<template>
   <CDropdown placement="bottom-end" variant="nav-item">
      <CDropdownToggle class="py-0 pe-0" :caret="false">
         <CAvatar :src="avatar" size="md" />
      </CDropdownToggle>
      <CDropdownMenu class="pt-0">
         <!-- 
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> Updates
        <CBadge color="info" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Messages
        <CBadge color="success" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-task" /> Tasks
        <CBadge color="danger" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-comment-square" /> Comments
        <CBadge color="warning" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->

         <CDropdownHeader
            component="h6"
            class="bg-body-secondary text-body-secondary fw-semibold my-2"
         >
            Conta do Usuário
         </CDropdownHeader>

         <CDropdownItem>
            <CIcon icon="cil-user" /> <strong>{{ userName }}</strong>
         </CDropdownItem>

         <CDropdownItem @click="abrirEditarConta">
            <CIcon icon="cil-pencil" /> Editar Conta
         </CDropdownItem>

         <CDropdownItem>
            <CIcon icon="cil-user" /> Perfis de Acesso
            <div>
               <div class="small text-muted">
                  <div v-if="userStore.roles.length">
                     {{ userStore.roles.join(', ') }}
                  </div>
               </div>
            </div>
         </CDropdownItem>
         <CDropdownDivider />

         <CDropdownItem disabled>
            <CIcon icon="cil-settings" /> Preferências
         </CDropdownItem>
         <!-- <CDropdownItem>
        <CIcon icon="cil-dollar" /> Payments
        <CBadge color="secondary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
         <!-- <CDropdownItem>
        <CIcon icon="cil-file" /> Projects
        <CBadge color="primary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
         <CDropdownDivider />
         <!-- <CDropdownItem> <CIcon icon="cil-shield-alt" /> Lock Account </CDropdownItem> -->
         <CDropdownItem @click="logout">
            <CIcon icon="cil-lock-locked" /> Sair
         </CDropdownItem>
      </CDropdownMenu>
   </CDropdown>

   <!-- Editar Conta do Usuário -->
   <CModal
      :visible="editarContaModal"
      @close="fecharEditarConta"
      size="md"
      backdrop="static"
   >
      <CModalHeader class="bg-primary text-white fw-bold">
         Editar Conta do Usuário
      </CModalHeader>

      <CModalBody>
         <!-- Nome -->
         <div class="mb-3">
            <label class="form-label fw-bold">Nome</label>
            <CFormInput
               v-model="form.nome"
               :class="{ 'is-invalid': !!userFormErros.nome }"
            />
            <div class="form-error" v-if="userFormErros.nome">
               {{ userFormErros.nome[0] }}
            </div>
            <div class="form-text">
               Informe o Nome do Usuário com no mínimo 6 caracteres.
            </div>
         </div>

         <!-- Email (somente leitura) -->
         <div class="mb-3">
            <label class="form-label fw-bold">Email</label>
            <CFormInput
               type="email"
               v-model="form.email"
               :class="{ 'is-invalid': !!userFormErros.email }"
            />
            <div class="form-error" v-if="userFormErros.email">
               {{ userFormErros.email[0] }}
            </div>
            <div class="form-text">
               Este é seu e-mail de login e não pode ser alterado aqui.
            </div>
         </div>

         <div class="mb-3">
            <label class="form-label fw-bold">Telefone</label>
            <CFormInput
               type="phone"
               v-model="form.phone"
               :class="{ 'is-invalid': !!userFormErros.phone }"
            />
            <div class="form-error" v-if="userFormErros.phone">
               {{ userFormErros.phone[0] }}
            </div>
            <div class="form-text">
               Informe o Telefone do Usuário no formato (XX) XXXXX-XXXX.
            </div>
         </div>

         <!-- Foto (upload) -->
         <div class="mb-3">
            <label class="form-label fw-bold">Foto de Perfil</label>
            <input
               type="file"
               accept="image/*"
               class="form-control"
               @change="onSelecionarFoto"
            />
            <div class="form-text">Selecione uma imagem para o seu perfil.</div>

            <div class="mt-3">
               <strong>Prévia:</strong><br />
               <CAvatar
                  class="img-preview mt-2"
                  :src="previewFoto || defaultPhoto"
                  size="lg"
               />
            </div>
         </div>

         <!-- Perfis de Acesso -->
         <div class="mb-3">
            <label class="form-label fw-bold">Perfis de Acesso</label>
            <div>
               <CBadge
                  v-for="(role, index) in userStore.roles"
                  :key="index"
                  color="info"
                  class="me-1"
               >
                  {{ role }}
               </CBadge>
            </div>
            <div class="form-text">
               Acima estão listados seus Perfil(is) de Acesso. <br />
               Sendo necessário alterar, solicite ao Administrador.
            </div>
         </div>
      </CModalBody>

      <CModalFooter>
         <CButton color="secondary" size="sm" @click="fecharEditarConta">
            Cancelar
         </CButton>
         <CButton color="primary" size="sm" @click="salvarConta">
            Salvar
         </CButton>
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToast } from '@/composables/useToast';
import { useGlobalError } from '@/composables/useGlobalError';
import axios from 'axios';
import {
   getToken,
   getUserNameFromToken,
   logout as doLogout,
} from '@/services/authService';

import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();

const { showError } = useGlobalError(); // Modal de Erros
const { showToast } = useToast(); // Toasts de Alerta

const itemsCount = 42;
const router = useRouter();
// const userName = ref(getUserNameFromToken());

const userName = computed(() => userStore.name);

watchEffect(() => {
   const token = getToken();
   userName.value = token ? getUserNameFromToken() : '';
});

// Computed para avatar (com fallback para null)
const avatar = computed(() => {
   return userStore.photo
      ? urlFotos.value + userStore.photo
      : urlFotos.value + 'storage/users/avatar.jpg';
});

const urlFotos = ref('https://acl4.fazcomphp.com.br/');
const previewFoto = ref(userStore.photo || null);

// Modal visibilidade
const editarContaModal = ref(false);
const userFormErros = ref({});
const abrirEditarConta = () => {
   form.value = {
      nome: userStore.name,
      email: userStore.email,
      phone: userStore.phone,
      photo: null,
   };
   previewFoto.value = urlFotos.value + userStore.photo || null;
   editarContaModal.value = true;
};

const fecharEditarConta = () => {
   editarContaModal.value = false;
};

// Formulário reativo
const form = ref({
   nome: '',
   email: '',
   photo: '',
});

const erros = ref({});

const defaultPhoto = urlFotos.value + 'avatar.jpg';

// Salvar dados
const salvarConta = async () => {
   erros.value = {};

   if (!form.value.nome) {
      erros.value.nome = 'Nome é obrigatório.';
   }

   if (Object.keys(erros.value).length > 0) {
      return;
   }

   try {
      // const { data } = await api.post('/me', payload); // ou .put dependendo da API
      // await api.post('/me', payload); // ou .put dependendo da API

      const token = getToken();

      // Salva a photo via axios diretamente (axios suporta multipart/form-data nativamente)
      const { data } = await axios.post(
         'https://acl4.fazcomphp.com.br/api/user/update',
         { name: form.value.nome, email: form.value.email },
         {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
            },
         }
      );

      // console.log('Data:', data);

      // Atualiza a foto se necessário
      await salvarNovaFoto();

      // Atualiza o store com os dados da resposta
      userStore.$patch({
         name: data.name,
         email: data.email,
         phone: data.phone,
      });

      showToast({
         title: 'Sucesso',
         message: `Conta do Usuário atualizada com sucesso.`,
      });

      fecharEditarConta();
   } catch (error) {
      if (error.response?.status === 422) {
         userFormErros.value = error.response.data.errors || {};
      } else {
         showError('<b>Erro</b>: ' + error.response?.data.error);
         // showError('<b>Erro</b>: ' + error.response?.data.message);
      }
   }
};

const salvarNovaFoto = async () => {
   // Verifica se foi selecionada uma nova imagem
   if (!(form.value.photo instanceof File)) {
      // showError('<b>salvarNovaFoto</b>: ' + 'Nenhuma nova foto selecionada.');
      return; // Nada a fazer se não for um novo arquivo
   }

   const payload = new FormData();
   payload.append('photo', form.value.photo);

   try {
      const token = getToken();

      const { data } = await axios.post(
         'https://acl4.fazcomphp.com.br/api/user/updatephoto',
         payload,
         {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
            },
         }
      );

      // Atualiza apenas a foto no store
      userStore.$patch({
         photo: data.photo,
      });
   } catch (error) {
      showError('<b>Erro</b>: ' + error.response?.data.error);
   }
};

// Quando o usuário seleciona uma imagem
const onSelecionarFoto = (event) => {
   const file = event.target.files[0];

   if (file && file.type.startsWith('image/')) {
      // Guardar o File original no form
      form.value.photo = file;

      // Gerar preview (opcional, só para exibição)
      const reader = new FileReader();
      reader.onload = () => {
         previewFoto.value = reader.result; // isso é base64, apenas para mostrar
      };
      reader.readAsDataURL(file);
   }
};

const logout = async () => {
   try {
      await doLogout(); // sua função do authService.js e aguarda a conclusão do logout
      router.push('/pages/login');
      // router.push('/pages/loginsystem').then(() => {
      //   window.location.reload() // Recarrega se necessário
      // })
   } catch (error) {
      console.error('Erro durante logout:', error);
   }
};

const goToProfile = () => {
   router.push('/profile');
};

const goToSettings = () => {
   router.push('/settings');
};
</script>
