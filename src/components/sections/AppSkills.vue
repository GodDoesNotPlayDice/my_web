<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

interface SkillCategory {
  key: string
  icon: string
  color: string
  skills: string[]
}

import { computed } from 'vue'

const categories = computed<SkillCategory[]>(() => [
  {
    key: 'frontend',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/></svg>`,
    color: 'teal',
    skills: ['TypeScript', 'Vue.js', 'Tailwind'],
  },
  {
    key: 'backend',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg>`,
    color: 'indigo',
    skills: ['Python', 'FastAPI', 'Django (BFF)', 'JavaScript', 'REST APIs', 'Nuxt'],
  },
  {
    key: 'databases',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>`,
    color: 'orange',
    skills: ['Supabase', 'MongoDB', 'MySQL'],
  },
  {
    key: 'devops',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>`,
    color: 'teal',
    skills: ['Linux (nativo)', 'GCP', 'Netlify', 'Arquitectura Batch', 'Arquitectura Kappa'],
  },
  {
    key: 'tools',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    color: 'indigo',
    skills: ['Git', 'Playwright', 'Web Scraping', 'Clean Architecture', 'DDD'],
  },
  {
    key: 'soft',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`,
    color: 'teal',
    skills: tm('skills.softList') as string[],
  },
])

const colorMap: Record<string, { card: string; badge: string; chip: string }> = {
  teal: {
    card: 'border-teal-200 dark:border-teal-900/40 hover:border-teal-400 dark:hover:border-teal-700',
    badge: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    chip: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  },
  indigo: {
    card: 'border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-700',
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    chip: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  },
  orange: {
    card: 'border-orange-200 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-700',
    badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    chip: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  },
}
</script>

<template>
  <section id="skills" class="py-16 md:py-24 bg-white dark:bg-[#0b0f19] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-5 md:px-8 skills-content">

      <!-- Header -->
      <div class="mb-10 md:mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('skills.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-4 md:mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors text-sm md:text-base">
          {{ t('skills.subtitle') }}
        </p>
      </div>

      <!-- Categories grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="bg-white dark:bg-[#13131f] rounded-xl border p-6 transition-all duration-300 skill-card"
          :class="colorMap[cat.color].card"
        >
          <!-- Category header -->
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="colorMap[cat.color].badge"
            >
              <span class="w-5 h-5" v-html="cat.icon"></span>
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white">
              {{ t(`skills.categories.${cat.key}`) }}
            </h3>
          </div>

          <!-- Skill chips -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in cat.skills"
              :key="skill"
              class="text-xs px-2.5 py-1.5 rounded-md border font-medium"
              :class="colorMap[cat.color].chip"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
