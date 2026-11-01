<template>
   <div class="help-content">
      <!-- CABEÇALHO -->
      <div class="d-flex align-items-center gap-3 mb-4">
         <div class="help-icon-box">
            <i class="fa fa-hotel fa-lg"></i>
         </div>
         <div>
            <h5 class="mb-0 fw-bold">Cadastro de Hotéis e Quartos</h5>
            <small class="text-muted">
               Gerencie os Hotéis do Evento e os Quartos disponíveis em cada um.
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
                  <td>Identificador único do Hotel.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome do Hotel</td>
                  <td>Nome do Hotel.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Sigla</td>
                  <td>Sigla curta do Hotel (ex.: HBR, HBS).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Quartos</td>
                  <td>
                     Quantidade de <strong>quartos ativos</strong> cadastrados no
                     Hotel.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Evento</td>
                  <td>Sigla do Evento ao qual o Hotel pertence.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativo</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> ou
                     <span class="text-danger fw-bold">NÃO</span>. Somente
                     Hotéis <strong>ATIVOS</strong> podem ter seus Quartos
                     gerenciados.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ações</td>
                  <td>
                     Botões <strong>Adm Quartos</strong> e
                     <strong>Quartos</strong> (relatório PDF) — veja abaixo.
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- OS DOIS BOTÕES EXTRAS -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-mouse-pointer text-primary me-2"></i>
            Os botões extras de cada linha
         </div>
         <table class="table table-sm table-bordered mb-0">
            <thead class="table-light">
               <tr>
                  <th style="width: 160px">Botão</th>
                  <th>O que faz</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>
                     <span class="badge bg-info text-dark">Adm Quartos</span>
                  </td>
                  <td>
                     Abre o modal com a <strong>lista de Quartos</strong> do
                     Hotel. É ali que você cadastra, edita e exclui quartos.
                  </td>
               </tr>
               <tr>
                  <td>
                     <span class="badge bg-warning text-dark">Quartos</span>
                  </td>
                  <td>
                     Gera e abre um <strong>relatório PDF</strong> com os
                     quartos do Hotel.
                  </td>
               </tr>
            </tbody>
         </table>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-info-circle me-1"></i>
            Os dois botões dependem do seu perfil — veja a seção
            <strong>Autorizações e Perfis de Acesso</strong>.
            <strong>Adm Quartos</strong> também exige que o Hotel esteja com
            <strong>Ativo = SIM</strong>; caso contrário, uma mensagem de erro é
            exibida.
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
                     Hotel <strong>ativo</strong> — permite gerenciar Quartos e
                     aparece nas listas de seleção.
                  </span>
               </div>
            </div>
            <div class="col-md-6">
               <div class="help-status-card border-start border-danger border-3">
                  <span class="badge bg-danger">NÃO</span>
                  <span class="small ms-2">
                     Hotel <strong>inativo</strong> — não permite gerenciar
                     Quartos. Os campos Nome e Sigla ficam bloqueados na edição.
                  </span>
               </div>
            </div>
         </div>
      </div>

      <!-- COMO CRIAR -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-plus-circle text-primary me-2"></i>
            Como criar um novo Hotel
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
               O campo <strong>Evento</strong> vem preenchido automaticamente
               com o <strong>Evento de Trabalho</strong> selecionado no sistema.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Preencha <strong>Nome do Hotel</strong> e <strong>Sigla</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Informe o <strong>Endereço Completo</strong>, a
               <strong>Latitude</strong> e a <strong>Longitude</strong> (veja
               callout abaixo).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">5</span>
            <div class="small">
               Clique em <strong>Salvar</strong>. O Hotel aparece na lista.
            </div>
         </div>
         <div class="help-callout-info p-2 rounded small mt-3">
            <i class="fa fa-exclamation-triangle me-1"></i>
            <strong>Regra crítica:</strong> o <strong>Evento</strong> é
            obrigatório e vem do <strong>Evento de Trabalho</strong> selecionado
            no topo do sistema. Sem ele, não é possível cadastrar Hotéis. Se
            precisar trocar o Evento, altere o seletor global antes de abrir o
            formulário.
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
                     Evento ao qual o Hotel pertence. Preenchido automaticamente
                     pelo Evento de Trabalho (não editável).
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Nome do Hotel / Sigla</td>
                  <td>
                     Identificação do Hotel. <strong>Bloqueados quando Ativo =
                     NÃO</strong>.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Endereço Completo</td>
                  <td>Endereço do Hotel (rua, número, bairro, cidade, CEP).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Latitude</td>
                  <td>
                     Coordenada de latitude (ex.: <code>-15.7902595</code>).
                     Usada no link do Google Maps.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Longitude</td>
                  <td>
                     Coordenada de longitude (ex.: <code>-46.63330800</code>).
                     Usada no link do Google Maps.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativo</td>
                  <td>
                     <strong>SIM</strong> permite gerenciar Quartos e exibe o
                     Hotel nas listas; <strong>NÃO</strong> bloqueia a edição de
                     Nome/Sigla e o acesso aos Quartos.
                  </td>
               </tr>
            </tbody>
         </table>
         <p class="small text-muted mt-2 mb-0">
            <i class="fa fa-map-marker-alt me-1"></i>
            Se o Hotel já tiver Latitude e Longitude, aparece o botão
            <strong>Ver no Google Maps</strong> no formulário. Caso contrário,
            aparece "Localização ainda não informada."
         </p>
      </div>

      <!-- MODAL DE QUARTOS -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-door-open text-primary me-2"></i>
            O modal "Quartos do Hotel"
         </div>
         <p class="small mb-2">
            Ao clicar em <strong>Adm Quartos</strong>, abre um modal com a
            tabela de Quartos do Hotel:
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
                  <td class="help-col-label">ID / Número</td>
                  <td>Identificador e número interno do quarto no Evento.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Nº Hotel</td>
                  <td>Número do quarto no Hotel (ex.: A-101, 202-C, E405).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Tipo / Capcid</td>
                  <td>Tipo do quarto e capacidade de hóspedes (1 a 9).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Custeado</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> se o quarto é
                     custeado pela promotora do Evento.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativo (Disponível)</td>
                  <td>
                     <span class="text-primary fw-bold">SIM</span> se está
                     disponível; <span class="text-danger fw-bold">NÃO</span> se
                     está previsto mas indisponível.
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ação</td>
                  <td>Botões <strong>Editar</strong> e <strong>Excluir</strong> do quarto.</td>
               </tr>
            </tbody>
         </table>
         <p class="small mt-2 mb-0">
            No topo do modal há o botão <strong>Novo Quarto</strong> (para
            adicionar) e o botão <strong>recarregar</strong>
            <i class="fa fa-refresh"></i> (para atualizar a tabela).
         </p>
      </div>

      <!-- MODAL EDITAR QUARTO -->
      <div class="mb-4">
         <div class="help-section-title">
            <i class="fa fa-edit text-primary me-2"></i>
            Como editar um Quarto
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">1</span>
            <div class="small">
               Clique em <strong>Adm Quartos</strong> na linha do Hotel.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">2</span>
            <div class="small">
               Na tabela, clique em <strong>Editar</strong> no quarto desejado
               (ou em <strong>Novo Quarto</strong> para adicionar).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">3</span>
            <div class="small">
               Preencha o <strong>Nosso Número</strong> (controle interno do
               Evento), o <strong>Número no Hotel</strong>, o
               <strong>Tipo</strong> e a <strong>Capacidade</strong>.
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">4</span>
            <div class="small">
               Defina <strong>Custeado</strong> (SIM/NÃO) e
               <strong>Disponível</strong> (SIM/NÃO).
            </div>
         </div>
         <div class="d-flex gap-2 mb-2">
            <span class="help-step-number">5</span>
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
               O <strong>Evento de Trabalho</strong> deve estar selecionado para
               cadastrar Hotéis ou gerenciar Quartos.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Só Hotéis com <strong>Ativo = SIM</strong> permitem gerenciar
               Quartos.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Com <strong>Ativo = NÃO</strong>, os campos
               <strong>Nome</strong> e <strong>Sigla</strong> ficam bloqueados
               para edição.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               A <strong>Capacidade</strong> do quarto deve ficar entre
               <strong>1 e 9</strong> hóspedes.
            </li>
            <li class="mb-1">
               <i class="fa fa-check-circle text-success me-1"></i>
               Latitude e Longitude são opcionais, mas necessárias para o botão
               <strong>Ver no Google Maps</strong> aparecer.
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
                     Incluir, editar, excluir Hotéis e gerenciar seus Quartos
                     (via <strong>Adm Quartos</strong> e relatório
                     <strong>Quartos</strong>).
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
      <div class="accordion help-faq" id="faqHotel">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqHotel1"
               >
                  Por que os botões "Adm Quartos" e "Quartos" estão desabilitados?
               </button>
            </h2>
            <div
               id="faqHotel1"
               class="accordion-collapse collapse"
               data-bs-parent="#faqHotel"
            >
               <div class="accordion-body small">
                  O seu perfil não tem permissão para gerenciar Quartos. Veja a
                  seção <strong>Autorizações e Perfis de Acesso</strong> acima.
                  Se acredita que deveria ter acesso, peça ao administrador para
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
                  data-bs-target="#faqHotel2"
               >
                  Por que aparece "Somente um Hotel ATIVO pode ter seus Quartos editados"?
               </button>
            </h2>
            <div
               id="faqHotel2"
               class="accordion-collapse collapse"
               data-bs-parent="#faqHotel"
            >
               <div class="accordion-body small">
                  O Hotel está com <strong>Ativo = NÃO</strong>. Altere o status
                  para <strong>SIM</strong> na edição do Hotel antes de gerenciar
                  seus Quartos.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqHotel3"
               >
                  Por que aparece "Necessário que o Evento de Trabalho esteja selecionado"?
               </button>
            </h2>
            <div
               id="faqHotel3"
               class="accordion-collapse collapse"
               data-bs-parent="#faqHotel"
            >
               <div class="accordion-body small">
                  Você precisa escolher um <strong>Evento de Trabalho</strong> no
                  seletor global do sistema antes de cadastrar Hotéis ou
                  Quartos. Sem ele, o sistema não sabe a qual Evento vincular os
                  registros.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqHotel4"
               >
                  Por que não consigo editar o Nome ou a Sigla do Hotel?
               </button>
            </h2>
            <div
               id="faqHotel4"
               class="accordion-collapse collapse"
               data-bs-parent="#faqHotel"
            >
               <div class="accordion-body small">
                  Quando o Hotel está com <strong>Ativo = NÃO</strong>, os campos
                  <strong>Nome</strong> e <strong>Sigla</strong> ficam bloqueados.
                  Altere o status para <strong>SIM</strong> para editá-los.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqHotel5"
               >
                  O que o botão "Quartos" (relatório) gera?
               </button>
            </h2>
            <div
               id="faqHotel5"
               class="accordion-collapse collapse"
               data-bs-parent="#faqHotel"
            >
               <div class="accordion-body small">
                  Gera um <strong>PDF</strong> com a lista de Quartos do Hotel e
                  o abre em nova aba. Se o PDF não abrir, verifique se o
                  bloqueador de pop-ups do navegador está ativo.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqHotel6"
               >
                  Como o Hotel é vinculado ao Evento?
               </button>
            </h2>
            <div
               id="faqHotel6"
               class="accordion-collapse collapse"
               data-bs-parent="#faqHotel"
            >
               <div class="accordion-body small">
                  O vínculo vem do <strong>Evento de Trabalho</strong> selecionado
                  no topo do sistema. O campo Evento no formulário é apenas
                  informativo (não editável).
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