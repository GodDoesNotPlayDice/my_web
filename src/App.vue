<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { Notivue, Notification, useNotivue } from 'notivue'
import { cosmicGlassTheme } from './config/notivueTheme'
import AppBody from './components/layouts/AppBody.vue'
import AppHeader from './components/layouts/AppHeader.vue'
import GalaxyBg from './components/fx/GalaxyBg.vue'
import GlassCursor from './components/fx/GlassCursor.vue'

const notivue = useNotivue()

function updatePosition() {
  if (typeof window !== 'undefined') {
    notivue.position.value = window.innerWidth < 768 ? 'top-center' : 'bottom-right'
  }
}

onMounted(() => {
  // Ensure dark cosmic mode is enabled by default
  document.documentElement.classList.add('dark')
  updatePosition()
  window.addEventListener('resize', updatePosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePosition)
})
</script>

<template>
  <!-- Notivue Toast Notifications with Cosmic Glass Theme -->
  <Notivue v-slot="item">
    <Notification :item="item" :theme="cosmicGlassTheme" />
  </Notivue>

  <!-- Fullscreen Canvas2D Cosmic Galaxy Background -->
  <GalaxyBg />

  <!-- Interactive Smooth Glass Cursor -->
  <GlassCursor />

  <!-- Floating Glass Navbar -->
  <AppHeader />

  <!-- Main Body Content -->
  <AppBody />
</template>

<style>
/* Global cosmic reset */
html, body {
  background-color: #04060e;
  color: #f8fafc;
  min-height: 100vh;
}
</style>
