<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

interface ExperienceItemData {
  period: string
  title: string
  company?: string
  description: string
}

interface ExperienceItemStatic {
  tags: string[]
  accent: 'cyan' | 'purple' | 'amber' | 'emerald'
  inProgress?: boolean
}

const staticItems: ExperienceItemStatic[] = [
  {
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Python'],
    accent: 'cyan',
  },
  {
    tags: ['Ingeniería Informática', 'Duoc UC', 'Ciencia de Datos', '2 Distinciones'],
    accent: 'purple',
  },
  {
    tags: ['Vue.js 3', 'Nuxt 3', 'Python', 'FastAPI', 'Supabase', 'Resend'],
    accent: 'cyan',
  },
  {
    tags: ['Nuxt 3', 'TypeScript', 'Netlify CI/CD', 'Resend', 'Supabase'],
    accent: 'amber',
  },
  {
    tags: ['Python', 'Playwright', 'Clean Architecture', 'DDD', 'MongoDB'],
    accent: 'emerald',
  },
  {
    tags: ['Vue 3', 'Nuxt', 'Supabase', 'PWA', 'GSAP', 'AI Engine'],
    accent: 'purple',
    inProgress: true,
  },
]

const items = computed(() => {
  const translations = (tm('experience.items') as ExperienceItemData[]) || []
  const badges = (tm('experience.typeBadges') as string[]) || []
  const tagsList = (tm('experience.tagLists') as string[][]) || []

  return translations.map((item, index) => ({
    ...item,
    ...staticItems[index],
    tags: tagsList[index] || staticItems[index]?.tags || [],
    typeBadge: badges[index] || '',
  }))
})

const accentStyles: Record<string, { dot: string; badge: string; border: string; glow: string }> = {
  cyan: {
    dot: 'bg-cyan-400 shadow-[0_0_12px_#00d9ff]',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    border: 'hover:border-cyan-400/50',
    glow: 'hover:shadow-[0_0_24px_rgba(0,217,255,0.12)]',
  },
  purple: {
    dot: 'bg-purple-400 shadow-[0_0_12px_#a78bfa]',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    border: 'hover:border-purple-400/50',
    glow: 'hover:shadow-[0_0_24px_rgba(167,139,250,0.12)]',
  },
  amber: {
    dot: 'bg-amber-400 shadow-[0_0_12px_#f59e0b]',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    border: 'hover:border-amber-400/50',
    glow: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]',
  },
  emerald: {
    dot: 'bg-emerald-400 shadow-[0_0_12px_#10b981]',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    border: 'hover:border-emerald-400/50',
    glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]',
  },
}
</script>

<template>
  <section id="experience" class="py-24 md:py-32 relative overflow-hidden">
    <div class="max-w-5xl mx-auto px-5 md:px-8 relative z-10 experience-content">

      <!-- Section Header -->
      <div class="text-center mb-14 md:mb-18">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          {{ t('experience.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('experience.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('experience.subtitle') }}
        </p>
      </div>

      <!-- High-Tech Circuit Timeline -->
      <div class="relative">
        <!-- Glowing vertical circuit spine -->
        <div class="absolute left-4 md:left-8 top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-indigo-600 shadow-[0_0_10px_rgba(0,217,255,0.4)]" />

        <div class="space-y-8 md:space-y-10">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="relative flex items-start gap-6 md:gap-10 exp-item group"
          >
            <!-- Timeline Pulsing Node -->
            <div class="relative flex items-center justify-center shrink-0 w-8 md:w-16 pt-1.5">
              <div
                class="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#050711] z-10 transition-transform duration-300 group-hover:scale-125"
                :class="accentStyles[item.accent].dot"
              />
              <span
                v-if="item.inProgress"
                class="absolute w-8 h-8 rounded-full bg-purple-500/40 animate-ping"
              />
            </div>

            <!-- Experience Card -->
            <div
              class="flex-1 p-6 sm:p-7 rounded-2xl bg-[#090f1f]/80 backdrop-blur-xl border border-white/10 transition-all duration-300 flex flex-col justify-between"
              :class="[accentStyles[item.accent].border, accentStyles[item.accent].glow]"
            >
              <!-- Card Header -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
                <div>
                  <span
                    v-if="item.typeBadge"
                    class="inline-block text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider mb-1.5"
                    :class="accentStyles[item.accent].badge"
                  >
                    {{ item.typeBadge }}
                  </span>
                  <h3 class="text-lg sm:text-xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                    {{ item.title }}
                  </h3>
                  <p v-if="item.company" class="text-xs font-mono text-cyan-400 mt-0.5">
                    {{ item.company }}
                  </p>
                </div>

                <!-- Period & In Progress Badge -->
                <div class="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span class="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {{ item.period }}
                  </span>
                  <span
                    v-if="item.inProgress"
                    class="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {{ t('experience.inProgress') }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <p class="text-sm text-slate-300 leading-relaxed mb-4 font-sans">
                {{ item.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/[0.03] border border-white/5 text-slate-400"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
