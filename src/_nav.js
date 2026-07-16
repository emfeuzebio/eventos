// src/_nav.js
import { getUserMenusFromToken } from '@/services/authService'

const ICON_MAP = {
  'Inscrições': 'cil-people',
  'Transportes': 'cil-truck',
  'Hospedagem': 'cil-bed',
  'Eventos': 'cil-calendar',
  'Relatórios': 'cil-chart-pie',
  'Cadastros': 'cil-list',
  'Dashboard': 'cil-speedometer',
  'Operacional': 'cil-home',
}

function getIcon(menu) {
  return menu.icon || ICON_MAP[menu.name] || 'cil-menu'
}

function convertToCoreUIFormat(menus) {
  const coreUiNavItems = []
  const menuMap = new Map()
  
  menus.forEach(menu => menuMap.set(menu.id, menu))
  
  const rootMenus = menus
    .filter(menu => menu.menu_id === null && menu.active === 'Y')
    .sort((a, b) => a.position - b.position)
  
  rootMenus.forEach(rootMenu => {
    if (!rootMenu.route) {
      coreUiNavItems.push({ 
        component: 'CNavTitle', 
        name: rootMenu.name 
      })
    } else {
      const childMenus = menus
        .filter(menu => menu.menu_id === rootMenu.id && menu.active === 'Y')
        .sort((a, b) => a.position - b.position)
      
      if (childMenus.length > 0) {
        coreUiNavItems.push({
          component: 'CNavGroup',
          name: rootMenu.name,
          to: rootMenu.route,
          icon: getIcon(rootMenu),
          items: childMenus.map(child => ({
            component: 'CNavItem',
            name: child.name,
            to: child.route,
            icon: getIcon(child),
          })),
        })
      } else {
        const item = {
          component: 'CNavItem',
          name: rootMenu.name,
          to: rootMenu.route,
          icon: getIcon(rootMenu),
        }
        if (rootMenu.badge) item.badge = rootMenu.badge
        coreUiNavItems.push(item)
      }
    }
  })
  
  return coreUiNavItems
}

export function getNavMenus() {
  try {
    const userMenus = getUserMenusFromToken()
    const menus = convertToCoreUIFormat(userMenus)
    return menus.length > 0 ? menus : [
      { component: 'CNavItem', name: 'Operacional', to: '/operacional', icon: 'cil-home' }
    ]
  } catch (err) {
    console.error('Erro ao carregar menus do JWT', err)
    return [
      { component: 'CNavItem', name: 'Operacional', to: '/operacional', icon: 'cil-home' }
    ]
  }
}