<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-bed fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Tipos de Quartos de Hotel</h5>
            <small class="text-muted">
               Gerencie os tipos de quartos usados nos Hotéis (ex.: Solteiro,
               Duplo, Casal, Triplo).
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
                  <td>Identificador único do Tipo de Quarto.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome</td>
                  <td>
                     Nome do tipo (ex.: <em>Casal</em>, <em>Solteiro</em>,
                     <em>Triplo</em>).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Sigla</td>
                  <td>
                     Abreviação curta do tipo (ex.: <code>C</code>,
                     <code>S</code>, <code>T</code>).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Descrição</td>
                  <td>
                     Texto explicativo do tipo (acomodações, camas, etc.).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativa</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> ou
                     <span class="text-danger fw-bold">NÃO</span>. Indica se o
                     tipo está disponível para uso.
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

      <!-- FILTRO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-filter text-primary me-2"></i>Filtro da lista
         </div>
         <p class="small mb-0">
            No topo da lista há o filtro <strong>Ativo</strong>, com as opções
            <strong>SIM</strong> e <strong>NÃO</strong>. Use-o para exibir apenas
            os tipos ativos, apenas os inativos, ou todos (deixando o filtro
            vazio).
         </p>
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
                     Tipo <strong>ativo</strong> — disponível para ser usado nos
                     Hotéis e nas listas de seleção.
                  </span>
               </div>
            </div>
            <div class="col-md-6">
               <div class="help-status-card border-start border-danger border-3">
                  <span class="badge bg-danger">NÃO</span>
                  <span class="small ms-2">
                     Tipo <strong>inativo</strong> — não aparece nas listas de
                     seleção, mas permanece cadastrado para consulta.
                  </span>
               </div>
            </div>
         </div>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar um novo Tipo de Quarto
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
               Preencha o <strong>Nome</strong>, a <strong>Sigla</strong> e a
               <strong>Descrição</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Escolha <strong>Ativo = SIM</strong> (padrão) para que o tipo já
               fique disponível.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. O tipo aparece na lista
               imediatamente.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> o <strong>Nome</strong> e a
            <strong>Sigla</strong> devem ser únicos. Dois tipos de quarto não
            podem ter o mesmo nome ou a mesma sigla — a API rejeita duplicatas.
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
                  <td class="help-col-label">Nome</td>
                  <td>
                     Nome do tipo de quarto (ex.: Casal, Solteiro, Triplo).
                     Obrigatório e único.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Sigla</td>
                  <td>
                     Abreviação curta para uso em relatórios e listagens.
                     Obrigatória e única.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Descrição</td>
                  <td>
                     Detalhes do tipo (acomodações, camas, comodidades). Texto
                     livre.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativo</td>
                  <td>
                     <strong>SIM</strong> deixa o tipo disponível para uso;
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
                     Abre o formulário do Tipo de Quarto para alterar nome,
                     sigla, descrição ou status.
                  </td>
               </tr>
               <tr>
                  <td>
                     <i class="fa fa-trash text-danger me-1"></i>
                     <strong>Excluir</strong>
                  </td>
                  <td>
                     Remove o Tipo de Quarto. Bloqueado se houver registros
                     dependentes (ex.: quartos de hotéis usando este tipo).
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
               <strong>Nome</strong> e <strong>Sigla</strong> devem ser únicos.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               <strong>Nome</strong> e <strong>Sigla</strong> são obrigatórios.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Tipos com <strong>quartos vinculados</strong> não podem ser
               excluídos — desative-os com <strong>Ativo = NÃO</strong> em vez
               de excluir.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Desativar um tipo (<strong>Ativo = NÃO</strong>) não afeta os
               quartos já cadastrados; apenas impede seu uso em novos
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
                  <td class="help-col-label">Gerente de Hospedagem</td>
                  <td>
                     Incluir, editar, excluir e desativar Tipos de Quarto.
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
      <div class="accordion help-faq" id="faqQuartoTipo">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqQuartoTipo1"
               >
                  Por que não consigo excluir um Tipo de Quarto?
               </button>
            </h2>
            <div
               id="faqQuartoTipo1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqQuartoTipo"
            >
               <div class="accordion-body small">
                  O tipo provavelmente possui <strong>quartos vinculados</strong>
                  em algum Hotel. A exclusão é bloqueada para preservar a
                  integridade. Nesse caso, prefira desativá-lo
                  (<strong>Ativo = NÃO</strong>).
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqQuartoTipo2"
               >
                  Qual a diferença entre "Ativo = NÃO" e excluir?
               </button>
            </h2>
            <div
               id="faqQuartoTipo2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqQuartoTipo"
            >
               <div class="accordion-body small">
                  <strong>Ativo = NÃO</strong> mantém o registro no banco para
                  histórico e relatórios, mas o esconde das listas de seleção.
                  <strong>Excluir</strong> remove o registro definitivamente (e
                  só é permitido se não houver dependências). Na dúvida,
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
                  data-bs-target="#faqQuartoTipo3"
               >
                  O que é a "sigla" do Tipo de Quarto?
               </button>
            </h2>
            <div
               id="faqQuartoTipo3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqQuartoTipo"
            >
               <div class="accordion-body small">
                  É uma abreviação curta usada em relatórios e listagens
                  compactas — por exemplo <strong>C</strong> (Casal),
                  <strong>S</strong> (Solteiro), <strong>T</strong> (Triplo).
                  Deve ser única.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqQuartoTipo4"
               >
                  Por que a coluna de ações extras não aparece?
               </button>
            </h2>
            <div
               id="faqQuartoTipo4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqQuartoTipo"
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