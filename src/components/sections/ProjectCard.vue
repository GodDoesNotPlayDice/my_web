<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  url?: string
  accent?: 'teal' | 'indigo' | 'orange' | 'cyan' | 'purple'
  architectureHighlight?: string
}

const props = defineProps<{ project: Project }>()

const accentMap: Record<string, { bar: string; border: string; glow: string; link: string }> = {
  teal: {
    bar: 'from-cyan-400 to-teal-500',
    border: 'hover:border-cyan-400/60',
    glow: 'hover:shadow-[0_0_30px_rgba(0,217,255,0.15)]',
    link: 'text-cyan-400 hover:text-cyan-300',
  },
  cyan: {
    bar: 'from-cyan-400 to-blue-500',
    border: 'hover:border-cyan-400/60',
    glow: 'hover:shadow-[0_0_30px_rgba(0,217,255,0.15)]',
    link: 'text-cyan-400 hover:text-cyan-300',
  },
  indigo: {
    bar: 'from-indigo-400 to-purple-500',
    border: 'hover:border-indigo-400/60',
    glow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]',
    link: 'text-indigo-400 hover:text-indigo-300',
  },
  purple: {
    bar: 'from-purple-400 to-pink-500',
    border: 'hover:border-purple-400/60',
    glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    link: 'text-purple-400 hover:text-purple-300',
  },
  orange: {
    bar: 'from-amber-400 to-orange-500',
    border: 'hover:border-amber-400/60',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    link: 'text-amber-400 hover:text-amber-300',
  },
}

const currentAccent = accentMap[props.project.accent ?? 'teal'] || accentMap.teal
</script>

<template>
  <article
    class="group relative rounded-2xl bg-[#090f1f]/80 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
    :class="[currentAccent.border, currentAccent.glow]"
  >
    <!-- Top Glowing Accent Bar -->
    <div class="h-1 w-full bg-gradient-to-r" :class="currentAccent.bar" />

    <!-- Corner Crosshairs/Brackets -->
    <div class="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/20 group-hover:border-cyan-400/60 transition-colors" />
    <div class="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/20 group-hover:border-cyan-400/60 transition-colors" />

    <!-- Card Content -->
    <div class="p-6 sm:p-7 flex flex-col flex-1">
      <!-- Title -->
      <h3 class="text-xl font-bold font-mono text-white mb-3 group-hover:text-cyan-300 transition-colors">
        {{ project.title }}
      </h3>

      <!-- Architecture Highlight Callout without emoji or 'arch' -->
      <div
        v-if="project.architectureHighlight"
        class="mb-4 px-3.5 py-2 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/20 text-xs font-mono text-cyan-300 leading-relaxed"
      >
        {{ project.architectureHighlight }}
      </div>

      <!-- Description -->
      <p class="text-sm text-slate-300 leading-relaxed mb-6 flex-1 font-sans">
        {{ project.description }}
      </p>

      <!-- Tech Tags -->
      <div class="flex flex-wrap gap-1.5 mb-6">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 group-hover:border-white/20 transition-colors"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Link Footer -->
      <div class="pt-4 border-t border-white/10 mt-auto flex items-center justify-between">
        <a
          v-if="project.url && project.url !== '#'"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          :class="currentAccent.link"
        >
          <span>{{ t('projects.viewProject') }}</span>
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <span v-else class="text-xs font-mono text-slate-500 italic">
          {{ t('projects.comingSoon') }}
        </span>

        <span class="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
          {{ t('projects.activeBadge') }}
        </span>
      </div>
    </div>
  </article>
</template>
