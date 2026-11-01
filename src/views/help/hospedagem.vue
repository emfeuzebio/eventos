<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-bed fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Gestão de Hospedagem</h5>
            <small class="text-muted">
               Gerencie as Inscrições que solicitaram Hospedagem no Evento
               selecionado. Marque quartos, faça Check-in e Check-out.
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
                  <td>Identificador da Inscrição.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Pessoa e Dados da Inscrição</td>
                  <td>
                     Bloco com: <strong>nome</strong> (ou nome social),
                     <strong>papel</strong> no Evento, <strong>entidade</strong>,
                     <strong>modalidade</strong>, dados de <strong>chegada</strong>
                     (data/hora, meio de transporte, companhia),
                     <strong>traslado</strong> e <strong>custeio da
                     hospedagem</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ações</td>
                  <td>
                     Coluna larga com os controles de Check-in, Check-out,
                     botão <strong>Selecionar Quarto</strong> e o resumo da
                     Hospedagem marcada (veja abaixo).
                  </td>
               </tr>
            </tbody>
         </table>
         <p class="small text-muted mt-2 mb-0">
            <i class="fa fa-sort me-1"></i>
            A lista é ordenada por <strong>Data/Hora de Chegada</strong>
            (crescente). A coluna de data/hora usada para ordenação fica oculta.
         </p>
      </div>

      <!-- COLUNA DE AÇÕES -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-mouse-pointer text-primary me-2"></i>
            A coluna de Ações
         </div>
         <p class="small mb-2">
            Cada linha tem dois blocos:
         </p>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 160px">Elemento</th>
                  <th>O que faz</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>
                     <span class="badge bg-info text-dark">Check-in</span>
                  </td>
                  <td>
                     Switch que marca a chegada do hóspede no Hotel. Exige que
                     um Quarto já esteja marcado e que o Check-out ainda não
                     tenha sido feito.
                  </td>
               </tr>
               <tr>
                  <td>
                     <span class="badge bg-info text-dark">Selecionar Quarto</span>
                  </td>
                  <td>
                     Abre o modal para escolher o Quarto do Hotel para esta
                     Inscrição.
                  </td>
               </tr>
               <tr>
                  <td>
                     <span class="badge bg-info text-dark">Check-Out</span>
                  </td>
                  <td>
                     Switch que marca a saída do hóspede. Exige que o Check-in já
                     tenha sido feito.
                  </td>
               </tr>
               <tr>
                  <td>Resumo da Hospedagem</td>
                  <td>
                     Mostra <strong>Tipo</strong> (custeio),
                     <strong>Hotel</strong>, <strong>Quarto</strong> (número,
                     número no hotel, tipo e capacidade) e
                     <strong>Acompanhante Sugerido</strong>.
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
                  <th style="width: 180px">Filtro</th>
                  <th>O que faz</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Ativa</td>
                  <td>
                     Exibe apenas Inscrições com <strong>Ativo = SIM</strong> ou
                     <strong>NÃO</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Tipo de Hospedagem</td>
                  <td>
                     Filtra por custeio: <strong>Na FEB</strong>,
                     <strong>Custeada pela FEB</strong>,
                     <strong>Paga pela Pessoa</strong>,
                     <strong>Não solicitada</strong>, ou
                     <strong>Todas Solicitadas</strong> (padrão).
                  </td>
               </tr>
            </tbody>
         </table>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-info-circle me-1"></i>
            O filtro <strong>Tipo de Hospedagem</strong> já vem em
            <strong>"Todas Solicitadas"</strong> por padrão — ou seja, esconde
            quem marcou "Não solicitada". Para ver todas as inscrições, limpe o
            filtro.
         </div>
      </div>

      <!-- COMO MARCAR UM QUARTO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-door-open text-primary me-2"></i>
            Como marcar um Quarto para uma Inscrição
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">1</span>
            <div class="small">
               Localize a Inscrição na lista (use os filtros se necessário).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">2</span>
            <div class="small">
               Clique em <strong>Selecionar Quarto</strong> na coluna de Ações.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               No modal, confira os <strong>Dados da Inscrição</strong> e
               escolha o Quarto na lista (só aparecem os quartos ativos do
               Evento).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. O resumo da Hospedagem na
               linha é atualizado.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> a Inscrição precisa ter
            <strong>solicitado Hospedagem</strong> (Tipo ≠ "Não solicitada") e o
            Evento precisa estar <strong>Ativo</strong>. Caso contrário, o
            sistema bloqueia a seleção com uma mensagem de erro.
         </div>
      </div>

      <!-- COMO FAZER CHECK-IN / CHECK-OUT -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-check-square text-primary me-2"></i>
            Como fazer Check-in e Check-out
         </div>
         <p class="small mb-2">
            Os switches seguem uma <strong>ordem obrigatória</strong>:
         </p>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 140px">Etapa</th>
                  <th>Pré-requisito</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>
                     <strong>1. Marcar Quarto</strong>
                  </td>
                  <td>
                     Inscrição ativa, Evento ativo, Hospedagem solicitada.
                  </td>
               </tr>
               <tr>
                  <td>
                     <strong>2. Check-in</strong>
                  </td>
                  <td>
                     Quarto já marcado <strong>e</strong> Check-out ainda não
                     feito.
                  </td>
               </tr>
               <tr>
                  <td>
                     <strong>3. Check-out</strong>
                  </td>
                  <td>
                     Check-in já feito (SIM).
                  </td>
               </tr>
            </tbody>
         </table>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Ordem inversa também é bloqueada:</strong> não é possível
            desfazer o Check-in enquanto o Check-out estiver marcado. Desfaça o
            Check-out primeiro.
         </div>
      </div>

      <!-- RELATÓRIO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-print text-primary me-2"></i>
            Relatório de Hóspedes
         </div>
         <p class="small mb-0">
            No canto superior direito há o botão
            <strong>Hóspedes PDF</strong>, que gera um relatório em PDF com os
            hóspedes do Evento atual e o abre em nova aba. Se o PDF não abrir,
            verifique o bloqueador de pop-ups do navegador.
         </p>
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
               Só Inscrições de <strong>Eventos ATIVOS</strong> podem ter
               Check-in, Check-out ou Quarto alterados.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               A Inscrição precisa estar <strong>Ativa</strong> para marcar
               Quarto.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               A Inscrição precisa ter <strong>solicitado Hospedagem</strong>
               (Tipo ≠ "Não solicitada") para receber um Quarto.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               <strong>Check-in</strong> exige Quarto marcado; <strong>Check-out</strong>
               exige Check-in feito.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Não é possível desfazer o Check-in com Check-out marcado —
               desfaça o Check-out primeiro.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Apenas Inscrições <strong>Presenciais</strong> podem ser
               hospedadas (a Modalidade Virtual não permite).
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
                  <td class="help-col-label">Gerente de Hospedagem</td>
                  <td>
                     Marcar Quartos, fazer Check-in e Check-out, e gerar o
                     relatório <strong>Hóspedes PDF</strong>.
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
         <p class="small text-muted mt-2 mb-0">
            <i class="fa fa-info-circle me-1"></i>
            Além do perfil, a tela exige que a Inscrição seja de
            <strong>Modalidade Presencial</strong> e que o Evento esteja
            <strong>Ativo</strong> — essas são regras do dado, não de perfil.
         </p>
      </div>

      <!-- FAQ -->
      <div class="help-section-title">
         <i class="fa fa-question-circle text-primary me-2"></i>
         Perguntas frequentes
      </div>
      <div class="accordion help-faq" id="faqInscricao">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqInscricao1"
               >
                  Por que os switches e o botão "Selecionar Quarto" estão desabilitados?
               </button>
            </h2>
            <div
               id="faqInscricao1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqInscricao"
            >
               <div class="accordion-body small">
                  Duas causas possíveis: (1) a Inscrição é de modalidade
                  <strong>Virtual</strong> — apenas Presenciais podem ser
                  hospedadas; ou (2) o seu perfil não tem permissão para
                  gerenciar Hospedagem. Veja a seção
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
                  data-bs-target="#faqInscricao2"
               >
                  Por que aparece "Impossível fazer Check-In sem primeiro marcar um Quarto"?
               </button>
            </h2>
            <div
               id="faqInscricao2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqInscricao"
            >
               <div class="accordion-body small">
                  A ordem obrigatória é: <strong>Quarto → Check-in → Check-out</strong>.
                  Use <strong>Selecionar Quarto</strong> antes de ligar o
                  switch de Check-in.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqInscricao3"
               >
                  Por que não consigo desmarcar o Check-in?
               </button>
            </h2>
            <div
               id="faqInscricao3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqInscricao"
            >
               <div class="accordion-body small">
                  Se o <strong>Check-out</strong> já estiver marcado, é preciso
                  desfazê-lo primeiro. A regra é: o Check-in só pode ser
                  desfeito quando o Check-out estiver desmarcado.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqInscricao4"
               >
                  Por que aparece "Esta Inscrição NÃO solicitou Hospedagem"?
               </button>
            </h2>
            <div
               id="faqInscricao4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqInscricao"
            >
               <div class="accordion-body small">
                  O campo <strong>Tipo de Hospedagem</strong> da Inscrição está
                  como <strong>"Não solicitada"</strong>. Nesse caso, não há como
                  marcar Quarto. Se for um erro de cadastro, corrija a Inscrição
                  antes.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqInscricao5"
               >
                  O que significa "Acompanhante Sugerido"?
               </button>
            </h2>
            <div
               id="faqInscricao5"
               class="accordion-collapse collapse"
               data-bs-parent="#faqInscricao"
            >
               <div class="accordion-body small">
                  É a pessoa indicada pela própria Inscrição para dividir o
                  quarto. É apenas uma <strong>sugestão</strong> — o sistema não
                  impede marcar um quarto com outro acompanhante.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqInscricao6"
               >
                  O que acontece se eu escolher "Desmarcar o Quarto atual"?
               </button>
            </h2>
            <div
               id="faqInscricao6"
               class="accordion-collapse collapse"
               data-bs-parent="#faqInscricao"
            >
               <div class="accordion-body small">
                  O vínculo da Inscrição com o Quarto é removido. Faça isso com
                  cautela: se houver Check-in ou Check-out marcados, desfaça-os
                  antes de desmarcar o Quarto.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqInscricao7"
               >
                  Por que não consigo editar ou excluir uma Inscrição aqui?
               </button>
            </h2>
            <div
               id="faqInscricao7"
               class="accordion-collapse collapse"
               data-bs-parent="#faqInscricao"
            >
               <div class="accordion-body small">
                  Esta tela é <strong>operacional</strong> (gestão de
                  hospedagem), não de cadastro. Os botões Editar, Excluir e
                  Visualizar estão desativados de propósito. Para alterar dados
                  da Inscrição, use a tela de <strong>Inscrições</strong>.
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