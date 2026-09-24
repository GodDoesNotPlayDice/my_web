<script setup lang="ts">
import { onMounted } from 'vue'
import { Notivue, Notification, darkTheme } from 'notivue'
import AppBody from './components/layouts/AppBody.vue'
import AppHeader from './components/layouts/AppHeader.vue'
import GalaxyBg from './components/fx/GalaxyBg.vue'
import GlassCursor from './components/fx/GlassCursor.vue'

onMounted(() => {
  // Ensure dark cosmic mode is enabled by default
  document.documentElement.classList.add('dark')
})
</script>

<template>
  <!-- Notivue Toast Notifications -->
  <Notivue v-slot="item">
    <Notification :item="item" :theme="darkTheme" />
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
