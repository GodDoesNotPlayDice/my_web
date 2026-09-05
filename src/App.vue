<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Notivue, Notification, lightTheme, darkTheme } from 'notivue'
import AppBody from './components/layouts/AppBody.vue';
import AppHeader from './components/layouts/AppHeader.vue';

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains("dark");
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
})
</script>

<template>
  <Notivue v-slot="item">
    <Notification :item="item" :theme="isDark ? darkTheme : lightTheme" />
  </Notivue>
  <AppHeader />
  <AppBody />
</template>
