import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { cilExternalLink } from '@coreui/icons'
import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import { getNavMenus } from '@/_nav.js' // ✅ pega menus do userStore / JWT
import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (!link) return false
  if (route.hash === link) return true
  return normalizePath(route.path) === normalizePath(link)
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) return true
  if (item.items) return item.items.some((child) => isActiveItem(route, child))
  return false
}

export const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
    })

    // ✅ Aqui pegamos dinamicamente os menus do userStore
    const nav = getNavMenus()

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              item.icon
                ? h(resolveComponent('CIcon'), { customClassName: 'nav-icon', name: item.icon })
                : null,
              item.name,
            ],
            default: () => item.items.map(renderItem),
          },
        )
      }

      if (item.href) {
        return h(
          resolveComponent(item.component),
          {
            href: item.href,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          {
            default: () => [
              item.icon
                ? h(resolveComponent('CIcon'), { customClassName: 'nav-icon', name: item.icon })
                : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
              item.name,
              item.external &&
                h(resolveComponent('CIcon'), { class: 'ms-2', name: 'cil-external-link', size: 'sm' }),
              item.badge &&
                h(
                  CBadge,
                  { class: 'ms-auto', color: item.badge.color, size: 'sm' },
                  { default: () => item.badge.text },
                ),
            ],
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            { to: item.to, custom: true },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  { active: props.isActive, as: 'div', href: props.href, onClick: () => props.navigate() },
                  {
                    default: () => [
                      item.icon
                        ? h(resolveComponent('CIcon'), { customClassName: 'nav-icon', name: item.icon })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          { class: 'ms-auto', color: item.badge.color, size: 'sm' },
                          { default: () => item.badge.text },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(resolveComponent(item.component), { as: 'div' }, { default: () => item.name })
    }

    return () => h(CSidebarNav, { as: simplebar }, { default: () => nav.map(renderItem) })
  },
})
