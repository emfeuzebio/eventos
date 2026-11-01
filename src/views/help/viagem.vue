<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-bus fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Viagens</h5>
            <small class="text-muted">
               Gerencie as Viagens de Traslado do Evento, com suas Rotas e
               Veículos.
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
                  <td>Identificador único da Viagem.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Data-Hora Viagem</td>
                  <td>
                     Data e hora de saída da Viagem (formato brasileiro
                     <code>dd/mm/aaaa hh:mm</code>).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome da Rota</td>
                  <td>Rota da Viagem (ex.: Aeroporto → Hotel).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Veículo</td>
                  <td>Veículo designado para a Viagem (ex.: Van, Ônibus).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Pessoas</td>
                  <td>
                     Quantidade de Inscrições vinculadas a esta Viagem, somando
                     <strong>chegadas</strong> e <strong>partidas</strong>.
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
         <p class="small text-muted mt-2 mb-0">
            <i class="fa fa-sort me-1"></i>
            A lista é ordenada por <strong>Data/Hora da Viagem</strong>
            (crescente). A coluna de ordenação fica oculta.
         </p>
      </div>

      <!-- FILTROS -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-filter text-primary me-2"></i>Filtros da lista
         </div>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 180px">Filtro</th>
                  <th>O que faz</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Filtrar pela Rota</td>
                  <td>
                     Exibe apenas Viagens da Rota selecionada. A lista de rotas
                     é recarregada quando o Evento de Trabalho muda.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Tipo de Rota</td>
                  <td>
                     Filtra por <strong>Chegada</strong> ou
                     <strong>Partida</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Veículo</td>
                  <td>Exibe apenas Viagens do Veículo selecionado.</td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar uma nova Viagem
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
               <strong>Evento de Trabalho</strong> selecionado no sistema
               (bloqueado para edição).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Selecione a <strong>Rota</strong> e o <strong>Veículo</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Informe a <strong>Data e Hora</strong> da Viagem.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">5</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. A Viagem aparece na lista.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> a Viagem pertence ao
            <strong>Evento de Trabalho</strong> selecionado no sistema. Não é
            possível escolher outro Evento no formulário. Para cadastrar
            Viagens de outro Evento, troque o Evento de Trabalho antes de abrir
            o formulário.
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
                  <th style="width: 140px">Campo</th>
                  <th>Para que serve</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Evento</td>
                  <td>
                     Evento ao qual a Viagem pertence. Preenchido automaticamente
                     pelo Evento de Trabalho (não editável).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Rota</td>
                  <td>
                     Rota da Viagem (ex.: Aeroporto → Hotel). A lista é
                     recarregada quando o Evento de Trabalho muda.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Data e Hora</td>
                  <td>Data e hora de saída da Viagem.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Veículo</td>
                  <td>
                     Veículo designado para a Viagem. A lista é fixa (não depende
                     do Evento).
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
                     Abre o formulário da Viagem para alterar rota, veículo ou
                     data/hora.
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-trash text-danger me-1"></i>
                     <strong>Excluir</strong>
                  </td>
                  <td>
                     Remove a Viagem. Bloqueado se houver Inscrições vinculadas a
                     ela.
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
               cadastrar Viagens.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               A Viagem é sempre vinculada ao <strong>Evento de Trabalho</strong>
               — não é possível escolher outro no formulário.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               As <strong>Rotas</strong> disponíveis são recarregadas
               automaticamente quando o Evento de Trabalho muda.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               <strong>Rota</strong>, <strong>Data/Hora</strong> e
               <strong>Veículo</strong> são obrigatórios.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Viagens com <strong>Inscrições vinculadas</strong> não podem ser
               excluídas.
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
                  <td>
                     Incluir, editar, excluir e desativar Viagens de Traslado.
                  </td>
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
      <div class="accordion help-faq" id="faqViagem">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqViagem1"
               >
                  Por que o campo Evento está bloqueado?
               </button>
            </h2>
            <div
               id="faqViagem1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqViagem"
            >
               <div class="accordion-body small">
                  A Viagem é sempre vinculada ao <strong>Evento de Trabalho</strong>
                  selecionado no sistema. Para cadastrar Viagens de outro Evento,
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
                  data-bs-target="#faqViagem2"
               >
                  Por que a lista de Rotas está vazia?
               </button>
            </h2>
            <div
               id="faqViagem2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqViagem"
            >
               <div class="accordion-body small">
                  A lista de Rotas depende do <strong>Evento de Trabalho</strong>.
                  Se o Evento ainda não foi selecionado ou não tem rotas
                  cadastradas, a lista fica vazia. Selecione um Evento e/ou
                  cadastre rotas antes.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqViagem3"
               >
                  O que significa a coluna "Pessoas"?
               </button>
            </h2>
            <div
               id="faqViagem3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqViagem"
            >
               <div class="accordion-body small">
                  É a soma das Inscrições vinculadas a esta Viagem como
                  <strong>chegada</strong> e como <strong>partida</strong>. Uma
                  mesma pessoa pode aparecer duas vezes se estiver em viagens de
                  chegada e partida diferentes.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqViagem4"
               >
                  Por que não consigo excluir uma Viagem?
               </button>
            </h2>
            <div
               id="faqViagem4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqViagem"
            >
               <div class="accordion-body small">
                  A Viagem provavelmente possui <strong>Inscrições
                  vinculadas</strong>. Remova ou reatribua essas inscrições antes
                  de excluí-la.
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