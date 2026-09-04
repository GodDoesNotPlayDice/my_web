<script setup lang="ts">
import { Notivue, Notification } from 'notivue'
import AppBody from './components/layouts/AppBody.vue';
import AppHeader from './components/layouts/AppHeader.vue';
</script>

<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <AppHeader />
  <AppBody />
</template>
