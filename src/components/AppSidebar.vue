<script setup>
import { RouterLink } from 'vue-router'

import { logo } from '@/assets/brand/logo'
import { sygnet } from '@/assets/brand/sygnet'
import { AppSidebarNav } from '@/components/AppSidebarNav.js'
import { useSidebarStore } from '@/stores/sidebar.js'

const sidebar = useSidebarStore()
</script>

<template>
  <CSidebar
    class="border-end"
    colorScheme="dark"
    position="fixed"
    :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible"
    @visible-change="(value) => sidebar.toggleVisible(value)"
  >
    <CSidebarHeader class="border-bottom">
      <RouterLink custom to="/" v-slot="{ href, navigate }">
        <CSidebarBrand v-bind="$attrs" as="a" :href="href" @click="navigate">
          <!-- NOVO LOGO -->
          <img 
            src="/src/assets/brand/logo-eventos.svg" 
            alt="FEB - Gestão de Eventos"
            style="height: 64px; width: auto;"
            class="sidebar-brand-full"
          />
          <img 
            src="/src/assets/brand/logo-eventos.svg" 
            alt="FEB"
            style="height: 14px; width: auto;"
            class="sidebar-brand-narrow"
          />
          
          <!-- ⚠️ Código original comentado (mantido para referência) -->
          <!-- <CIcon custom-class-name="sidebar-brand-full" :icon="logo" :height="32" /> -->
          <!-- <CIcon custom-class-name="sidebar-brand-narrow" :icon="sygnet" :height="32" /> -->
        </CSidebarBrand>
      </RouterLink>
  <CCloseButton class="d-lg-none" dark @click="sidebar.toggleVisible()" />
</CSidebarHeader>
    <AppSidebarNav />
    <CSidebarFooter class="border-top d-none d-lg-flex">
      <CSidebarToggler @click="sidebar.toggleUnfoldable()" />
    </CSidebarFooter>
  </CSidebar>
</template>

<style>

  /* 1. Ícones sempre centralizados e com largura fixa */
  .nav-icon {
    min-width: 1.5rem !important;
    width: 1.5rem !important;
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  /* 2. Espaçamento dos itens do menu */
  .nav-group-toggle {
    padding: 0.6rem 0.8rem !important;  /* ← AUMENTADO */
    font-size: 0.9rem;
    margin-bottom: 3px;                  /* ← NOVO: espaçamento entre itens */
  }

  /* Subitens (nível 2) */
  .nav-group-items .nav-item {
    padding: 0.2rem 0.8rem !important;
    padding-left: 1rem !important;
    font-size: 0.9rem;
    margin-bottom: 1px;
  }

  /* 4. Títulos (CNavTitle) */
  .nav-title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #6c757d !important;
    padding: 0.6rem 0.8rem 0.3rem !important;
  }

  /* 5. Itens ativos com destaque */
  .nav-item.active > .nav-link {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-left: 3px solid #0d6efd !important;
    font-weight: 600;
  }

  /* 6. Hover suave */
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-radius: 0.25rem;
  }

  /* 7. Sidebar reduzida (narrow) */
  .sidebar-narrow .nav-icon {
    min-width: 1.2rem !important;
    width: 1.2rem !important;
    font-size: 2rem;
  }

  .sidebar-narrow .nav-item {
    text-align: center;
  }

  .sidebar-narrow .nav-item .nav-link {
    justify-content: center !important;
  }
  
</style>
