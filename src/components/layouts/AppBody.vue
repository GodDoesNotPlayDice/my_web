<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue';
import AppHero from '../sections/AppHero.vue';
import AppAbout from '../sections/AppAbout.vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let tl: any = null;
let triggerInstance: any = null;

onMounted(async () => {
  await nextTick();

  gsap.set('#about .about-content', { opacity: 0, y: 60, scale: 0.98 });

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 90%',
      toggleActions: 'play none none none',
      markers: false,
    }
  });

  tl.to('#about .about-content', { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' })
    .from('#about .about-content > *', { opacity: 0, y: 20, stagger: 0.08, duration: 0.6, ease: 'power2.out' }, '-=0.6');
});

onBeforeUnmount(() => {
  try {
    if (triggerInstance && typeof triggerInstance.kill === 'function') triggerInstance.kill();
    if (tl && typeof tl.kill === 'function') tl.kill();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  } catch (e) {
  }
});
</script>
<template>
  <main class="dark:bg-[#0b0f19] bg-white min-h-screen">
    <AppHero />
    <AppAbout />
    
  </main>
</template>

<style scoped></style>


