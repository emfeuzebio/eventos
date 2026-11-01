<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-car fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Veículos</h5>
            <small class="text-muted">
               Gerencie a frota de Veículos e seus respectivos motoristas.
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
                  <td>Identificador único do Veículo.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Descrição do Veículo</td>
                  <td>
                     Nome/descrição do veículo (ex.: Van Branca, Ônibus
                     Executivo).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Tipo</td>
                  <td>
                     Tipo do veículo: <strong>Automóvel</strong>,
                     <strong>Van</strong>, <strong>Micrônibus</strong> ou
                     <strong>Ônibus</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Capc</td>
                  <td>
                     Capacidade de passageiros (ex.: <code>3 p</code> = 3
                     pessoas).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Motorista</td>
                  <td>Nome do motorista responsável pelo veículo.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Disp</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> ou
                     <span class="text-danger fw-bold">NÃO</span>. Indica se o
                     veículo está disponível para uso.
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
                  <th style="width: 180px">Filtro</th>
                  <th>O que faz</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Tipo de Veículo</td>
                  <td>
                     Exibe apenas veículos do tipo selecionado
                     (Automóvel, Van, Micrônibus ou Ônibus).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Disponível</td>
                  <td>
                     Exibe apenas veículos com <strong>Disponível = SIM</strong>
                     ou <strong>NÃO</strong>.
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
                     Veículo <strong>disponível</strong> — pode ser usado em
                     Viagens e aparece nas listas de seleção.
                  </span>
               </div>
            </div>
            <div class="col-md-6">
               <div class="help-status-card border-start border-danger border-3">
                  <span class="badge bg-danger">NÃO</span>
                  <span class="small ms-2">
                     Veículo <strong>indisponível</strong> — não aparece nas
                     listas de seleção, mas permanece cadastrado para consulta.
                  </span>
               </div>
            </div>
         </div>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar um novo Veículo
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
               Preencha a <strong>Descrição</strong>, o <strong>Tipo</strong> e o
               <strong>Marca/Modelo</strong> do veículo.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Informe a <strong>Capacidade</strong> de passageiros e os dados
               do <strong>Motorista</strong> (nome, e-mail e telefone).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Mantenha <strong>Disponível = SIM</strong> (padrão) para que o
               veículo fique disponível para uso.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">5</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. O Veículo aparece na lista.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> o <strong>Tipo</strong> deve ser um
            dos quatro valores válidos
            (<strong>Automóvel</strong>, <strong>Van</strong>,
            <strong>Micrônibus</strong> ou <strong>Ônibus</strong>). Tipos
            fora dessa lista são rejeitados pela API.
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
                  <td class="help-col-label">Descrição</td>
                  <td>
                     Nome/descrição do veículo (ex.: Van Branca, Ônibus
                     Executivo). Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Tipo</td>
                  <td>
                     Categoria do veículo (Automóvel, Van, Micrônibus, Ônibus).
                     Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Marca/Modelo</td>
                  <td>
                     Marca e modelo do veículo (ex.: Fiat Ducato, Mercedes
                     Sprinter). Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Capacidade</td>
                  <td>
                     Número de passageiros que o veículo comporta. Obrigatório.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Motorista</td>
                  <td>Nome do motorista responsável pelo veículo. Obrigatório.</td>
               </tr>
               <tr>
                  <td class="help-col-label">E-mail</td>
                  <td>E-mail do motorista (para contato).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Telefone</td>
                  <td>Telefone do motorista (para contato).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Observação</td>
                  <td>
                     Texto livre para detalhes adicionais (ex.: restrições,
                     acessibilidade).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Disponível</td>
                  <td>
                     <strong>SIM</strong> deixa o veículo disponível para uso;
                     <strong>NÃO</strong> o oculta das listas de seleção.
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
                     Abre o formulário do Veículo para alterar qualquer campo
                     (descrição, tipo, capacidade, motorista, contato, status).
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-trash text-danger me-1"></i>
                     <strong>Excluir</strong>
                  </td>
                  <td>
                     Remove o Veículo. Bloqueado se houver Viagens vinculadas a
                     ele.
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
               O <strong>Tipo</strong> deve ser um dos quatro valores válidos
               (Automóvel, Van, Micrônibus, Ônibus).
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               <strong>Descrição</strong>, <strong>Tipo</strong>,
               <strong>Marca/Modelo</strong>, <strong>Capacidade</strong> e
               <strong>Motorista</strong> são obrigatórios.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Veículos com <strong>Viagens vinculadas</strong> não podem ser
               excluídos — desative-os com <strong>Disponível = NÃO</strong> em
               vez de excluir.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Desativar um veículo (<strong>Disponível = NÃO</strong>) não
               afeta as Viagens já cadastradas; apenas impede seu uso em novos
               cadastros.
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
                     Incluir, editar, excluir e desativar Veículos.
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
      <div class="accordion help-faq" id="faqVeiculo">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqVeiculo1"
               >
                  Por que não consigo excluir um Veículo?
               </button>
            </h2>
            <div
               id="faqVeiculo1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqVeiculo"
            >
               <div class="accordion-body small">
                  O veículo provavelmente possui <strong>Viagens vinculadas</strong>.
                  Remova ou reatribua essas Viagens antes de excluí-lo — ou, se o
                  veículo não deve mais ser usado, desative-o com
                  <strong>Disponível = NÃO</strong>.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqVeiculo2"
               >
                  Qual a diferença entre "Disponível = NÃO" e excluir?
               </button>
            </h2>
            <div
               id="faqVeiculo2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqVeiculo"
            >
               <div class="accordion-body small">
                  <strong>Disponível = NÃO</strong> mantém o registro no banco
                  para histórico e relatórios, mas o esconde das listas de
                  seleção. <strong>Excluir</strong> remove o registro
                  definitivamente (e só é permitido se não houver Viagens
                  vinculadas). Na dúvida, desative.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqVeiculo3"
               >
                  Por que o campo Tipo não é uma lista de seleção?
               </button>
            </h2>
            <div
               id="faqVeiculo3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqVeiculo"
            >
               <div class="accordion-body small">
                  O campo é um texto livre no formulário, mas a API valida que o
                  valor seja um dos quatro tipos aceitos
                  (<strong>Automóvel</strong>, <strong>Van</strong>,
                  <strong>Micrônibus</strong>, <strong>Ônibus</strong>). Use
                  exatamente um desses valores para evitar erro de validação.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqVeiculo4"
               >
                  O que significa a coluna "Capc"?
               </button>
            </h2>
            <div
               id="faqVeiculo4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqVeiculo"
            >
               <div class="accordion-body small">
                  É a <strong>capacidade</strong> de passageiros do veículo,
                  exibida como <code>N p</code> (ex.: <code>3 p</code> = 3
                  pessoas). O valor vem do campo <strong>Capacidade</strong> do
                  formulário.
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