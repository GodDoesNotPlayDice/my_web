<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCertificates } from '../../composables/useCertificates'

const { t } = useI18n()
const { certificates } = useCertificates()
const showAll = ref(false)

// Generate a short abbreviation from the certificate title for the badge
function getInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || title.slice(0, 2).toUpperCase()
}

// Cycle through accent colors
const accents = ['teal', 'indigo', 'orange'] as const
type Accent = typeof accents[number]

function getAccent(index: number): Accent {
  return accents[index % accents.length]
}

const accentMap: Record<Accent, {
  badge: string
  badgeText: string
  border: string
  bar: string
  corner: string
}> = {
  teal: {
    badge:     'bg-teal-500/10',
    badgeText: 'text-teal-600 dark:text-teal-400',
    border:    'hover:border-teal-300 dark:hover:border-teal-800',
    bar:       'bg-gradient-to-r from-teal-400 to-teal-600',
    corner:    'border-teal-300 dark:border-teal-800',
  },
  indigo: {
    badge:     'bg-indigo-500/10',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    border:    'hover:border-indigo-300 dark:hover:border-indigo-800',
    bar:       'bg-gradient-to-r from-indigo-400 to-indigo-600',
    corner:    'border-indigo-300 dark:border-indigo-800',
  },
  orange: {
    badge:     'bg-orange-500/10',
    badgeText: 'text-orange-600 dark:text-orange-400',
    border:    'hover:border-orange-300 dark:hover:border-orange-800',
    bar:       'bg-gradient-to-r from-orange-400 to-orange-500',
    corner:    'border-orange-300 dark:border-orange-800',
  },
}
</script>

<template>
  <section id="certificates" class="py-16 md:py-24 bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-5 md:px-8 certificates-content">

      <!-- Header -->
      <div class="mb-10 md:mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('certificates.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-4 md:mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors text-sm md:text-base">
          {{ t('certificates.subtitle') }}
        </p>
      </div>

      <!-- Initial Certificates grid (first 4) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <article
          v-for="(cert, index) in certificates.slice(0, 4)"
          :key="cert.id"
          class="group relative bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
          :class="accentMap[getAccent(index)].border"
        >
          <!-- Top accent bar -->
          <div class="h-1 w-full flex-shrink-0" :class="accentMap[getAccent(index)].bar"></div>

          <!-- Decorative corner lines (diploma style) -->
          <div
            class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
            :class="accentMap[getAccent(index)].corner"
          ></div>
          <div
            class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
            :class="accentMap[getAccent(index)].corner"
          ></div>

          <!-- Card body -->
          <div class="p-5 flex flex-col flex-1">
            <!-- Initials badge -->
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 transition-colors duration-300"
              :class="accentMap[getAccent(index)].badge"
            >
              <span
                class="text-sm font-extrabold tracking-wide"
                :class="accentMap[getAccent(index)].badgeText"
              >
                {{ getInitials(cert.title) }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-3 flex-1 group-hover:opacity-90 transition-opacity">
              {{ cert.title }}
            </h3>

            <!-- Divider -->
            <div class="w-8 h-px bg-slate-200 dark:bg-gray-700 mb-3"></div>

            <!-- Meta -->
            <div class="flex flex-col gap-1.5">
              <p class="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1.5">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
                </svg>
                <span class="truncate">{{ cert.issuer }}</span>
              </p>
              <p class="text-xs text-slate-400 dark:text-gray-600 flex items-center gap-1.5">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ cert.date }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- Expandable grid for remaining certificates -->
      <transition name="accordion">
        <div v-show="showAll" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-3 md:mt-5 overflow-hidden">
          <article
            v-for="(cert, index) in certificates.slice(4)"
            :key="cert.id"
            class="group relative bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            :class="accentMap[getAccent(index + 4)].border"
          >
            <!-- Top accent bar -->
            <div class="h-1 w-full flex-shrink-0" :class="accentMap[getAccent(index + 4)].bar"></div>

            <!-- Decorative corner lines (diploma style) -->
            <div
              class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
              :class="accentMap[getAccent(index + 4)].corner"
            ></div>
            <div
              class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-sm opacity-30 transition-opacity duration-300 group-hover:opacity-60"
              :class="accentMap[getAccent(index + 4)].corner"
            ></div>

            <!-- Card body -->
            <div class="p-5 flex flex-col flex-1">
              <!-- Initials badge -->
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 transition-colors duration-300"
                :class="accentMap[getAccent(index + 4)].badge"
              >
                <span
                  class="text-sm font-extrabold tracking-wide"
                  :class="accentMap[getAccent(index + 4)].badgeText"
                >
                  {{ getInitials(cert.title) }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-3 flex-1 group-hover:opacity-90 transition-opacity">
                {{ cert.title }}
              </h3>

              <!-- Divider -->
              <div class="w-8 h-px bg-slate-200 dark:bg-gray-700 mb-3"></div>

              <!-- Meta -->
              <div class="flex flex-col gap-1.5">
                <p class="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1.5">
                  <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/>
                  </svg>
                  <span class="truncate">{{ cert.issuer }}</span>
                </p>
                <p class="text-xs text-slate-400 dark:text-gray-600 flex items-center gap-1.5">
                  <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ cert.date }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </transition>

      <!-- Show more button -->
      <div class="mt-8 flex justify-center" v-if="certificates.length > 4">
        <button
          @click="showAll = !showAll"
          class="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 dark:border-gray-700 bg-white dark:bg-[#13131f] text-slate-700 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
        >
          {{ showAll ? t('certificates.showLess') : t('certificates.showMore') }}
          <svg
            class="w-4 h-4 transition-transform duration-300"
            :class="{ 'rotate-180': showAll }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out, margin 0.5s ease-in-out;
  max-height: 2000px;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}
</style>
