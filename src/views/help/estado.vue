<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-map-marked-alt fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Estados e Regiões</h5>
            <small class="text-muted">
               Gerencie os Estados da Federação e edite as Regiões do País
               associadas a cada um.
            </small>
         </div>
      </div>

      <!-- O QUE VOCÊ VÊ NA LISTA -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-table text-primary me-2"></i>O que você vê na lista
         </div>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 140px">Coluna</th>
                  <th>Significado</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">ID</td>
                  <td>Identificador único do Estado no sistema.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome do Estado</td>
                  <td>Nome completo da unidade federativa (ex.: São Paulo).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Sigla</td>
                  <td>Sigla da UF com 2 letras (ex.: SP, RJ, MG).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Região</td>
                  <td>
                     Região do País à qual o Estado pertence (Norte, Nordeste,
                     Sudeste, Sul, Centro-Oeste).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ações</td>
                  <td>
                     Botões de editar, excluir e, quando disponível,
                     <strong>Editar Região</strong> (veja abaixo).
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- BOTÃO EXTRA: EDITAR REGIÃO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-pen-square text-primary me-2"></i>
            O botão "Editar Região"
         </div>
         <p class="small mb-2">
            Cada linha da lista traz um botão extra
            <span class="badge bg-info text-dark">Editar Região</span>
            que abre um modal para alterar o nome e a sigla da
            <strong>Região</strong> vinculada ao Estado — sem sair da tela de
            Estados.
         </p>
         <div class="help-callout-info p-2 rounded small">
            <i class="fa fa-info-circle me-1"></i>
            Editar a Região aqui <strong>afeta todos os Estados</strong> que
            pertencem a ela. Se precisar mudar apenas o vínculo de um Estado,
            use o botão <strong>Editar</strong> do próprio Estado.
         </div>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar um novo Estado
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">1</span>
            <div class="small">
               Clique em <strong>Inserir Novo</strong> no topo da lista.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">2</span>
            <div class="small">
               Preencha <strong>Nome do Estado</strong>, <strong>Sigla</strong> e
               selecione a <strong>Região do País</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. O Estado aparece na lista
               imediatamente.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> a <strong>Sigla</strong> deve ter
            exatamente 2 letras e ser única no sistema. Siglas duplicadas são
            rejeitadas pela API.
         </div>
      </div>

      <!-- O QUE CADA AÇÃO FAZ -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-mouse-pointer text-primary me-2"></i>
            O que cada ação faz
         </div>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 160px">Ação</th>
                  <th>O que faz</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>
                     <i class="fa fa-edit text-primary me-1"></i>
                     <strong>Editar</strong>
                  </td>
                  <td>
                     Abre o formulário do Estado para alterar nome, sigla ou
                     região vinculada.
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-pen-square text-info me-1"></i>
                     <strong>Editar Região</strong>
                  </td>
                  <td>
                     Abre um modal para alterar o nome e a sigla da Região
                     vinculada (afeta todos os Estados daquela região).
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-trash text-danger me-1"></i>
                     <strong>Excluir</strong>
                  </td>
                  <td>
                     Remove o Estado. Bloqueado se houver registros dependentes
                     (ex.: cidades, eventos).
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- REGRAS IMPORTANTES -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-check-circle text-primary me-2"></i>
            Regras importantes
         </div>
         <ul class="list-unstyled small mb-0">
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               A <strong>sigla</strong> deve ter 2 letras e ser única.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Todo Estado deve estar vinculado a uma <strong>Região</strong>.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Editar a Região aqui altera o dado para <strong>todos</strong> os
               Estados vinculados a ela.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Estados com dependências não podem ser excluídos.
            </li>
         </ul>
      </div>

      <!-- AUTORIZAÇÕES E PERFIS DE ACESSO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-shield-alt text-primary me-2"></i>
            Autorizações e Perfis de Acesso
         </div>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 220px">Perfil</th>
                  <th>O que pode fazer nesta tela</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Administrador de Eventos</td>
                  <td>
                     <strong>Acesso irrestrito</strong> a todas as operações
                     desta tela. Esta tela é <strong>exclusiva</strong> deste
                     perfil — não há outro perfil com acesso.
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- FAQ -->
      <div class="help-section-title">
         <i class="fa fa-question-circle text-primary me-2"></i>
         Perguntas frequentes
      </div>
      <div class="accordion help-faq" id="faqEstado">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEstado1"
               >
                  Por que o botão "Editar Região" está desabilitado?
               </button>
            </h2>
            <div
               id="faqEstado1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEstado"
            >
               <div class="accordion-body small">
                  O botão exige a permissão
                  <code>inscricao.marcarchegada</code>. Veja a seção
                  <strong>Autorizações e Perfis de Acesso</strong> acima. Se você
                  acredita que deveria ter acesso, peça ao administrador para
                  revisar seus perfis em
                  <strong>Administração de Usuários</strong>.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEstado2"
               >
                  Posso cadastrar um Estado sem Região?
               </button>
            </h2>
            <div
               id="faqEstado2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEstado"
            >
               <div class="accordion-body small">
                  Não. O campo <strong>Região do País</strong> é obrigatório. Se
                  a região ainda não existe, cadastre-a antes (ou edite-a pelo
                  botão <strong>Editar Região</strong> de outro Estado da mesma
                  região).
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEstado3"
               >
                  O que acontece se eu editar a Região de um Estado?
               </button>
            </h2>
            <div
               id="faqEstado3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEstado"
            >
               <div class="accordion-body small">
                  A edição altera o registro da <strong>Região</strong> em si —
                  não apenas o vínculo. Todos os Estados daquela região passam a
                  exibir o novo nome/sigla. Use com cuidado.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEstado4"
               >
                  Por que não consigo excluir um Estado?
               </button>
            </h2>
            <div
               id="faqEstado4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEstado"
            >
               <div class="accordion-body small">
                  O Estado provavelmente possui registros dependentes (cidades,
                  eventos, etc.). Remova ou reatribua essas dependências antes de
                  excluí-lo.
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
// Conteúdo estático — sem lógica necessária.
</script>

<style scoped>
.help-icon-box {
   width: 44px;
   height: 44px;
   border-radius: 10px;
   background: #e8f0fe;
   color: #1a73e8;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
}
.help-section-title {
   font-weight: 700;
   font-size: 0.95rem;
   padding-bottom: 0.35rem;
   border-bottom: 1px solid #e9ecef;
   margin-bottom: 0.75rem;
}
.help-col-label {
   font-weight: 600;
   color: #6c757d;
}
.help-step-number {
   width: 22px;
   height: 22px;
   border-radius: 50%;
   background: #1a73e8;
   color: #fff;
   font-size: 0.75rem;
   font-weight: 700;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
}
.help-callout-info {
   background: #e8f0fe;
   border-left: 3px solid #1a73e8;
   color: #1a3d6d;
}
.help-faq .accordion-button {
   font-size: 0.85rem;
   font-weight: 600;
   padding: 0.6rem 0.75rem;
}
</style>