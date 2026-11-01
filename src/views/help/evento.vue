<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-calendar-alt fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Lista de Eventos e seus Serviços</h5>
            <small class="text-muted">
               Administre os Eventos e os Serviços oferecidos a cada dia.
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
                  <td>Identificador único do Evento.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Sigla</td>
                  <td>Sigla curta do Evento (ex.: ENCONTRO2026).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome do Evento</td>
                  <td>Nome completo do Evento.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Datas</td>
                  <td>
                     Período em datas (lista de dias selecionados no
                     flatpickr, ex.: <code>07/08/2025,08/08/2025</code>).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Inscrições</td>
                  <td>Quantidade de inscrições ativas no Evento.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativo</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> ou
                     <span class="text-danger fw-bold">NÃO</span>. Somente
                     Eventos <strong>ATIVOS</strong> podem ter seus Serviços
                     editados.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ações</td>
                  <td>
                     Botão <strong>Adm Serviços</strong> (veja abaixo).
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- O BOTÃO ADM SERVIÇOS -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-concierge-bell text-primary me-2"></i>
            O botão "Adm Serviços"
         </div>
         <p class="small mb-2">
            Cada linha traz o botão
            <span class="badge bg-info text-dark">Adm Serviços</span>
            que abre um modal com a <strong>lista de Serviços por dia</strong>
            do Evento. É ali que você cadastra, edita e exclui o que o Evento
            oferece a cada dia (hospedagem, traslado, café, almoço, jantar).
         </p>
         <div class="help-callout-info p-2 rounded small">
            <i class="fa fa-info-circle me-1"></i>
            O botão só funciona em Eventos com <strong>Ativo = SIM</strong>. O
            acesso ao botão depende do seu perfil — veja a seção
            <strong>Autorizações e Perfis de Acesso</strong>.
         </div>
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
                     Evento <strong>ativo</strong> — aparece nas listas de
                     seleção, permite editar Serviços e receber inscrições.
                  </span>
               </div>
            </div>
            <div class="col-md-6">
               <div class="help-status-card border-start border-danger border-3">
                  <span class="badge bg-danger">NÃO</span>
                  <span class="small ms-2">
                     Evento <strong>inativo</strong> — fica oculto nas listas e
                     <strong>não permite</strong> editar Serviços.
                  </span>
               </div>
            </div>
         </div>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar um novo Evento
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
               Preencha a <strong>Organização</strong>, o <strong>Nome</strong>,
               a <strong>Sigla</strong> e os campos de período
               (<strong>Período em Datas</strong> e
               <strong>Período em Texto</strong>).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Informe as <strong>Datas de Inscrição</strong> (início e fim) e
               marque <strong>Ativo = SIM</strong> se o Evento já deve aparecer
               nas listas.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. O Evento aparece na lista.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> o <strong>Período em Datas</strong>
            (flatpickr) define <strong>quais dias podem receber Serviços</strong>.
            Ao cadastrar um Serviço, o calendário só permite escolher datas
            dentro desse período. Se o período estiver errado, os Serviços
            ficarão limitados a datas erradas.
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
                  <th style="width: 180px">Campo</th>
                  <th>Para que serve</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Organização</td>
                  <td>Organização responsável pelo Evento.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome / Sigla</td>
                  <td>Identificação do Evento nas listas e relatórios.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Observações</td>
                  <td>Texto livre com detalhes adicionais do Evento.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Local</td>
                  <td>Local físico onde o Evento acontece.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Período em Datas</td>
                  <td>
                     Datas efetivas do Evento. <strong>Define os dias
                     permitidos</strong> ao cadastrar Serviços.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Período em Texto</td>
                  <td>
                     Descrição legível do período (ex.: "De 10 a 12 de Outubro
                     de 2026"). Aparece em relatórios.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Tema</td>
                  <td>Tema central do Evento.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Data Início / Data Fim</td>
                  <td>Janela de inscrições (quando o público pode se inscrever).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativo?</td>
                  <td>
                     <strong>SIM</strong> libera o Evento nas listas e permite
                     editar Serviços; <strong>NÃO</strong> o oculta.
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- MODAL DE SERVIÇOS -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-concierge-bell text-primary me-2"></i>
            O modal de Serviços do Evento
         </div>
         <p class="small mb-2">
            Ao clicar em <strong>Adm Serviços</strong>, abre um modal com uma
            tabela listando os dias do Evento e o que é oferecido em cada um:
         </p>
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
                  <td>Identificador do Serviço.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Dia do Evento</td>
                  <td>Data do dia (com dia da semana).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Hospd / Traslado / Café / Almoço / Jantar</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> ou
                     <span class="text-danger fw-bold">NÃO</span> para cada
                     serviço oferecido naquele dia.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ação</td>
                  <td>Botões <strong>Editar</strong> e <strong>Excluir</strong> do Serviço.</td>
               </tr>
            </tbody>
         </table>
         <p class="small mt-2 mb-0">
            No topo do modal há o botão <strong>Novo Serviço</strong> (para
            adicionar um dia) e o botão <strong>recarregar</strong>
            <i class="fa fa-refresh"></i> (para atualizar a tabela).
         </p>
      </div>

      <!-- MODAL EDITAR SERVIÇO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-edit text-primary me-2"></i>
            Como editar um Serviço
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">1</span>
            <div class="small">
               Clique em <strong>Adm Serviços</strong> na linha do Evento.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">2</span>
            <div class="small">
               Na tabela, clique em <strong>Editar</strong> no dia desejado (ou
               em <strong>Novo Serviço</strong> para adicionar um dia).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Escolha a <strong>Data do Dia</strong> (o calendário só aceita
               datas dentro do Período do Evento) e ligue/desligue os switches
               de <strong>Hospedagem</strong>, <strong>Traslado</strong>,
               <strong>Café da Manhã</strong>, <strong>Almoço</strong> e
               <strong>Jantar</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. A tabela do modal recarrega
               automaticamente.
            </div>
         </div>
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
               Só Eventos com <strong>Ativo = SIM</strong> permitem editar
               Serviços.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               As datas dos Serviços ficam <strong>restritas ao Período em
               Datas</strong> do Evento. Datas fora do período não aparecem no
               calendário.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Só é possível cadastrar <strong>um Serviço por dia</strong> do
               Evento.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Excluir um Serviço remove apenas aquele dia — não afeta o Evento
               nem os demais dias.
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
                  <td class="help-col-label">Gerente de Secretaria</td>
                  <td>
                     Incluir, editar, excluir Eventos e gerenciar os Serviços
                     de cada dia (via botão <strong>Adm Serviços</strong>).
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
      <div class="accordion help-faq" id="faqEvento">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEvento1"
               >
                  Por que o botão "Adm Serviços" está desabilitado?
               </button>
            </h2>
            <div
               id="faqEvento1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEvento"
            >
               <div class="accordion-body small">
                  Duas causas possíveis: (1) o Evento está com
                  <strong>Ativo = NÃO</strong>; ou (2) o seu perfil não tem
                  permissão para gerenciar Serviços. Veja a seção
                  <strong>Autorizações e Perfis de Acesso</strong> acima. Se
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
                  data-bs-target="#faqEvento2"
               >
                  O calendário do Serviço não mostra a data que eu quero. Por quê?
               </button>
            </h2>
            <div
               id="faqEvento2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEvento"
            >
               <div class="accordion-body small">
                  O calendário só permite datas dentro do
                  <strong>Período em Datas</strong> do Evento. Se a data desejada
                  não aparece, edite o Evento e ajuste o
                  <strong>Período em Datas</strong> antes de cadastrar o Serviço.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEvento3"
               >
                  Posso cadastrar dois Serviços no mesmo dia?
               </button>
            </h2>
            <div
               id="faqEvento3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEvento"
            >
               <div class="accordion-body small">
                  Não. Cada dia do Evento tem <strong>um único Serviço</strong>,
                  com os switches SIM/NÃO definindo o que é oferecido naquele
                  dia. Se precisar mudar algo, edite o Serviço existente.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEvento4"
               >
                  O que acontece ao excluir um Serviço?
               </button>
            </h2>
            <div
               id="faqEvento4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEvento"
            >
               <div class="accordion-body small">
                  Apenas o Serviço daquele dia é removido. O Evento e os demais
                  dias permanecem intactos. A exclusão pede confirmação antes de
                  efetivar.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqEvento5"
               >
                  Por que aparece a mensagem "Necessário que o Evento de Trabalho esteja selecionado"?
               </button>
            </h2>
            <div
               id="faqEvento5"
               class="accordion-collapse collapse"
               data-bs-parent="#faqEvento"
            >
               <div class="accordion-body small">
                  Você precisa escolher um <strong>Evento de Trabalho</strong> no
                  seletor global do sistema antes de cadastrar ou editar
                  Serviços. Sem ele, o sistema não sabe a qual Evento vincular os
                  Serviços.
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