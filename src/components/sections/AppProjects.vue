<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProjectCard from './ProjectCard.vue'
import type { Project } from './ProjectCard.vue'

import { computed } from 'vue'

const { t, tm } = useI18n()

interface ProjectData {
  title: string
  description: string
}

const staticProjects = [
  {
    id: 1,
    tags: ['Vue.js', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase'],
    url: '#',
    accent: 'teal' as const,
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
  },
  {
    id: 2,
    tags: ['Nuxt', 'TypeScript', 'Netlify', 'Resend', 'Supabase'],
    url: 'https://lanascurauma.cl',
    accent: 'orange' as const,
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
  },
  {
    id: 3,
    tags: ['Python', 'Playwright', 'Clean Architecture', 'DDD', 'MongoDB'],
    url: '#',
    accent: 'indigo' as const,
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
  },
  {
    id: 4,
    tags: ['Vue.js', 'Nuxt', 'Python', 'FastAPI', 'Supabase'],
    url: '#',
    accent: 'teal' as const,
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>`,
  },
]

const projects = computed(() => {
  const translations = tm('projects.items') as ProjectData[]
  return translations.map((item, index) => ({
    ...item,
    ...staticProjects[index]
  })) as Project[]
})
</script>

<template>
  <section id="projects" class="py-16 md:py-24 bg-white dark:bg-[#0b0f19] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-5 md:px-8 projects-content">

      <!-- Header -->
      <div class="mb-10 md:mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('projects.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-4 md:mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors text-sm md:text-base">
          {{ t('projects.subtitle') }}
        </p>
      </div>

      <!-- Projects gallery grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>
