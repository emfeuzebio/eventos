<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">

<!-- 
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> Updates
        <CBadge color="info" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Messages
        <CBadge color="success" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-task" /> Tasks
        <CBadge color="danger" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-comment-square" /> Comments
        <CBadge color="warning" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->


      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold my-2"
      >
        Settings
      </CDropdownHeader>
      <CDropdownItem > <CIcon icon="cil-user" /> {{ userName }} </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-settings" /> Settings </CDropdownItem>
      <!-- <CDropdownItem>
        <CIcon icon="cil-dollar" /> Payments
        <CBadge color="secondary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <!-- <CDropdownItem>
        <CIcon icon="cil-file" /> Projects
        <CBadge color="primary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <CDropdownDivider />
      <!-- <CDropdownItem> <CIcon icon="cil-shield-alt" /> Lock Account </CDropdownItem> -->
      <CDropdownItem @click="logout"> <CIcon icon="cil-lock-locked" /> Logout </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>

  import { ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import { getToken, getUserNameFromToken, logout as doLogout } from '@/services/authService'
  import avatar from '@/assets/images/avatars/8.jpg'

  const itemsCount = 42
  const router = useRouter()
  const userName = ref(getUserNameFromToken())

  watchEffect(() => {
    const token = getToken()
    userName.value = token ? getUserNameFromToken() : ''
  })

  const logout = async () => {
    try {
      await doLogout() // sua função do authService.js e aguarda a conclusão do logout
      router.push('/pages/loginsystem')
      // router.push('/pages/loginsystem').then(() => {
      //   window.location.reload() // Recarrega se necessário
      // })
    } catch (error) {
      console.error('Erro durante logout:', error)
    }    
  }

  const goToProfile = () => {
    router.push('/profile')
  }

  const goToSettings = () => {
    router.push('/settings')
  }

</script>

