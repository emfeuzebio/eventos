<template>
   <CDropdown placement="bottom-end" variant="nav-item">
      <CDropdownToggle class="py-0 pe-0" :caret="false">
         <img
            :src="avatar"
            id="avatar"
            style="border-radius: 20px"
            size="md"
            width="40"
            height="50"
            onerror="this.src=aclURL.value"
         />
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
            <CIcon :icon="cilUser" /> <strong>{{ userName }}</strong>
         </CDropdownItem>

         <CDropdownItem @click="abrirEditarConta" class="cursor-pointer-item">
            <CIcon icon="cil-pencil" /> Editar Conta
         </CDropdownItem>

         <CDropdownItem @click="abrirAlterarSenha" class="cursor-pointer-item">
            <CIcon :icon="cibOpenAccess" /> Alterar Senha
         </CDropdownItem>

         <CDropdownItem>
            <CIcon :icon="cilShieldAlt" /> Perfis de Acesso
            <div>
               <div v-if="userStore.roles.length">
                  <ol>
                     <li v-for="(role, index) in userStore.roles" :key="index">
                        {{ role }}
                     </li>
                  </ol>
               </div>
               <div v-else class="text-muted ms-3">Nenhum Perfil de Acesso</div>
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
            <CIcon :icon="cilExitToApp" /> Sair
         </CDropdownItem>
      </CDropdownMenu>
   </CDropdown>

   <!-- Editar Conta do Usuário -->
   <CModal
      :visible="editarContaModal"
      @close="fecharEditarConta"
      size="md"
      backdrop="static"
      scrollable
      responsive
      v-autofocus-first
   >
      <CModalHeader class="bg-primary text-white fw-bold">
         Editar Conta do Usuário {{ userName }}
      </CModalHeader>

      <CModalBody>
         <!-- Foto (upload) -->
         <div class="mb-3">
            <label class="form-label fw-bold mb-0 ms-3">Foto de Perfil</label>

            <div class="row align-items-center">
               <!-- Coluna da Esquerda - Preview da Foto -->
               <div class="col-md-4 text-center mb-3 mb-md-0">
                  <CAvatar
                     class="img-preview mt-2 mb-2"
                     :src="previewFoto || defaultPhoto"
                     size="xl"
                  />
               </div>

               <!-- Coluna da Direita - Botões -->
               <div class="col-md-5">
                  <div class="d-grid gap-2">
                     <!-- Botão para Selecionar Nova Foto -->
                     <CButton
                        color="primary"
                        size="sm"
                        @click="$refs.fileInput.click()"
                        class="mb-2"
                     >
                        <CIcon icon="cil-pencil" class="me-1" />
                        Selecionar Nova Foto
                     </CButton>

                     <!-- Botão para Remover Foto (só aparece se tiver foto) -->
                     <CButton
                        v-if="previewFoto && previewFoto !== defaultPhoto"
                        color="danger"
                        size="sm"
                        @click="removerFoto"
                        variant="outline"
                     >
                        <CIcon icon="cil-task" class="me-1" />
                        Excluir Foto
                     </CButton>
                  </div>
               </div>
            </div>

            <!-- Input de arquivo (hidden) -->
            <input
               ref="fileInput"
               type="file"
               accept="image/*"
               class="d-none"
               @change="onSelecionarFoto"
            />

            <div class="form-text ms-2 mt-2">
               Selecione a imagem desejada para o seu perfil.
            </div>
         </div>

         <!-- Email (somente leitura) -->
         <div class="mb-3">
            <label class="form-label fw-bold">Email</label>
            <CFormInput
               type="email"
               v-model="form.email"
               :class="{
                  'is-invalid': !!userFormErros.email,
               }"
               readonly
               disabled
            />
            <div class="form-error" v-if="userFormErros.email">
               {{ userFormErros.email[0] }}
            </div>
            <div class="form-text ms-2" color="success">
               O E-mail é seu login e não pode ser alterado.
            </div>
         </div>

         <!-- Nome -->
         <div class="mb-3">
            <label class="form-label fw-bold">Nome</label>
            <input
               ref="primeiroInput"
               v-model="form.nome"
               class="form-control"
               :class="{ 'is-invalid': !!userFormErros.name }"
            />
            <div class="form-error" v-if="userFormErros.name">
               {{ userFormErros.name[0] }}
            </div>
            <div class="form-text ms-2">
               Informe o Nome do Usuário com no mínimo 6 caracteres.
            </div>
         </div>

         <!-- Telefone -->
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
            <div class="form-text ms-2">
               Informe o Telefone do Usuário no formato (XX) XXXXX-XXXX.
            </div>
         </div>

         <!-- Perfis de Acesso -->
         <div class="mb-3">
            <label class="form-label fw-bold">Perfis de Acesso</label>
            <div class="col-md-5">
               <CBadge
                  v-for="(role, index) in userStore.roles"
                  :key="index"
                  color="primary"
                  variant="outline"
                  class="ms-3"
               >
                  {{ index + 1 }}. {{ role }}
               </CBadge>
            </div>
            <div class="form-text ms-1">
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

   <!-- Alterar a Senha do Usuário -->
   <CModal
      :visible="alterarSenhaModal"
      @close="fecharAlterarSenha"
      size="md"
      backdrop="static"
   >
      <CModalHeader class="bg-primary text-white fw-bold">
         Alterar a Senha do Usuário {{ userName }}
      </CModalHeader>

      <CModalBody>
         <form autocomplete="off">
            <!-- Campo de Senha Atual -->
            <div class="mb-3 position-relative">
               <label class="form-label fw-bold">Senha Atual</label>
               <input
                  ref="primeiroInput"
                  v-model="formAlterarSenha.senhaAtual"
                  :type="mostrarSenhaAtual ? 'text' : 'password'"
                  class="form-control"
               />
               <CButton
                  color="ligth"
                  size="sm"
                  style="right: 10px; top: 35px"
                  class="position-absolute"
                  @click="toggleMostrarSenhaAtual"
               >
                  <CIcon :icon="cilLowVision" />
               </CButton>
               <div class="form-error" v-if="formAlterarSenhaErros.senhaAtual">
                  {{ formAlterarSenhaErros.senhaAtual[0] }}
               </div>
               <div class="form-text">
                  É obrigatório informar sua senha atual
               </div>
            </div>

            <!-- Nova Senha -->
            <div class="mb-3 position-relative">
               <label class="form-label fw-bold">Nova Senha</label>
               <CFormInput
                  v-model="formAlterarSenha.novaSenha"
                  :type="mostrarNovaSenha ? 'text' : 'password'"
                  placeholder="Digite uma nova senha"
                  autocomplete="new-password"
               />
               <CButton
                  color="ligth"
                  size="sm"
                  style="right: 10px; top: 35px"
                  class="position-absolute"
                  @click="toggleMostrarNovaSenha"
               >
                  <CIcon :icon="cilLowVision" />
               </CButton>
               <div class="form-error" v-if="formAlterarSenhaErros.novaSenha">
                  {{ formAlterarSenhaErros.novaSenha[0] }}
               </div>
               <div class="form-text">
                  A senha deve conter no <b>mínimo 6</b> caracteres, uma
                  <b>letra maiúscula</b>, <b>um número</b> e um
                  <b>caractere especial</b>.
               </div>
            </div>

            <!-- Confirmar Nova Senha -->
            <div class="mb-3 position-relative">
               <label class="form-label fw-bold">Confirmar Nova Senha</label>
               <CFormInput
                  v-model="formAlterarSenha.confirmarSenha"
                  :type="mostrarConfirmarSenha ? 'text' : 'password'"
                  placeholder="Confirme a nova senha"
                  autocomplete="new-password"
               />
               <CButton
                  color="ligth"
                  size="sm"
                  style="right: 10px; top: 35px"
                  class="position-absolute"
                  @click="toggleMostrarConfirmarSenha"
               >
                  <CIcon :icon="cilLowVision" />
               </CButton>
               <div
                  class="form-error"
                  v-if="formAlterarSenhaErros.confirmarSenha"
               >
                  {{ formAlterarSenhaErros.confirmarSenha[0] }}
               </div>
               <div class="form-text">Repita a Nova Senha</div>
            </div>
         </form>
      </CModalBody>

      <CModalFooter>
         <CButton color="secondary" size="sm" @click="fecharAlterarSenha">
            Cancelar
         </CButton>
         <CButton
            color="primary"
            size="sm"
            @click="salvarNovaSenha"
            :disabled="!isFormValido"
         >
            Salvar
         </CButton>
      </CModalFooter>
   </CModal>
</template>

<script setup>
import { ref, watchEffect, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useGlobalError } from '@/composables/useGlobalError';
import { useGlobalLoading } from '@/stores/loading';
import { redirectToLogin } from '@/utils/routerHelper';
import axios from 'axios';
import { CIcon } from '@coreui/icons-vue';
import {
   getToken,
   removeToken,
   getUserNameFromToken,
   logout as doLogout,
} from '@/services/authService';

import { useUserStore } from '@/stores/userStore';
import {
   cibBlackberry,
   cibOpenAccess,
   cibSuperuser,
   cilAccountLogout,
   cilBraille,
   cilBuilding,
   cilCropRotate,
   cilExitToApp,
   cilEyedropper,
   cilHospital,
   cilLockLocked,
   cilLowVision,
   cilMoodBad,
   cilMoon,
   cilSearch,
   cilShieldAlt,
   cilUser,
} from '@coreui/icons';

const userStore = useUserStore();

const { startLoading, stopLoading } = useGlobalLoading();
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
      ? urlFotos.value + 'storage/' + userStore.photo
      : urlFotos.value + 'storage/users/avatar.jpg';
});

// URL da ACL do Sistema
const aclURL = ref(import.meta.env.VITE_API_ACL_URL); // Prod https://acl4.fazcomphp.com.br/
// const aclURL = ref('http://localhost:13000/'); // Dev http://localhost:13000/

const urlFotos = ref(aclURL);
const previewFoto = ref(userStore.photo || null);

// Modal visibilidade
const editarContaModal = ref(false);
const alterarSenhaModal = ref(false);

// Foco no campo número quando o modal é aberto
const primeiroInput = ref(null);

const focoNoPrimeiroInput = async () => {
   await nextTick(); // Espera a renderização do DOM ser concluída
   setTimeout(() => {
      primeiroInput.value?.focus(); // Aplica o foco após a renderização
   }, 200); // delay para garantir que o modal foi totalmente exibido
};

const loading = ref(false);
const userFormErros = ref({});

// Estado do formulário e erros
const formAlterarSenha = ref({
   senhaAtual: '',
   novaSenha: '',
   confirmarSenha: '',
});

const formAlterarSenhaErros = ref({
   senhaAtual: [],
   novaSenha: [],
   confirmarSenha: [],
});

// Controle de visibilidade das senhas
const mostrarSenhaAtual = ref(false);
const mostrarNovaSenha = ref(false);
const mostrarConfirmarSenha = ref(false);

// Funções para alternar visibilidade das senhas
const toggleMostrarSenhaAtual = () => {
   mostrarSenhaAtual.value = !mostrarSenhaAtual.value;
};
const toggleMostrarNovaSenha = () => {
   mostrarNovaSenha.value = !mostrarNovaSenha.value;
};
const toggleMostrarConfirmarSenha = () => {
   mostrarConfirmarSenha.value = !mostrarConfirmarSenha.value;
};

// Validação do Formulário
const isFormValido = computed(() => {
   return (
      formAlterarSenha.value.senhaAtual.length >= 6 &&
      senhaValida.value &&
      formAlterarSenha.value.novaSenha === formAlterarSenha.value.confirmarSenha
   );
});

// Validação de Senha
const senhaValida = computed(() => {
   const senhaRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
   return senhaRegex.test(formAlterarSenha.value.novaSenha);
});

// Fechar o modal
const fecharAlterarSenha = () => {
   // emit('update:alterarSenhaModal', false);
   alterarSenhaModal.value = false;
};

const abrirAlterarSenha = () => {
   formAlterarSenha.value = {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: '',
   };
   alterarSenhaModal.value = true;
   focoNoPrimeiroInput();
};

// Função de Alteração de Senha
const salvarNovaSenha = async () => {
   startLoading();
   if (!isFormValido.value) return;

   try {
      // Chamada API para alterar a senha (exemplo)
      // await axios.post('/api/alterar-senha', form.value);
      const token = getToken();

      // Salva a photo via axios diretamente (axios suporta multipart/form-data nativamente)
      const { data } = await axios.post(
         aclURL.value + 'api/user/changepassword',
         {
            senhaAtual: formAlterarSenha.value.senhaAtual,
            novaSenha: formAlterarSenha.value.novaSenha,
            novaSenha_confirmation: formAlterarSenha.value.confirmarSenha,
         },
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );

      showToast({
         title: 'Sucesso',
         message: `Senha do Usuário atualizada com sucesso.`,
      });

      fecharAlterarSenha();
   } catch (error) {
      if (error.response?.status === 422) {
         formAlterarSenhaErros.value = error.response.data.errors || {};
      } else {
         const errorMessage =
            error.response?.data?.error || error.response?.data?.message || '';
         showError(`<b>Erro</b>: ${errorMessage}`);
      }
   } finally {
      stopLoading();
   }
};

//  ----------------------------------------

const abrirEditarConta = () => {
   startLoading();
   form.value = {
      nome: userStore.name,
      email: userStore.email,
      phone: userStore.phone,
      photo: null,
   };

   // userFormErros.value = {
   //    name: [],
   //    phone: userStore.phone,
   // };

   userFormErros.value = {};

   previewFoto.value = userStore.photo
      ? urlFotos.value + 'storage/' + userStore.photo
      : defaultPhoto;

   // console.log('userStore.photo', userStore.photo);
   // console.log('urlFotos', urlFotos.value);
   // console.log('defaultPhoto', defaultPhoto);
   // console.log('previewFoto', previewFoto.value);

   editarContaModal.value = true;
   focoNoPrimeiroInput();
   stopLoading();
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

const defaultPhoto = urlFotos.value + 'storage/users/avatar.jpg';

// Salvar dados
const salvarConta = async () => {
   startLoading();
   erros.value = {};

   if (!form.value.nome) {
      erros.value.nome = 'Nome é obrigatório.';
   }

   if (Object.keys(erros.value).length > 0) {
      return;
   }

   try {
      const token = getToken();

      // Salva a photo via axios diretamente (axios suporta multipart/form-data nativamente)
      const { data } = await axios.post(
         aclURL.value + 'api/user/update',
         {
            name: form.value.nome,
            email: form.value.email,
            phone: form.value.phone,
         },
         {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
            },
         }
      );

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
      if (error.response?.status === 401) {
         removeToken();
         router.push('/pages/login');
         redirectToLogin();
      } else if (error.response?.status === 422) {
         userFormErros.value = error.response.data.errors || {};
      } else {
         showError(
            '<b>Erro</b>: ' +
               error.response?.data.error +
               ' ' +
               error.response?.data.message
         );
      }
   } finally {
      stopLoading();
   }
};

const removerFoto = async () => {
   startLoading();

   try {
      const token = getToken();

      // Para REMOVER a foto (envie como JSON, não como FormData)
      const { data } = await axios.post(
         aclURL.value + 'api/user/updatephoto',
         { photo: null, removerFoto: true },
         {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         }
      );

      // Atualiza apenas a foto no store
      userStore.$patch({
         photo: data.user.photo,
      });

      showToast({
         title: 'Sucesso',
         message: data.message,
      });

      // Atualiza o preview para a foto padrão
      previewFoto.value = urlFotos.value + 'storage/users/avatar.jpg';
   } catch (error) {
      if (error.response?.status === 401) {
         removeToken();
         router.push('/pages/login');
         redirectToLogin();
      } else {
         showError(
            '<b>Erro</b>: ' +
               error.response?.data.error +
               ' ' +
               error.response?.data.message
         );
      }
   } finally {
      stopLoading();
   }
};

const salvarNovaFoto = async () => {
   // Verifica se foi selecionada uma nova imagem
   if (!(form.value.photo instanceof File)) {
      // showError('<b>salvarNovaFoto</b>: ' + 'Nenhuma nova foto selecionada.');
      return; // Nada a fazer se não for um novo arquivo
   }

   startLoading();
   const payload = new FormData();
   payload.append('photo', form.value.photo);

   try {
      const token = getToken();
      const { data } = await axios.post(
         aclURL.value + 'api/user/updatephoto',
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
         photo: data.user.photo,
      });
   } catch (error) {
      if (error.response?.status === 401) {
         removeToken();
         router.push('/pages/login');
         redirectToLogin();
      } else {
         showError(
            '<b>Erro</b>: ' +
               error.response?.data.error +
               ' ' +
               error.response?.data.message
         );
      }
   } finally {
      stopLoading();
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
</script>

<style scoped>
.cursor-pointer-item {
   cursor: pointer !important;
}

.cursor-pointer-item * {
   cursor: inherit !important;
}
</style>
