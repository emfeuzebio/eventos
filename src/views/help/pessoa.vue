<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-user-friends fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Pessoas</h5>
            <small class="text-muted">
               Gerencie o cadastro de Pessoas inscritas no Evento atual ou em
               algum Evento anterior.
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
                  <td>Identificador único da Pessoa.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Entidade</td>
                  <td>Sigla da Entidade à qual a Pessoa pertence.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome Completo</td>
                  <td>Nome completo da Pessoa.</td>
               </tr>
               <tr>
                  <td class="help-col-label">E-mail</td>
                  <td>E-mail de contato da Pessoa.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Tel. Celular</td>
                  <td>Telefone celular da Pessoa.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativa</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> ou
                     <span class="text-danger fw-bold">NÃO</span>. Indica se a
                     Pessoa está ativa no sistema.
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
                  <td class="help-col-label">Ativa</td>
                  <td>
                     Exibe apenas Pessoas com <strong>Ativa = SIM</strong> ou
                     <strong>NÃO</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Entidade</td>
                  <td>
                     Exibe apenas Pessoas da Entidade selecionada (pela sigla).
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
                     Pessoa <strong>ativa</strong> — pode ser inscrita em Eventos
                     e aparece nas listas de seleção.
                  </span>
               </div>
            </div>
            <div class="col-md-6">
               <div class="help-status-card border-start border-danger border-3">
                  <span class="badge bg-danger">NÃO</span>
                  <span class="small ms-2">
                     Pessoa <strong>inativa</strong> — não aparece nas listas de
                     seleção, mas permanece cadastrada para consulta e
                     histórico.
                  </span>
               </div>
            </div>
         </div>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar uma nova Pessoa
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
               Preencha o <strong>Nome Completo</strong> e o
               <strong>Nome Social</strong> (este último é o que aparece no
               crachá).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Selecione o <strong>Sexo</strong>, informe o
               <strong>E-mail</strong> e o <strong>Telefone</strong>, e escolha a
               <strong>Entidade</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Defina se a Pessoa precisa de <strong>Crachá da FEB</strong>
               (SIM/NÃO) e mantenha <strong>Ativa = SIM</strong> (padrão).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">5</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. A Pessoa aparece na lista.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> o <strong>Nome Social</strong> é o
            nome que aparece no <strong>crachá</strong>. Se ficar em branco,
            pode ser usado o Nome Completo — mas o ideal é sempre preencher,
            respeitando como a Pessoa quer ser chamada.
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
                  <td class="help-col-label">Nome Completo</td>
                  <td>
                     Nome completo da Pessoa, conforme documento. Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome Social (Crachá)</td>
                  <td>
                     Nome pelo qual a Pessoa prefere ser chamada. É o nome
                     impresso no crachá.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Sexo</td>
                  <td>
                     <strong>Masculino</strong> ou <strong>Feminino</strong>.
                     Usado em relatórios e estatísticas.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">E-mail</td>
                  <td>
                     E-mail de contato. Usado para comunicações do Evento.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Telefone</td>
                  <td>
                     Telefone celular para contato (ex.: <code>(00)
                     90000-0000</code>).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Entidade</td>
                  <td>
                     Entidade à qual a Pessoa pertence. Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Crachá da FEB?</td>
                  <td>
                     <strong>SIM</strong> se a Pessoa deve receber crachá da FEB;
                     <strong>NÃO</strong> caso contrário.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativa?</td>
                  <td>
                     <strong>SIM</strong> deixa a Pessoa disponível para
                     inscrições; <strong>NÃO</strong> a oculta das listas de
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
                     Abre o formulário da Pessoa para alterar qualquer campo
                     (nome, contato, entidade, crachá, status).
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-trash text-danger me-1"></i>
                     <strong>Excluir</strong>
                  </td>
                  <td>
                     Remove a Pessoa. Bloqueado se houver Inscrições vinculadas a
                     ela.
                  </td>
               </tr>
            </tbody>
         </table>
         <p class="small text-muted mt-2 mb-0">
            <i class="fa fa-info-circle me-1"></i>
            A ação <strong>Visualizar</strong> está desativada nesta tela — use
            <strong>Editar</strong> para consultar os detalhes de um registro.
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
               <strong>Nome Completo</strong> e <strong>Entidade</strong> são
               obrigatórios.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               O <strong>Nome Social</strong> é o que aparece no crachá. Se
               ficar vazio, use o Nome Completo como fallback.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Pessoas com <strong>Inscrições vinculadas</strong> não podem ser
               excluídas — desative-as com <strong>Ativa = NÃO</strong> em vez
               de excluir.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Desativar uma Pessoa (<strong>Ativa = NÃO</strong>) não afeta as
               Inscrições já existentes; apenas impede novas inscrições.
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
                     Incluir, editar e desativar Pessoas.
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
      <div class="accordion help-faq" id="faqPessoa">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqPessoa1"
               >
                  Por que não consigo excluir uma Pessoa?
               </button>
            </h2>
            <div
               id="faqPessoa1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqPessoa"
            >
               <div class="accordion-body small">
                  A Pessoa provavelmente possui <strong>Inscrições
                  vinculadas</strong>. Remova ou reatribua essas inscrições antes
                  de excluí-la — ou, se a Pessoa não deve mais ser usada,
                  desative-a com <strong>Ativa = NÃO</strong>.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqPessoa2"
               >
                  Qual a diferença entre "Ativa = NÃO" e excluir?
               </button>
            </h2>
            <div
               id="faqPessoa2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqPessoa"
            >
               <div class="accordion-body small">
                  <strong>Ativa = NÃO</strong> mantém o registro no banco para
                  histórico e relatórios, mas o esconde das listas de seleção.
                  <strong>Excluir</strong> remove o registro definitivamente (e
                  só é permitido se não houver Inscrições vinculadas). Na
                  dúvida, desative.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqPessoa3"
               >
                  O que é o "Nome Social" e por que ele importa?
               </button>
            </h2>
            <div
               id="faqPessoa3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqPessoa"
            >
               <div class="accordion-body small">
                  É o nome pelo qual a Pessoa prefere ser chamada e que será
                  impresso no <strong>crachá</strong>. Preencher corretamente é
                  uma questão de respeito e inclusão. Se ficar vazio, o sistema
                  pode usar o Nome Completo como fallback — mas o ideal é sempre
                  preencher.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqPessoa4"
               >
                  O que significa "Crachá da FEB"?
               </button>
            </h2>
            <div
               id="faqPessoa4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqPessoa"
            >
               <div class="accordion-body small">
                  Indica se a Pessoa deve receber um crachá emitido pela FEB
                  (Federação Espírita Brasileira). Marque <strong>SIM</strong>
                  para quem precisa do crachá da FEB; <strong>NÃO</strong> para
                  quem usa apenas o crachá do Evento.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqPessoa5"
               >
                  Por que a coluna de ações extras não aparece?
               </button>
            </h2>
            <div
               id="faqPessoa5"
               class="accordion-collapse collapse"
               data-bs-parent="#faqPessoa"
            >
               <div class="accordion-body small">
                  Nesta tela, a coluna de ações extras está
                  <strong>desativada</strong>. Use os botões
                  <strong>Editar</strong> e <strong>Excluir</strong> padrão de
                  cada linha.
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