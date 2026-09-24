<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCertificates } from '../../composables/useCertificates'

const { t } = useI18n()
const { certificates } = useCertificates()
const showAll = ref(false)

function getInitials(title: string): string {
  return (
    title
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || title.slice(0, 2).toUpperCase()
  )
}

const accents = ['cyan', 'purple', 'amber'] as const
type Accent = typeof accents[number]

function getAccent(index: number): Accent {
  return accents[index % accents.length]
}

const accentMap: Record<
  Accent,
  {
    badge: string
    badgeText: string
    border: string
    bar: string
  }
> = {
  cyan: {
    badge: 'bg-cyan-500/10 border-cyan-500/30',
    badgeText: 'text-cyan-300',
    border: 'hover:border-cyan-400/60 hover:shadow-[0_0_24px_rgba(0,217,255,0.12)]',
    bar: 'bg-gradient-to-r from-cyan-400 to-teal-500',
  },
  purple: {
    badge: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-300',
    border: 'hover:border-purple-400/60 hover:shadow-[0_0_24px_rgba(167,139,250,0.12)]',
    bar: 'bg-gradient-to-r from-purple-400 to-indigo-500',
  },
  amber: {
    badge: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-300',
    border: 'hover:border-amber-400/60 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]',
    bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
  },
}
</script>

<template>
  <section id="certificates" class="py-24 md:py-32 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-5 md:px-8 relative z-10 certificates-content">

      <!-- Section Header -->
      <div class="text-center mb-14 md:mb-18">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {{ t('certificates.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('certificates.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('certificates.subtitle') }}
        </p>
      </div>

      <!-- Initial Certificates Grid (first 4) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <article
          v-for="(cert, index) in certificates.slice(0, 4)"
          :key="cert.id"
          class="group relative rounded-2xl bg-[#090f20]/80 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          :class="accentMap[getAccent(index)].border"
        >
          <!-- Top Accent Bar -->
          <div class="h-1 w-full flex-shrink-0" :class="accentMap[getAccent(index)].bar" />

          <!-- Diploma Corners -->
          <div class="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/20 group-hover:border-cyan-400/60 transition-colors" />
          <div class="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/20 group-hover:border-cyan-400/60 transition-colors" />

          <div class="p-6 flex flex-col flex-1 justify-between">
            <div>
              <!-- Initials Badge -->
              <div
                class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border font-mono font-extrabold text-sm"
                :class="[accentMap[getAccent(index)].badge, accentMap[getAccent(index)].badgeText]"
              >
                {{ getInitials(cert.title) }}
              </div>

              <!-- Title -->
              <h3 class="text-sm font-bold font-mono text-white leading-snug mb-3 group-hover:text-cyan-300 transition-colors">
                {{ cert.title }}
              </h3>
            </div>

            <!-- Meta -->
            <div class="pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
              <p class="text-slate-400 truncate flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                  <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
                </svg>
                <span class="truncate">{{ cert.issuer }}</span>
              </p>
              <p class="text-slate-500 flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <span>{{ cert.date }}</span>
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- Expandable Grid for Remaining Certificates -->
      <transition name="accordion">
        <div
          v-show="showAll"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-4 md:mt-5 overflow-hidden"
        >
          <article
            v-for="(cert, index) in certificates.slice(4)"
            :key="cert.id"
            class="group relative rounded-2xl bg-[#090f20]/80 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            :class="accentMap[getAccent(index + 4)].border"
          >
            <div class="h-1 w-full flex-shrink-0" :class="accentMap[getAccent(index + 4)].bar" />

            <div class="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/20 group-hover:border-cyan-400/60 transition-colors" />
            <div class="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/20 group-hover:border-cyan-400/60 transition-colors" />

            <div class="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div
                  class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border font-mono font-extrabold text-sm"
                  :class="[accentMap[getAccent(index + 4)].badge, accentMap[getAccent(index + 4)].badgeText]"
                >
                  {{ getInitials(cert.title) }}
                </div>

                <h3 class="text-sm font-bold font-mono text-white leading-snug mb-3 group-hover:text-cyan-300 transition-colors">
                  {{ cert.title }}
                </h3>
              </div>

              <div class="pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
                <p class="text-slate-400 truncate flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                    <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
                  </svg>
                  <span class="truncate">{{ cert.issuer }}</span>
                </p>
                <p class="text-slate-500 flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  <span>{{ cert.date }}</span>
                </p>
              </div>
            </div>
          </article>
        </div>
      </transition>

      <!-- Expand Button -->
      <div class="mt-10 flex justify-center" v-if="certificates.length > 4">
        <button
          @click="showAll = !showAll"
          class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-cyan-500/30 bg-[#080d1e]/80 text-cyan-400 hover:text-white hover:bg-cyan-500/20 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_16px_rgba(0,217,255,0.1)]"
        >
          <span>{{ showAll ? t('certificates.showLess') : t('certificates.showMore') }}</span>
          <svg
            class="w-4 h-4 transition-transform duration-300"
            :class="{ 'rotate-180': showAll }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.5s ease-in-out, opacity 0.4s ease-in-out;
  max-height: 2000px;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
