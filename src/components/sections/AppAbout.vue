<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const icons = [
  // lucide:zap (Speed & Clean Architecture)
  `<svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
  // lucide:globe (Modern Web & Reactive Ecosystem)
  `<svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  // lucide:bar-chart-3 (Data Science & Analytics)
  `<svg class="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
  // lucide:rocket (Production Scaling & Delivery)
  `<svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
]

const engineeringPillars = computed(() => {
  const items = (tm('about.pillars') as Array<{ title: string; desc: string }>) || []
  return items.map((p, idx) => ({
    ...p,
    icon: icons[idx] || icons[0],
  }))
})
</script>

<template>
  <section id="about" class="py-24 md:py-32 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-5 md:px-8 relative z-10 about-content">

      <!-- Section Header -->
      <div class="text-center mb-14 md:mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          {{ t('about.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('about.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('about.subtitle') }}
        </p>
      </div>

      <!-- Main Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        <!-- Left Bento Card: Bio & Location (7 cols) -->
        <div class="lg:col-span-7 flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#080e1d]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,217,255,0.05)] relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
          <div class="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-400/40" />

          <div>
            <!-- Location Badge -->
            <div class="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4 uppercase">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ t('about.location') }}</span>
            </div>

            <!-- Role Title -->
            <h3 class="text-2xl font-bold font-mono text-white mb-4">
              {{ t('about.role') }}
            </h3>

            <!-- Bio Text -->
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
              {{ t('about.description') }}
            </p>
          </div>

          <!-- Stats 2x2 Grid -->
          <div class="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <div
              v-for="stat in ['education', 'experience', 'projects', 'stack']"
              :key="stat"
              class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div class="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                {{ t(`about.stats.${stat}.label`) }}
              </div>
              <div class="text-xs sm:text-sm font-mono font-bold text-white mt-1 truncate">
                {{ t(`about.stats.${stat}.value`) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Bento Card: 4 Pillars of Engineering (5 cols) -->
        <div class="lg:col-span-5 flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#080e1d]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(167,139,250,0.05)] relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
          <div class="absolute top-3 right-3 w-4 h-4 border-t border-r border-purple-400/40" />

          <div class="flex items-center gap-2 text-xs font-mono text-purple-400 mb-5 uppercase tracking-widest font-bold">
            <span>{{ t('about.dnaTitle') }}</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(pillar, idx) in engineeringPillars"
              :key="idx"
              class="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
            >
              <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 shrink-0 flex items-center justify-center" v-html="pillar.icon" />
              <div>
                <h4 class="text-xs font-mono font-bold text-white mb-0.5">{{ pillar.title }}</h4>
                <p class="text-[11px] text-slate-400 leading-relaxed">{{ pillar.desc }}</p>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 mt-4 uppercase">
            <span>{{ t('about.dnaFooter') }}</span>
            <span class="text-purple-400 font-bold">{{ t('about.dnaCommitment') }}</span>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>