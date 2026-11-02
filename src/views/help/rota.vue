<template>  
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-route fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Rotas de Viagens</h5>
            <small class="text-muted">
               Gerencie as Rotas de Viagens do Evento. Usuários com perfil
               autorizado podem incluir, editar, excluir e desativar Rotas.
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
                  <td>Identificador único da Rota.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome da Rota</td>
                  <td>Nome da Rota (ex.: Aeroporto → Hotel).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Tipo</td>
                  <td>
                     <strong>Chegada</strong> ou <strong>Partida</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Qtd Viagens</td>
                  <td>
                     Quantidade de Viagens vinculadas a esta Rota. Se for maior
                     que zero, a Rota não pode ser excluída.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativa</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> ou
                     <span class="text-danger fw-bold">NÃO</span>. Indica se a
                     Rota está disponível para uso.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ações</td>
                  <td>
                     Botões de <strong>Editar</strong> e
                     <strong>Excluir</strong> disponíveis em cada linha (se o
                     seu perfil permitir).
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- FILTROS -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-filter text-primary me-2"></i>Filtros da lista
         </div>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 160px">Filtro</th>
                  <th>O que faz</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Tipo de Rota</td>
                  <td>
                     Exibe apenas Rotas de <strong>Chegada</strong> ou de
                     <strong>Partida</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativa</td>
                  <td>
                     Exibe apenas Rotas com <strong>Ativa = SIM</strong> ou
                     <strong>NÃO</strong>.
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- O QUE CADA STATUS SIGNIFICA -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-toggle-on text-primary me-2"></i>
            O que cada status significa
         </div>
         <div class="row g-2">
            <div class="col-md-6">
               <div class="help-status-card border-start border-primary border-3">
                  <span class="badge bg-primary">SIM</span>
                  <span class="small ms-2">
                     Rota <strong>ativa</strong> — disponível para ser usada em
                     Viagens.
                  </span>
               </div>
            </div>
            <div class="col-md-6">
               <div class="help-status-card border-start border-danger border-3">
                  <span class="badge bg-danger">NÃO</span>
                  <span class="small ms-2">
                     Rota <strong>inativa</strong> — não aparece nas listas de
                     seleção de Viagens, mas permanece cadastrada para consulta.
                  </span>
               </div>
            </div>
         </div>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar uma nova Rota
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
               O campo <strong>Evento</strong> já vem preenchido com o
               <strong>Evento de Trabalho</strong> selecionado no sistema.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Preencha o <strong>Nome da Rota</strong> e selecione o
               <strong>Tipo</strong> (Chegada ou Partida).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Informe o <strong>Local de Origem</strong> e o
               <strong>Local de Destino</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">5</span>
            <div class="small">
               Mantenha <strong>Ativa = SIM</strong> (padrão) para que a Rota
               fique disponível.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">6</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. A Rota aparece na lista.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> a Rota pertence ao
            <strong>Evento de Trabalho</strong> selecionado no sistema. Para
            cadastrar Rotas de outro Evento, troque o Evento de Trabalho antes
            de abrir o formulário.
         </div>
      </div>

      <!-- CAMPOS DO FORMULÁRIO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-list-alt text-primary me-2"></i>
            O que cada campo do formulário significa
         </div>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 160px">Campo</th>
                  <th>Para que serve</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Evento</td>
                  <td>
                     Evento ao qual a Rota pertence. Preenchido automaticamente
                     pelo Evento de Trabalho.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome da Rota</td>
                  <td>
                     Nome descritivo da Rota (ex.: Aeroporto → Hotel).
                     Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Tipo</td>
                  <td>
                     <strong>Chegada</strong> (transporte até o Evento) ou
                     <strong>Partida</strong> (transporte de volta). Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Local de Origem</td>
                  <td>Ponto de partida da Rota (ex.: Aeroporto). Obrigatório.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Local de Destino</td>
                  <td>Ponto de chegada da Rota (ex.: Hotel). Obrigatório.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativa</td>
                  <td>
                     <strong>SIM</strong> deixa a Rota disponível para uso em
                     Viagens; <strong>NÃO</strong> a oculta das listas de
                     seleção.
                  </td>
               </tr>
            </tbody>
         </table>
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
                     Abre o formulário da Rota para alterar nome, tipo, origem,
                     destino ou status.
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-trash text-danger me-1"></i>
                     <strong>Excluir</strong>
                  </td>
                  <td>
                     Remove a Rota. Bloqueado se houver <strong>Viagens
                     vinculadas</strong>.
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
               O <strong>Evento de Trabalho</strong> deve estar selecionado para
               cadastrar Rotas.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               A Rota é sempre vinculada ao <strong>Evento de Trabalho</strong>
               selecionado no sistema.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               <strong>Nome</strong>, <strong>Tipo</strong>,
               <strong>Origem</strong> e <strong>Destino</strong> são
               obrigatórios.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Rotas com <strong>Viagens vinculadas</strong> não podem ser
               excluídas — desative-as com <strong>Ativa = NÃO</strong> em vez
               de excluir.
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
                  <td class="help-col-label">Gerente de Transportes</td>
                  <td>Incluir, editar, excluir e desativar Rotas.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Administrador de Eventos</td>
                  <td>
                     <strong>Acesso irrestrito</strong> a todas as operações
                     desta tela, independentemente de outros perfis.
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
      <div class="accordion help-faq" id="faqRota">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRota1"
               >
                  Por que o campo Evento não pode ser alterado?
               </button>
            </h2>
            <div
               id="faqRota1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRota"
            >
               <div class="accordion-body small">
                  A Rota é sempre vinculada ao <strong>Evento de Trabalho</strong>
                  selecionado no sistema. Para cadastrar Rotas de outro Evento,
                  troque o Evento de Trabalho antes de abrir o formulário.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRota2"
               >
                  Por que não consigo excluir uma Rota?
               </button>
            </h2>
            <div
               id="faqRota2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRota"
            >
               <div class="accordion-body small">
                  A Rota provavelmente possui <strong>Viagens vinculadas</strong>
                  (veja a coluna <strong>Qtd Viagens</strong>). Remova ou
                  reatribua essas Viagens antes de excluir — ou, se a Rota não
                  deve mais ser usada, desative-a com <strong>Ativa = NÃO</strong>.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRota3"
               >
                  Qual a diferença entre Chegada e Partida?
               </button>
            </h2>
            <div
               id="faqRota3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRota"
            >
               <div class="accordion-body small">
                  <strong>Chegada</strong> é o transporte que traz a pessoa até o
                  Evento (ex.: Aeroporto → Hotel). <strong>Partida</strong> é o
                  transporte de retorno (ex.: Hotel → Aeroporto). A distinção
                  afeta como as Viagens e Inscrições são contabilizadas.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRota4"
               >
                  Qual a diferença entre "Ativa = NÃO" e excluir?
               </button>
            </h2>
            <div
               id="faqRota4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRota"
            >
               <div class="accordion-body small">
                  <strong>Ativa = NÃO</strong> mantém o registro no banco para
                  histórico e relatórios, mas o esconde das listas de seleção.
                  <strong>Excluir</strong> remove o registro definitivamente (e
                  só é permitido se não houver Viagens vinculadas). Na dúvida,
                  desative.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqRota5"
               >
                  Por que não vejo o botão "Inserir Novo"?
               </button>
            </h2>
            <div
               id="faqRota5"
               class="accordion-collapse collapse"
               data-bs-parent="#faqRota"
            >
               <div class="accordion-body small">
                  A inclusão de Rotas exige o perfil
                  <strong>Gerente de Transportes</strong> ou ser
                  <strong>Administrador de Eventos</strong>. Veja a seção
                  <strong>Autorizações e Perfis de Acesso</strong> acima.
                  Se você acredita que deveria ter acesso, peça ao administrador
                  para revisar seus perfis em
                  <strong>Administração de Usuários</strong>.
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
.help-status-card {
   background: #f8f9fa;
   border-radius: 6px;
   padding: 0.5rem 0.75rem;
}
.help-faq .accordion-button {
   font-size: 0.85rem;
   font-weight: 600;
   padding: 0.6rem 0.75rem;
}
</style>    