<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
};

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});

const navigationLinks = computed(() => [
  { id: 1, name: t("nav.home"), url: "#hero" },
  { id: 2, name: t("nav.about"), url: "#about" },
  { id: 3, name: t("nav.education"), url: "#education" },
  { id: 4, name: t("nav.skills"), url: "#skills" },
  { id: 5, name: t("nav.experience"), url: "#experience" },
  { id: 6, name: t("nav.projects"), url: "#projects" },
  { id: 7, name: t("nav.certificates"), url: "#certificates" },
  { id: 8, name: t("nav.contact"), url: "#contact" },
]);
</script>

<template>
  <header
    class="sticky top-0 z-50 dark:bg-[#0b0f19] bg-white flex items-center justify-between px-8 py-5"
  >
    <div class="flex items-center gap-10">
      <h2
        class="text-2xl font-extrabold bg-linear-to-r from-teal-400 via-indigo-500 to-orange-300 text-transparent bg-clip-text hover:scale-110 ease-in-out transition-transform duration-300"
      >
        <a href="#hero">Portafolio</a>
      </h2>

      <nav>
        <ul class="flex gap-6 text-[15px]">
          <li v-for="link in navigationLinks" :key="link.id">
            <a
              :href="link.url"
              class="relative pb-1 dark:text-gray-300 text-gray-600 hover:text-teal-500 dark:hover:text-teal-400 transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-teal-500 dark:after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300 after:ease-out"
              :class="{
                'dark:text-teal-400 text-teal-500 after:scale-x-100':
                  link.id === 1,
              }"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="flex items-center gap-4">
      
      <select 
        v-model="locale" 
        class="bg-transparent text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 outline-none focus:border-teal-500 cursor-pointer text-sm transition-colors"
      >
        <option value="es" class="text-black">ES</option>
        <option value="en" class="text-black">EN</option>
      </select>

      <button 
        @click="toggleTheme"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
        aria-label="Alternar modo oscuro"
      >
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <button
        class="bg-[#20b2aa] hover:bg-teal-500 text-white px-5 py-2 rounded font-medium transition-colors ml-2"
      >
        {{ t("buttons.contact") }}
      </button>
    </div>
  </header>
</template>