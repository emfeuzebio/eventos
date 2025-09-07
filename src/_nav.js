// import userMenus from '@/data/menus.json';              // carrega Menus para simular resposta JSON da API com a lista de menus
import { getUserMenusFromToken } from '@/services/authService'; // o service extrai os Menus contidos no JWT

// Função para converter a estrutura da API para formato CoreUI
function convertToCoreUIFormat(menus) {
  const coreUiNavItems = [];
  const menuMap = new Map();
  
  // Primeiro, mapear todos os menus por ID
  menus.forEach(menu => {
    menuMap.set(menu.id, menu);
  });
  
  // Processar apenas menus raiz (menu_id = null)
  const rootMenus = menus.filter(menu => menu.menu_id === null && menu.active === 'Y')
                        .sort((a, b) => a.position - b.position);
  
  rootMenus.forEach(rootMenu => {
    // Se não tem rota, é um título
    if (!rootMenu.route) {
      coreUiNavItems.push({
        component: 'CNavTitle',
        name: rootMenu.name
      });
    } 
    // Se tem filhos, é um grupo
    else {
      const childMenus = menus.filter(menu => menu.menu_id === rootMenu.id && menu.active === 'Y')
                             .sort((a, b) => a.position - b.position);
      
      if (childMenus.length > 0) {
        // CNavGroup com subitens
        const group = {
          component: 'CNavGroup',
          name: rootMenu.name,
          to: rootMenu.route,
          icon: rootMenu.icon,
          items: childMenus.map(child => ({
            component: 'CNavItem',
            name: child.name,
            to: child.route,
            icon: child.icon
          }))
        };
        
        coreUiNavItems.push(group);
      } else {
        // CNavItem simples
        const item = {
          component: 'CNavItem',
          name: rootMenu.name,
          to: rootMenu.route,
          icon: rootMenu.icon
        };
        
        if (rootMenu.badge) {
          item.badge = rootMenu.badge;
        }
        
        coreUiNavItems.push(item);
      }
    }
  });
  
  return coreUiNavItems;
}

// Função principal para obter menus
function getMenusFromJWT() {
  try {
    const userMenus = getUserMenusFromToken();
    // console.log('userMenus', userMenus);

    // Converte para o formato do CoreUI
    return convertToCoreUIFormat(userMenus);
  } catch (error) {
    console.error('Erro ao carregar menus a partir do JWT:', error);
    
    // Fallback. Menus mínimo em caso de erro
    return [
      {
        component: 'CNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer'
      }
    ];
  }
}

// Exportar os menus
export default getMenusFromJWT();