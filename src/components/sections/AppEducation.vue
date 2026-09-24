<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const academicCertifications = computed(() => (tm('education.formal.certsList') as string[]) || [])
const selfTaughtTech = computed(() => (tm('education.selfTaught.techList') as string[]) || [])
</script>

<template>
  <section id="education" class="py-24 md:py-32 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-5 md:px-8 relative z-10 education-content">

      <!-- Section Header -->
      <div class="text-center mb-14 md:mb-18">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {{ t('education.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('education.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('education.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Main Card: Duoc UC Honors Degree (8 cols) -->
        <div class="lg:col-span-8 p-7 sm:p-9 rounded-3xl bg-[#090f20]/80 backdrop-blur-xl border border-cyan-500/25 shadow-[0_0_50px_rgba(0,217,255,0.06)] relative overflow-hidden">
          <div class="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-400/50" />
          <div class="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-cyan-400/50" />

          <!-- Formal Education Badge & Degree -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
            <span class="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold uppercase tracking-wider">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {{ t('education.formal.label') }}
            </span>

            <!-- Distinction Honor Ribbon -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <svg class="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{{ t('education.formal.distinction') }}</span>
            </div>
          </div>

          <h3 class="text-2xl sm:text-3xl font-bold font-mono text-white mb-2">
            {{ t('education.formal.degree') }}
          </h3>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-mono text-cyan-400 mb-6">
            <span>{{ t('education.formal.institution') }}</span>
            <span class="text-slate-500">·</span>
            <span class="text-slate-400">{{ t('education.formal.campus') }}</span>
            <span class="text-slate-500">·</span>
            <span class="text-emerald-400 font-semibold">{{ t('education.formal.graduationDate') }}</span>
          </div>

          <!-- Specialization Highlight -->
          <div class="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
                </svg>
              </div>
              <div>
                <div class="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {{ t('education.formal.specialty') }}
                </div>
                <div class="text-[11px] font-mono text-purple-300">
                  {{ t('education.formal.specialtyDesc') }}
                </div>
              </div>
            </div>

            <span class="text-[11px] font-mono px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {{ t('education.formal.honorsTrack') }}
            </span>
          </div>

          <!-- Academic Certifications Sub-grid -->
          <div>
            <div class="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{{ t('education.formal.certifications') }}</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="cert in academicCertifications"
                :key="cert"
                class="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                {{ cert }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Card: Self-Taught Spirit (4 cols) -->
        <div class="lg:col-span-4 p-7 sm:p-8 rounded-3xl bg-[#090f20]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(167,139,250,0.06)] relative overflow-hidden flex flex-col justify-between">
          <div class="absolute top-3 right-3 w-4 h-4 border-t border-r border-purple-400/50" />

          <div>
            <span class="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold uppercase tracking-wider mb-4">
              <span class="w-1.5 h-1.5 rounded-full bg-purple-400" />
              {{ t('education.selfTaught.label') }}
            </span>

            <h3 class="text-xl font-bold font-mono text-white mb-3">
              {{ t('education.selfTaught.title') }}
            </h3>

            <p class="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              {{ t('education.selfTaught.description') }}
            </p>
          </div>

          <div>
            <div class="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
              {{ t('education.selfTaught.skillsExpanded') }}
            </div>

            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tech in selfTaughtTech"
                :key="tech"
                class="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-slate-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
