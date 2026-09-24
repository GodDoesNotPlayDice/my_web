<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard, { type Project } from './ProjectCard.vue'

const { t, tm } = useI18n()

interface ProjectData {
  title: string
  description: string
}

const staticProjects = [
  {
    id: 1,
    tags: ['Vue 3', 'Nuxt 3', 'TypeScript', 'Python', 'FastAPI', 'Supabase', 'Resend', 'TailwindCSS'],
    url: 'https://www.mager.cl/',
    accent: 'cyan' as const,
  },
  {
    id: 2,
    tags: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Supabase', 'Netlify CI/CD', 'Resend', 'TailwindCSS'],
    url: 'https://lanascurauma.cl/',
    accent: 'orange' as const,
  },
  {
    id: 3,
    tags: ['Python', 'Playwright', 'Clean Architecture', 'DDD', 'MongoDB', 'Batch Processing'],
    url: '#',
    accent: 'indigo' as const,
  },
  {
    id: 4,
    tags: ['Vue 3', 'Nuxt', 'TypeScript', 'Supabase', 'PWA', 'GSAP Animations', 'AI Integration'],
    url: 'https://yozhlearning.netlify.app/',
    accent: 'purple' as const,
  },
]

const projects = computed(() => {
  const translations = (tm('projects.items') as ProjectData[]) || []
  const highlights = (tm('projects.highlights') as string[]) || []

  return translations.map((item, index) => ({
    ...item,
    ...staticProjects[index],
    architectureHighlight: highlights[index] || '',
  })) as Project[]
})
</script>

<template>
  <section id="projects" class="py-24 md:py-32 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-5 md:px-8 relative z-10 projects-content">

      <!-- Section Header -->
      <div class="text-center mb-12 md:mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          {{ t('projects.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('projects.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('projects.subtitle') }}
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>

    </div>
  </section>
</template>
