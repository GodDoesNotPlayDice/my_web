<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Globe3D, { type TechItem } from '../fx/Globe3D.vue'

const { t, tm } = useI18n()

const activeCategory = ref<string>('all')
const selectedTechInfo = ref<TechItem | null>(null)

function onSelectTech(tech: TechItem | null) {
  selectedTechInfo.value = tech
}

const filterTabs = [
  { id: 'all' },
  { id: 'frontend' },
  { id: 'backend' },
  { id: 'database' },
  { id: 'devops' },
  { id: 'architecture' },
]

interface SkillCategory {
  key: string
  color: string
  skills: string[]
}

const categories = computed<SkillCategory[]>(() => [
  {
    key: 'frontend',
    color: 'cyan',
    skills: ['Vue.js 3', 'TypeScript', 'Nuxt 3', 'Tailwind CSS', 'JavaScript (ES6+)', 'GSAP Motion', 'HTML5 & Responsive CSS'],
  },
  {
    key: 'backend',
    color: 'indigo',
    skills: ['Python', 'FastAPI', 'Django (BFF)', 'REST APIs', 'Node.js', 'Batch Processing', 'Kappa Architecture'],
  },
  {
    key: 'databases',
    color: 'amber',
    skills: ['Supabase (PostgreSQL)', 'PostgreSQL', 'MongoDB', 'MySQL', 'Data Modeling', 'ORMs & Query Tuning'],
  },
  {
    key: 'devops',
    color: 'emerald',
    skills: ['Linux (Native Env)', 'Docker', 'Google Cloud (GCP)', 'Netlify CI/CD', 'Git / GitHub Actions', 'Resend API'],
  },
  {
    key: 'tools',
    color: 'purple',
    skills: ['Clean Architecture', 'DDD (Domain-Driven Design)', 'Playwright Automation', 'Web Scraping', 'Unit & E2E Testing'],
  },
  {
    key: 'soft',
    color: 'cyan',
    skills: (tm('skills.softList') as string[]) || ['Comunicación', 'Liderazgo', 'Trabajo en Equipo', 'Autodidacta', 'Inglés B1-B2'],
  },
])

const accentStyles: Record<string, { border: string; glow: string; badge: string; dot: string }> = {
  cyan: {
    border: 'border-cyan-500/25 hover:border-cyan-400/60',
    glow: 'hover:shadow-[0_0_24px_rgba(0,217,255,0.12)]',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400 shadow-[0_0_8px_#00d9ff]',
  },
  indigo: {
    border: 'border-indigo-500/25 hover:border-indigo-400/60',
    glow: 'hover:shadow-[0_0_24px_rgba(99,102,241,0.12)]',
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    dot: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
  },
  amber: {
    border: 'border-amber-500/25 hover:border-amber-400/60',
    glow: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
  },
  emerald: {
    border: 'border-emerald-500/25 hover:border-emerald-400/60',
    glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
  },
  purple: {
    border: 'border-purple-500/25 hover:border-purple-400/60',
    glow: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.12)]',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    dot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
  },
}
</script>

<template>
  <section id="skills" class="py-24 md:py-32 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-5 md:px-8 relative z-10 skills-content">

      <!-- Section Header with Cyber Monospace Kicker -->
      <div class="text-center mb-10 md:mb-14">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          {{ t('skills.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('skills.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('skills.subtitle') }}
        </p>
      </div>

      <!-- 3D Interactive Tech Globe Container -->
      <div
        class="relative w-full rounded-2xl sm:rounded-3xl bg-[#070b18]/70 border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_60px_rgba(0,217,255,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] p-1 sm:p-6 mb-12 overflow-hidden"
      >
        <!-- Category Filter Pills on top of Globe -->
        <div class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2 pb-3 px-1 sm:px-2 z-20 relative">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            @click="activeCategory = tab.id"
            class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-medium transition-all duration-200 border"
            :class="activeCategory === tab.id
              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,217,255,0.25)]'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="activeCategory === tab.id ? 'bg-cyan-400 shadow-[0_0_6px_#00d9ff]' : 'bg-slate-600'"
            />
            <span>{{ t('skills.filterTabs.' + tab.id) }}</span>
          </button>
        </div>

        <!-- 3D Globe Component -->
        <Globe3D
          :selected-category="activeCategory"
          @select-tech="onSelectTech"
        />
      </div>

      <!-- Categorized Tech Stack Grid (Without skill counts) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="group rounded-2xl bg-[#090f1e]/80 backdrop-blur-md border p-6 transition-all duration-300 flex flex-col justify-between"
          :class="[accentStyles[cat.color].border, accentStyles[cat.color].glow]"
        >
          <div>
            <!-- Category Header -->
            <div class="flex items-center gap-2.5 mb-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="accentStyles[cat.color].dot" />
              <h3 class="font-mono font-bold text-base sm:text-lg text-white uppercase tracking-wider">
                {{ t(`skills.categories.${cat.key}`) }}
              </h3>
            </div>

            <!-- Description -->
            <p class="text-xs text-slate-400 leading-relaxed mb-5 font-sans">
              {{ t(`skills.categoryDescriptions.${cat.key}`) }}
            </p>
          </div>

          <!-- Skills Badges Array -->
          <div class="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
            <span
              v-for="skill in cat.skills"
              :key="skill"
              class="text-xs font-mono px-2.5 py-1 rounded-lg border transition-all duration-200 cursor-default"
              :class="[
                accentStyles[cat.color].badge,
                'hover:scale-105 hover:bg-white/10 hover:text-white',
              ]"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
