export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  
  //     {
  //       component: 'CNavItem',
  //       name: 'Time Picker',
  //       href: 'https://coreui.io/vue/docs/forms/time-picker.html',
  //       external: true,
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  
  //   component: 'CNavGroup',
  //   name: 'Icons',
  //   to: '/icons',
  //   icon: 'cil-star',
  //   items: [
  //     {
  //       component: 'CNavItem',
  //       name: 'CoreUI Icons',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'info',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Brands',
  //       to: '/icons/brands',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Flags',
  //       to: '/icons/flags',
  //     },
  //   ],
  // },

  {
    component: 'CNavTitle',
    name: 'Negócio',
  },

  // Inscrições
  {
    component: 'CNavGroup',
    name: 'Inscrições',
    to: '/inscricoes',
    icon: 'cil-envelope-open',
    items: [
      {
        component: 'CNavItem',
        name: 'Inscrições',
        to: '/inscricoes/inscricoes',
      },
      {
        component: 'CNavItem',
        name: 'Pessoas',
        to: '/inscricoes/pessoa',
      },
    ],
  },  

  // Hospedagem
  {
    component: 'CNavGroup',
    name: 'Hospedagem',
    to: '/hospedagem',
    icon: 'cil-layers',
    items: [
      {
        component: 'CNavItem',
        name: 'Gestão de Hospedagem',
        to: '/hospedagem/ghospedagem',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'Hotéis v1',
      //   to: '/hospedagem/hoteis1',
      // },
      {
        component: 'CNavItem',
        name: 'Hotéis e Quartos',
        to: '/hospedagem/hoteis2',
      },
      {
        component: 'CNavItem',
        name: 'Tipos de Quarto',
        to: '/hospedagem/quartoTipos',
      },
    ],
  },

  // Transportes
  {
    component: 'CNavGroup',
    name: 'Transportes',
    to: '/transportes',
    icon: 'cil-layers',
    items: [
      {
        component: 'CNavItem',
        name: 'Gestão de Chegadas',
        to: '/transportes/chegadas',
      },
      {
        component: 'CNavItem',
        name: 'Gestão de Partidas',
        to: '/transportes/partidas',
      },
      {
        component: 'CNavItem',
        name: 'Veículos e Motoristas',
        to: '/transportes/rotasG',
      },
      {
        component: 'CNavItem',
        name: 'Rotas',
        to: '/transportes/rotas',
      },
      {
        component: 'CNavItem',
        name: 'Viagens',
        to: '/transportes/viagens',
      },
    ],
  },

  // Eventos
  {
    component: 'CNavGroup',
    name: 'Eventos',
    to: '/eventos',
    icon: 'cil-envelope-open',
    items: [
      {
        component: 'CNavItem',
        name: 'Eventos',
        to: '/inscricoes/eventos',
      },
      {
        component: 'CNavItem',
        name: 'Eventos e Serviços',
        to: '/inscricoes/eventosservicos',
      },
    ],
  },  

  // Cadastros
  {
    component: 'CNavGroup',
    name: 'Cadastros',
    to: '/cadastros',
    icon: 'cil-list',
    items: [
      {
        component: 'CNavItem',
        name: 'Minha Organização',
        to: '/cadastros/organizacoes',
      },
      {
        component: 'CNavItem',
        name: 'Entidades',
        to: '/cadastros/entidades',
      },
      {
        component: 'CNavItem',
        name: 'Funções/Papéis',
        to: '/cadastros/funcoes',
      },
      {
        component: 'CNavItem',
        name: 'Estados da Federação',
        to: '/cadastros/estados',
      },
      {
        component: 'CNavItem',
        name: 'Regiões do País',
        to: '/cadastros/regioes',
      },
    ],
  },

  {
    component: 'CNavTitle',
    name: 'Exploração',
  },
  {
    component: 'CNavGroup',
    name: 'Notifications',
    to: '/notifications',
    icon: 'cil-bell',
    items: [
      {
        component: 'CNavItem',
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: 'CNavItem',
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: 'CNavItem',
        name: 'Modals',
        to: '/notifications/modals',
      },
      {
        component: 'CNavItem',
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  
  // {
  //   component: 'CNavItem',
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: 'cil-calculator',
  //   badge: {
  //     color: 'primary',
  //     text: 'NEW',
  //     shape: 'pill',
  //   },
  // },
  {
    component: 'CNavTitle',
    name: 'Extras',
  },
  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/pages',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/pages/login',
      },
      {
        component: 'CNavItem',
        name: 'Login System',
        to: '/pages/loginsystem',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/pages/register',
      },
      {
        component: 'CNavItem',
        name: 'Forgot Password',
        to: '/pages/forgotpassword',
      },
      {
        component: 'CNavItem',
        name: 'Reset Password',
        to: '/pages/resetpassword',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/pages/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/pages/500',
      },
    ],
  },
]
