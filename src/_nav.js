// src/_nav.js
import { getUserMenusFromToken } from '@/services/authService'

// Converte menus do JWT para CoreUI
function convertToCoreUIFormat(menus) {
  const coreUiNavItems = []
  const menuMap = new Map()
  
  menus.forEach(menu => menuMap.set(menu.id, menu))
  
  const rootMenus = menus
    .filter(menu => menu.menu_id === null && menu.active === 'Y')
    .sort((a, b) => a.position - b.position)
  
  rootMenus.forEach(rootMenu => {
    if (!rootMenu.route) {
      coreUiNavItems.push({ component: 'CNavTitle', name: rootMenu.name })
    } else {
      const childMenus = menus
        .filter(menu => menu.menu_id === rootMenu.id && menu.active === 'Y')
        .sort((a, b) => a.position - b.position)
      
      if (childMenus.length > 0) {
        coreUiNavItems.push({
          component: 'CNavGroup',
          name: rootMenu.name,
          to: rootMenu.route,
          icon: rootMenu.icon,
          items: childMenus.map(child => ({
            component: 'CNavItem',
            name: child.name,
            to: child.route,
            icon: child.icon,
          })),
        })
      } else {
        const item = {
          component: 'CNavItem',
          name: rootMenu.name,
          to: rootMenu.route,
          icon: rootMenu.icon,
        }
        if (rootMenu.badge) item.badge = rootMenu.badge
        coreUiNavItems.push(item)
      }
    }
  })
  
  return coreUiNavItems
}

// ✅ Função que retorna menus do usuário
export function getNavMenus() {
  try {
    const userMenus = getUserMenusFromToken()
    return convertToCoreUIFormat(userMenus)
  } catch (err) {
    console.error('Erro ao carregar menus do JWT', err)
    return [
      { component: 'CNavItem', name: 'Dashboard', to: '/dashboard', icon: 'cil-speedometer' }
    ]
  }
}
