<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  url?: string
  icon?: string        // SVG string (opcional, usa uno genérico si no se pasa)
  accent?: 'teal' | 'indigo' | 'orange'
}

const props = defineProps<{ project: Project }>()

const accent = props.project.accent ?? 'teal'

const accentStyles = {
  teal: {
    bar:    'bg-gradient-to-r from-teal-400 to-teal-600',
    icon:   'bg-teal-500/10 text-teal-500 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white',
    tag:    'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    link:   'text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300',
    glow:   'group-hover:shadow-teal-500/10',
    border: 'group-hover:border-teal-300 dark:group-hover:border-teal-800',
  },
  indigo: {
    bar:    'bg-gradient-to-r from-indigo-400 to-indigo-600',
    icon:   'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white',
    tag:    'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    link:   'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300',
    glow:   'group-hover:shadow-indigo-500/10',
    border: 'group-hover:border-indigo-300 dark:group-hover:border-indigo-800',
  },
  orange: {
    bar:    'bg-gradient-to-r from-orange-400 to-orange-500',
    icon:   'bg-orange-500/10 text-orange-500 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white',
    tag:    'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    link:   'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300',
    glow:   'group-hover:shadow-orange-500/10',
    border: 'group-hover:border-orange-300 dark:group-hover:border-orange-800',
  },
}

const s = accentStyles[accent]

const defaultIcon = `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`
</script>

<template>
  <article
    class="group relative bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    :class="[s.glow, s.border]"
  >
    <!-- Top accent bar -->
    <div class="h-1 w-full" :class="s.bar"></div>

    <!-- Card body -->
    <div class="p-6 flex flex-col flex-1">
      <!-- Icon + title row -->
      <div class="flex items-start gap-4 mb-4">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          :class="s.icon"
        >
          <span class="w-6 h-6" v-html="project.icon ?? defaultIcon"></span>
        </div>
        <div class="min-w-0 pt-0.5">
          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug transition-colors">
            {{ project.title }}
          </h3>
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-5 flex-1">
        {{ project.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-5">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="text-xs px-2 py-0.5 rounded border font-medium"
          :class="s.tag"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Link -->
      <div class="border-t border-slate-100 dark:border-gray-800 pt-4 mt-auto">
        <a
          v-if="project.url && project.url !== '#'"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          :class="s.link"
        >
          {{ t('projects.viewProject') }}
          <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
        <span v-else class="text-xs text-slate-400 dark:text-gray-600 italic">
          {{ t('projects.comingSoon') }}
        </span>
      </div>
    </div>
  </article>
</template>
