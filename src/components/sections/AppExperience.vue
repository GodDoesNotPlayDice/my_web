<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { computed } from 'vue'

const { t, tm } = useI18n()

interface ExperienceItemData {
  period: string
  title: string
  company?: string
  description: string
}

interface ExperienceItemStatic {
  tags: string[]
  icon: string
  accent: 'teal' | 'indigo' | 'orange'
  inProgress?: boolean
}

const staticItems: ExperienceItemStatic[] = [
  {
    tags: ['HTML', 'CSS', 'JavaScript', 'Python'],
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
    accent: 'teal',
  },
  {
    tags: ['Vue.js', 'Python', 'FastAPI', 'Arquitectura de Software', 'Ciencia de Datos'],
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>`,
    accent: 'indigo',
  },
  {
    tags: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase'],
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
    accent: 'teal',
  },
  {
    tags: ['Nuxt', 'TypeScript', 'Netlify', 'Resend', 'Supabase'],
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
    accent: 'orange',
  },
  {
    tags: ['Python', 'Playwright', 'Clean Architecture', 'DDD', 'MongoDB'],
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
    accent: 'indigo',
  },
  {
    tags: ['Vue.js', 'Nuxt', 'Python', 'FastAPI', 'Supabase'],
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>`,
    accent: 'teal',
    inProgress: true,
  },
]

const items = computed(() => {
  const translations = tm('experience.items') as ExperienceItemData[]
  return translations.map((item, index) => ({
    ...item,
    ...staticItems[index]
  }))
})

const accentMap = {
  teal: {
    dot: 'bg-[#20b2aa] shadow-teal-500/30',
    badge: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    tag: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    border: 'hover:border-teal-300 dark:hover:border-teal-800',
  },
  indigo: {
    dot: 'bg-indigo-500 shadow-indigo-500/30',
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    tag: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    border: 'hover:border-indigo-300 dark:hover:border-indigo-800',
  },
  orange: {
    dot: 'bg-orange-400 shadow-orange-400/30',
    badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    tag: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    border: 'hover:border-orange-300 dark:hover:border-orange-800',
  },
}
</script>

<template>
  <section id="experience" class="py-16 md:py-24 bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-5 md:px-8 experience-content">

      <!-- Header -->
      <div class="mb-10 md:mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('experience.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-4 md:mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors text-sm md:text-base">
          {{ t('experience.subtitle') }}
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Vertical line -->
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-indigo-500 to-orange-300 hidden md:block"></div>

        <div class="flex flex-col gap-8">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="relative flex gap-4 md:gap-8 exp-item"
          >
            <!-- Dot -->
            <div class="hidden md:flex flex-col items-center flex-shrink-0">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10"
                :class="accentMap[item.accent].dot"
              >
                <span class="w-5 h-5 text-white" v-html="item.icon"></span>
              </div>
            </div>

            <!-- Card -->
            <div
              class="flex-1 bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 p-4 md:p-6 shadow-sm transition-all duration-300"
              :class="accentMap[item.accent].border"
            >
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ item.title }}</h3>
                  <p v-if="item.company" class="text-sm text-slate-500 dark:text-gray-500 mt-0.5">{{ item.company }}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span
                    class="text-xs font-semibold px-3 py-1 rounded-full"
                    :class="accentMap[item.accent].badge"
                  >
                    {{ item.period }}
                  </span>
                  <span
                    v-if="item.inProgress"
                    class="inline-flex items-center gap-1 text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full"
                  >
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    {{ t('experience.inProgress') }}
                  </span>
                </div>
              </div>

              <p class="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {{ item.description }}
              </p>


            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
