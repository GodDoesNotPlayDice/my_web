<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const { t } = useI18n();

const isDark = ref(false);
const isMobile = ref(false);
const nameElement = ref(null);

onMounted(() => {
  isDark.value = document.documentElement.classList.contains("dark");
  isMobile.value = window.innerWidth < 768;

  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // GSAP Typewriter animation
  gsap.fromTo(
    nameElement.value,
    { text: "" },
    {
      duration: 1.5,
      text: t("hero.name") + t("hero.portfolio"),
      ease: "none",
      delay: 0.3,
    }
  );
});

watch(() => t("hero.name") + t("hero.portfolio"), (newText) => {
  gsap.fromTo(
    nameElement.value,
    { text: "" },
    {
      duration: 1.5,
      text: newText,
      ease: "none",
    }
  );
});


// Particles tuned for mobile visibility
const particlesOptions = computed(() => {
  const mobile = isMobile.value;
  return {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    particles: {
      color: { value: isDark.value ? "#ffffff" : "#0f172a" },
      links: {
        enable: true,
        color: isDark.value ? "#94a3b8" : "#334155",
        distance: mobile ? 100 : 150,
        opacity: isDark.value ? (mobile ? 0.5 : 0.35) : (mobile ? 0.8 : 0.65),
        width: isDark.value ? (mobile ? 1 : 1.5) : (mobile ? 1.5 : 2),
      },
      move: {
        enable: true,
        speed: mobile ? 0.8 : 1,
        direction: "none",
        random: true,
        outModes: "bounce",
      },
      // More particles on mobile, denser area
      number: {
        value: mobile ? 80 : 100,
        density: { enable: true, area: mobile ? 400 : 800 },
      },
      opacity: { value: isDark.value ? (mobile ? 0.55 : 0.3) : (mobile ? 0.8 : 0.6) },
      size: { value: { min: mobile ? 2 : 1, max: mobile ? 3.5 : 2 } },
    },
    interactivity: {
      events: { onHover: { enable: !mobile, mode: "grab" } },
      modes: { grab: { distance: 140, links: { opacity: 0.5 } } },
    },
  };
});

function scrollToProjects() {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0f0f16] overflow-hidden transition-colors duration-300 px-4"
  >
    <vue-particles
      id="tsparticles"
      :key="isDark"
      :options="particlesOptions"
      class="absolute inset-0 z-0 pointer-events-auto"
    />

    <div class="relative z-10 text-center flex flex-col items-center hero-content w-full max-w-3xl">
      <h3 class="text-[#20b2aa] text-base md:text-xl font-medium tracking-wide mb-3 md:mb-4">
        {{ t("hero.subtitle") }}
      </h3>

      <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight leading-tight flex justify-center items-center flex-wrap">
        <span ref="nameElement" class="bg-linear-to-r from-teal-400 via-indigo-500 to-orange-300 text-transparent bg-clip-text min-h-[1.2em]"></span>
        <span class="inline-block w-[3px] sm:w-[4px] md:w-[6px] h-[0.9em] bg-teal-500 ml-1 sm:ml-2 animate-pulse mt-1"></span>
      </h1>

      <p class="text-slate-600 dark:text-gray-400 text-base md:text-lg max-w-xl md:max-w-2xl mb-8 md:mb-10 transition-colors duration-300 px-2">
        {{ t("hero.description") }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          @click="scrollToProjects"
          class="bg-[#20b2aa] hover:bg-teal-500 text-white px-6 py-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {{ t("hero.viewProjects") }} <span>→</span>
        </button>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 w-full h-32 md:h-40 bg-gradient-to-b from-transparent to-white dark:to-[#0b0f19] pointer-events-none z-20"></div>
  </section>
</template>