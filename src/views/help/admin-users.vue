<template>
   <div class="help-admin-users">
      <!-- Cabeçalho com ícone e subtítulo -->
      <div class="d-flex align-items-start mb-4">
         <div class="help-icon-box me-3">
            <i class="fa fa-users fa-lg"></i>
         </div>
         <div>
            <h5 class="fw-bold mb-1">Administração de Usuários</h5>
            <p class="text-body-secondary mb-0 small">
               Gerencie convites, perfis, ativação e histórico dos usuários do
               sistema.
            </p>
         </div>
      </div>

      <!-- Seção 1: O que você vê na lista (tabela compacta) -->
      <h6 class="help-section-title">
         <i class="fa fa-table me-2 text-primary"></i> O que você vê na lista
      </h6>
      <div class="table-responsive mb-4">
         <table class="table table-sm table-borderless help-table">
            <tbody>
               <tr>
                  <td class="help-col-label">Status</td>
                  <td>
                     <span class="badge bg-secondary me-1">Convidado</span>
                     <span class="badge bg-warning text-dark me-1">Pendente</span>
                     <span class="badge bg-success me-1">Ativo</span>
                     <span class="badge bg-danger">Suspenso</span>
                  </td>
               </tr>
               <tr>
                  <td class="help-col-label">Ativo</td>
                  <td>SIM/NÃO — indica se o usuário pode fazer login no sistema.</td>
               </tr>
               <tr>
                  <td class="help-col-label">Perfis</td>
                  <td>Perfis de acesso concedidos no sistema (badges azuis).</td>
               </tr>
               <tr>
                  <td class="help-col-label">Ações</td>
                  <td>Ativar/Suspender, Perfis e o menu "Mais" com as demais operações.</td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- Seção 2: Status do usuário (cards compactos) -->
      <h6 class="help-section-title">
         <i class="fa fa-info-circle me-2 text-primary"></i> O que cada status significa
      </h6>
      <div class="row g-2 mb-4">
         <div class="col-md-6">
            <div class="help-status-card border-start border-secondary border-3">
               <span class="badge bg-secondary mb-1">Convidado</span>
               <small class="d-block text-body-secondary">Criado por convite. Ainda não definiu a senha — recebeu e-mail com o link.</small>
            </div>
         </div>
         <div class="col-md-6">
            <div class="help-status-card border-start border-warning border-3">
               <span class="badge bg-warning text-dark mb-1">Pendente</span>
               <small class="d-block text-body-secondary">Auto-registrou-se e aguarda aprovação do administrador.</small>
            </div>
         </div>
         <div class="col-md-6">
            <div class="help-status-card border-start border-success border-3">
               <span class="badge bg-success mb-1">Ativo</span>
               <small class="d-block text-body-secondary">Conta aprovada. Pode fazer login (se tiver perfil de acesso).</small>
            </div>
         </div>
         <div class="col-md-6">
            <div class="help-status-card border-start border-danger border-3">
               <span class="badge bg-danger mb-1">Suspenso</span>
               <small class="d-block text-body-secondary">Bloqueado pelo administrador. Não faz login até ser reativado.</small>
            </div>
         </div>
      </div>

      <!-- Seção 3: Como criar (passo a passo numerado) -->
      <h6 class="help-section-title">
         <i class="fa fa-plus-circle me-2 text-success"></i> Como criar um novo usuário
      </h6>
      <div class="help-steps mb-4">
         <div class="help-step">
            <span class="help-step-number">1</span>
            <div>Clique em <strong>Inserir Novo</strong> (canto superior direito).</div>
         </div>
         <div class="help-step">
            <span class="help-step-number">2</span>
            <div>Preencha <strong>nome</strong>, <strong>e-mail</strong> e, se quiser, <strong>telefone</strong> (formatado automaticamente).</div>
         </div>
         <div class="help-step">
            <span class="help-step-number">3</span>
            <div>Clique em <strong>Criar</strong>. O usuário recebe um e-mail com link para definir a própria senha.</div>
         </div>
      </div>
      <div class="help-callout help-callout-info mb-4">
         <i class="fa fa-key me-2"></i>
         <span><strong>O administrador nunca define a senha do outro.</strong> O usuário sempre define a própria senha via convite ou reset.</span>
      </div>

      <!-- Seção 4: Ações (tabela compacta) -->
      <h6 class="help-section-title">
         <i class="fa fa-cogs me-2 text-primary"></i> O que cada ação faz
      </h6>
      <div class="table-responsive mb-4">
         <table class="table table-sm table-hover help-table">
            <thead class="table-light">
               <tr><th style="width: 140px;">Ação</th><th>O que faz</th></tr>
            </thead>
            <tbody>
               <tr>
                  <td><i class="fa fa-edit text-primary me-1"></i> Editar</td>
                  <td>Altera nome, e-mail e telefone. Não altera senha nem status.</td>
               </tr>
               <tr>
                  <td><i class="fa fa-shield-alt text-info me-1"></i> Perfis</td>
                  <td>Concede ou revoga perfis de acesso. O perfil administrador não aparece aqui.</td>
               </tr>
               <tr>
                  <td><i class="fa fa-toggle-on text-warning me-1"></i> Ativar/Suspender</td>
                  <td>Muda o estado da conta. <strong>Regra:</strong> não é possível ativar sem perfil de acesso.</td>
               </tr>
               <tr>
                  <td><i class="fa fa-envelope text-secondary me-1"></i> Reenviar convite</td>
                  <td>Reenvia o e-mail de convite. Só para status <strong>Convidado</strong>. O convite anterior é invalidado.</td>
               </tr>
               <tr>
                  <td><i class="fa fa-key text-danger me-1"></i> Forçar reset</td>
                  <td>Envia e-mail para o usuário redefinir a senha. O admin não define a senha.</td>
               </tr>
               <tr>
                  <td><i class="fa fa-list-check text-info me-1"></i> Autorizações</td>
                  <td>Lista todas as permissões ativas do usuário no sistema.</td>
               </tr>
               <tr>
                  <td><i class="fa fa-history text-secondary me-1"></i> Histórico</td>
                  <td>Mostra tudo o que aconteceu com o usuário (quem, quando, o que mudou).</td>
               </tr>
               <tr>
                  <td><i class="fa fa-trash text-danger me-1"></i> Excluir</td>
                  <td>Remove definitivamente. <strong>Bloqueado</strong> se houver perfis, outros sistemas, tokens ativos ou convites pendentes.</td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- Seção 5: Regras importantes (lista curta com ícones) -->
      <h6 class="help-section-title">
         <i class="fa fa-exclamation-triangle me-2 text-warning"></i> Regras importantes
      </h6>
      <ul class="help-rules mb-4">
         <li><i class="fa fa-check-circle text-success me-2"></i> O perfil administrador nunca é concedido nem revogado por esta tela.</li>
         <li><i class="fa fa-check-circle text-success me-2"></i> A senha é sempre do usuário — o admin só envia convites e resets.</li>
         <li><i class="fa fa-check-circle text-success me-2"></i> Usuário sem perfil não faz login, mesmo estando "Ativo".</li>
         <li><i class="fa fa-check-circle text-success me-2"></i> Todas as ações são registradas no histórico (auditoria).</li>
         <li><i class="fa fa-check-circle text-success me-2"></i> Você não pode excluir a si próprio por esta tela.</li>
      </ul>

      <!-- Seção 6: Autorizações e Perfis de Acesso -->
      <h6 class="help-section-title">
         <i class="fa fa-shield-alt me-2 text-primary"></i> Autorizações e Perfis de Acesso
      </h6>
      <div class="table-responsive mb-4">
         <table class="table table-sm table-bordered help-table">
            <thead class="table-light">
               <tr>
                  <th style="width: 220px;">Perfil</th>
                  <th>O que pode fazer nesta tela</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td class="help-col-label">Exclusivo do Administrador de Eventos</td>
                  <td>
                     <strong>Acesso irrestrito</strong> a todas as operações
                     desta tela. Gerencia usuários, perfis, ativação, convites e
                     histórico sem restrição.
                  </td>
               </tr>
            </tbody>
         </table>
      </div>

      <!-- Seção 7: FAQ (accordion) -->
      <h6 class="help-section-title">
         <i class="fa fa-question-circle me-2 text-primary"></i> Dúvidas frequentes
      </h6>
      <div class="accordion accordion-flush help-faq" id="helpFaq">
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  O usuário não recebeu o e-mail de convite. O que fazer?
               </button>
            </h2>
            <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#helpFaq">
               <div class="accordion-body small">
                  Peça para verificar a caixa de spam. Se não chegou, use <strong>Reenviar convite</strong> (só funciona se o status for <em>Convidado</em>). O convite anterior é invalidado ao reenviar.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  Por que o botão "Ativar" está desabilitado?
               </button>
            </h2>
            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#helpFaq">
               <div class="accordion-body small">
                  O usuário não tem perfil de acesso no sistema. Conceda um perfil pelo botão <strong>Perfis</strong> antes de ativar. Veja a seção
                  <strong>Autorizações e Perfis de Acesso</strong> acima para
                  entender quem pode fazer o quê.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  Por que não consigo excluir um usuário?
               </button>
            </h2>
            <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#helpFaq">
               <div class="accordion-body small">
                  Há dependências: perfis concedidos, vínculo com outros sistemas, tokens ativos ou convites pendentes. A mensagem de erro lista o que precisa ser removido.
               </div>
            </div>
         </div>
         <div class="accordion-item">
            <h2 class="accordion-header">
               <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                  A senha definida aqui vale para todos os sistemas?
               </button>
            </h2>
            <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#helpFaq">
               <div class="accordion-body small">
                  O administrador <strong>não define senha</strong> por esta tela. Quando o usuário a define (via convite ou reset), vale para todos os sistemas aos quais tem acesso.
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
// Sem lógica — conteúdo estático.
</script>

<style scoped>
.help-admin-users {
   font-size: 0.9rem;
   color: #3d4852;
}

/* Caixa do ícone do cabeçalho */
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

/* Títulos de seção */
.help-section-title {
   font-weight: 700;
   font-size: 0.95rem;
   padding-bottom: 0.35rem;
   border-bottom: 1px solid #e9ecef;
   margin-bottom: 0.75rem;
}

/* Tabelas de ajuda */
.help-table td,
.help-table th {
   font-size: 0.85rem;
   vertical-align: middle;
   padding: 0.35rem 0.5rem;
}
.help-col-label {
   font-weight: 600;
   width: 70px;
   color: #6c757d;
}

/* Cards de status */
.help-status-card {
   background: #f8f9fa;
   border-radius: 6px;
   padding: 0.5rem 0.75rem;
}

/* Passos numerados */
.help-steps {
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
}
.help-step {
   display: flex;
   align-items: flex-start;
   gap: 0.6rem;
   font-size: 0.85rem;
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

/* Callout */
.help-callout {
   display: flex;
   align-items: flex-start;
   padding: 0.6rem 0.75rem;
   border-radius: 6px;
   font-size: 0.85rem;
}
.help-callout-info {
   background: #e8f0fe;
   border-left: 3px solid #1a73e8;
   color: #1a3d6d;
}

/* Lista de regras */
.help-rules {
   list-style: none;
   padding-left: 0;
   margin-bottom: 0;
}
.help-rules li {
   display: flex;
   align-items: flex-start;
   gap: 0.4rem;
   font-size: 0.85rem;
   padding: 0.25rem 0;
}

/* FAQ */
.help-faq .accordion-button {
   font-size: 0.85rem;
   font-weight: 600;
   padding: 0.6rem 0.75rem;
}
.help-faq .accordion-body {
   padding: 0.5rem 0.75rem 0.75rem;
}

/* Responsivo */
@media (max-width: 576px) {
   .help-status-card {
      margin-bottom: 0.25rem;
   }
}
</style>