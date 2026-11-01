<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-layer-group fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Regiões</h5>
            <small class="text-muted">
               Gerencie as Regiões do País (Norte, Nordeste, Sudeste, Sul,
               Centro-Oeste).
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
                  <th style="width: 160px">Coluna</th>
                  <th>Significado</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">ID</td>
                  <td>Identificador único da Região no sistema.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome da Região</td>
                  <td>
                     Nome completo da região (ex.: Sudeste, Nordeste).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Sigla</td>
                  <td>
                     Abreviação da região (ex.: SE, NE, S, N, CO).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ações</td>
                  <td>
                     Botões de <strong>Editar</strong> e
                     <strong>Excluir</strong> disponíveis em cada linha.
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar uma nova Região
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
               Preencha o <strong>Nome da Região</strong> e a
               <strong>Sigla</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. A Região aparece na lista
               imediatamente.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> a <strong>sigla</strong> deve ser
            única. Duas regiões não podem ter a mesma sigla. A API rejeita
            duplicatas.
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
                     Abre o formulário da Região para alterar nome ou sigla.
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-trash text-danger me-1"></i>
                     <strong>Excluir</strong>
                  </td>
                  <td>
                     Remove a Região. Bloqueado se houver Estados ou outros
                     registros dependentes.
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
               A <strong>sigla</strong> deve ser única no sistema.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               O <strong>nome</strong> e a <strong>sigla</strong> são
               obrigatórios.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Regiões com <strong>Estados vinculados</strong> não podem ser
               excluídas.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Para alterar a Região de um Estado, use a tela
               <strong>Cadastro de Estados e Regiões</strong> e clique em
               <strong>Editar Região</strong> na linha do Estado.
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
      <div class="accordion help-faq" id="faqRegiao">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRegiao1"
               >
                  Por que não consigo excluir uma Região?
               </button>
            </h2>
            <div
               id="faqRegiao1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRegiao"
            >
               <div class="accordion-body small">
                  A Região provavelmente possui <strong>Estados vinculados</strong>.
                  Remova ou reatribua esses Estados antes de excluí-la. A
                  exclusão é bloqueada pela API para preservar a integridade.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRegiao2"
               >
                  Qual a diferença entre esta tela e "Estados e Regiões"?
               </button>
            </h2>
            <div
               id="faqRegiao2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRegiao"
            >
               <div class="accordion-body small">
                  <strong>Aqui</strong> você gerencia as Regiões em si (nome e
                  sigla). Na tela <strong>Estados e Regiões</strong> você
                  gerencia os Estados e, pelo botão <strong>Editar Região</strong>
                  de cada Estado, edita a Região vinculada sem sair daquela tela.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRegiao3"
               >
                  O que é a "sigla" da Região?
               </button>
            </h2>
            <div
               id="faqRegiao3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRegiao"
            >
               <div class="accordion-body small">
                  É a abreviação oficial usada em relatórios e listagens —
                  por exemplo <strong>SE</strong> (Sudeste), <strong>NE</strong>
                  (Nordeste), <strong>S</strong> (Sul), <strong>N</strong>
                  (Norte), <strong>CO</strong> (Centro-Oeste). Deve ser curta e
                  única.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRegiao4"
               >
                  Por que a coluna de ações extras não aparece?
               </button>
            </h2>
            <div
               id="faqRegiao4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRegiao"
            >
               <div class="accordion-body small">
                  Nesta tela, a coluna de ações extras está
                  <strong>desativada</strong>. Use os botões
                  <strong>Editar</strong> e <strong>Excluir</strong> padrão da
                  linha para gerenciar a Região.
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