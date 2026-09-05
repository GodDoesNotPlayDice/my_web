<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import AppThemeSwitch from "../ui/AppThemeSwitch.vue";

const { t, locale } = useI18n();

const isDark = ref(document.documentElement.classList.contains('dark'));
const mobileMenuOpen = ref(false);

function toggleTheme(value: boolean) {
  isDark.value = value;
  document.documentElement.classList.toggle('dark', value);
}

function scrollToSection(id: string) {
  mobileMenuOpen.value = false;
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, 200);
}

const navigationLinks = computed(() => [
  { id: 1, name: t("nav.home"),         hash: "hero" },
  { id: 2, name: t("nav.about"),        hash: "about" },
  { id: 3, name: t("nav.education"),    hash: "education" },
  { id: 4, name: t("nav.skills"),       hash: "skills" },
  { id: 5, name: t("nav.experience"),   hash: "experience" },
  { id: 6, name: t("nav.projects"),     hash: "projects" },
  { id: 7, name: t("nav.certificates"), hash: "certificates" },
  { id: 8, name: t("nav.contact"),      hash: "contact" },
]);
</script>

<template>
  <!-- Sidebar overlay backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
      @click="mobileMenuOpen = false"
    />
  </Transition>

  <!-- Sidebar drawer -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-250 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="mobileMenuOpen"
      class="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col dark:bg-[#0d1117] bg-white shadow-2xl"
    >
      <!-- Sidebar header -->
      <div class="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-gray-800">
        <span class="text-lg font-extrabold bg-linear-to-r from-teal-400 via-indigo-500 to-orange-300 text-transparent bg-clip-text">
          V.V
        </span>
        <button
          @click="mobileMenuOpen = false"
          class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Cerrar menú"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 overflow-y-auto px-4 py-5">
        <ul class="flex flex-col gap-1">
          <li v-for="link in navigationLinks" :key="link.id">
            <a
              :href="`#${link.hash}`"
              @click.prevent="scrollToSection(link.hash)"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 group"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-teal-400/50 group-hover:bg-teal-500 transition-colors flex-shrink-0"></span>
              {{ link.name }}
              <svg class="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Sidebar footer: lang + contact -->
      <div class="px-5 py-5 border-t border-slate-100 dark:border-gray-800 flex flex-col gap-3">
        <select
          v-model="locale"
          class="w-full bg-slate-50 dark:bg-[#13131f] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-teal-500 cursor-pointer text-sm transition-colors"
        >
          <option value="es" class="text-black">🌐 Español</option>
          <option value="en" class="text-black">🌐 English</option>
        </select>
        <button
          @click="scrollToSection('contact')"
          class="w-full bg-[#20b2aa] hover:bg-teal-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          {{ t("buttons.contact") }}
        </button>
      </div>
    </aside>
  </Transition>

  <!-- ─── Sticky header ────────────────────────────────────────────── -->
  <header class="sticky top-0 z-30 dark:bg-[#0b0f19]/95 bg-white/95 backdrop-blur-sm border-b border-slate-100 dark:border-gray-900 transition-colors duration-300">
    <div class="flex items-center gap-6 px-5 md:px-8 py-4">

      <!-- Logo -->
      <h2 class="text-xl md:text-2xl font-extrabold bg-linear-to-r from-teal-400 via-indigo-500 to-orange-300 text-transparent bg-clip-text hover:scale-105 transition-transform duration-300 cursor-pointer flex-shrink-0">
        <a @click.prevent="scrollToSection('hero')" href="#hero">V.V</a>
      </h2>

      <!-- Desktop nav — left, beside logo -->
      <nav class="hidden lg:block">
        <ul class="flex gap-5 text-[14px]">
          <li v-for="link in navigationLinks" :key="link.id">
            <a
              :href="`#${link.hash}`"
              @click.prevent="scrollToSection(link.hash)"
              class="relative pb-1 dark:text-gray-300 text-gray-600 hover:text-teal-500 dark:hover:text-teal-400 transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-teal-500 dark:after:bg-teal-400 after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300 after:ease-out"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- Spacer: pushes controls to the right -->
      <div class="flex-1"></div>

      <!-- Desktop controls -->
      <div class="hidden md:flex items-center gap-3 flex-shrink-0">
        <select
          v-model="locale"
          class="bg-transparent text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 outline-none focus:border-teal-500 cursor-pointer text-sm transition-colors"
        >
          <option value="es" class="text-black">ES</option>
          <option value="en" class="text-black">EN</option>
        </select>
        <AppThemeSwitch :model-value="isDark" @update:model-value="toggleTheme" />
        <button
          @click="scrollToSection('contact')"
          class="hidden lg:block bg-[#20b2aa] hover:bg-teal-500 text-white px-4 py-2 rounded font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5"
        >
          {{ t("buttons.contact") }}
        </button>
      </div>

      <!-- Mobile right: theme + burger -->
      <div class="flex md:hidden items-center gap-3 flex-shrink-0">
        <AppThemeSwitch :model-value="isDark" @update:model-value="toggleTheme" />
        <button
          @click="mobileMenuOpen = true"
          class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Abrir menú"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>