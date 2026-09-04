<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { computed } from 'vue'

const { t, tm } = useI18n()

const academicCertifications = computed(() => tm('education.formal.certsList') as string[])

const selfTaughtTech = [
  'Frontend', 'Backend', 'IA', 'Cloud'
]
</script>

<template>
  <section id="education" class="py-16 md:py-24 bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-5 md:px-8 education-content">

      <!-- Header -->
      <div class="mb-10 md:mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('education.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-4 md:mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors text-sm md:text-base">
          {{ t('education.subtitle') }}
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Vertical line — only md+ -->
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-indigo-500 to-orange-300 hidden md:block"></div>

        <!-- Item 1: Duoc UC -->
        <div class="relative flex gap-4 md:gap-8 mb-8 md:mb-12 edu-item">
          <!-- Dot -->
          <div class="hidden md:flex flex-col items-center flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-[#20b2aa] flex items-center justify-center shadow-lg shadow-teal-500/30 z-10">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          </div>

          <!-- Card -->
          <div class="flex-1 bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 p-5 md:p-6 shadow-sm transition-all duration-300">
            <!-- Mobile dot accent -->
            <div class="flex items-center gap-2 mb-3 md:hidden">
              <div class="w-6 h-6 rounded-full bg-[#20b2aa] flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"/>
                </svg>
              </div>
              <span class="bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {{ t('education.formal.label') }}
              </span>
            </div>

            <span class="hidden md:inline-block bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              {{ t('education.formal.label') }}
            </span>

            <div class="flex flex-col gap-3 mb-5 md:mb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {{ t('education.formal.degree') }}
                </h3>
                <p class="text-[#20b2aa] font-medium mt-1 text-sm md:text-base">{{ t('education.formal.institution') }}</p>
                <p class="text-slate-500 dark:text-gray-500 text-xs md:text-sm mt-0.5">{{ t('education.formal.campus') }}</p>
              </div>
              <div class="flex flex-row md:flex-col items-center md:items-end gap-2 flex-shrink-0 flex-wrap">
                <span class="text-xs md:text-sm text-slate-500 dark:text-gray-400">{{ t('education.formal.graduated') }}</span>
                <span class="text-xs md:text-sm font-semibold text-slate-800 dark:text-gray-200">{{ t('education.formal.graduationDate') }}</span>
                <span class="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs px-2.5 py-1 rounded-full font-medium">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ t('education.formal.distinction') }}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-5 md:mb-6">
              <span class="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs md:text-sm px-3 py-1.5 rounded-lg font-medium">
                <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ t('education.formal.specialty') }}
              </span>
              <span class="text-slate-500 dark:text-gray-500 text-xs flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-[#20b2aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ t('education.formal.certDate') }}
              </span>
            </div>

            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-500 mb-3">
                {{ t('education.formal.certifications') }}
              </p>
              <div class="flex flex-wrap gap-1.5 md:gap-2">
                <span
                  v-for="cert in academicCertifications"
                  :key="cert"
                  class="text-xs bg-slate-100 dark:bg-[#1a1a2e] text-slate-600 dark:text-gray-400 px-2 md:px-2.5 py-1 rounded-md border border-slate-200 dark:border-gray-700"
                >
                  {{ cert }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 2: Self-taught -->
        <div class="relative flex gap-4 md:gap-8 edu-item">
          <div class="hidden md:flex flex-col items-center flex-shrink-0">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-orange-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 z-10">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <div class="flex-1 bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 p-5 md:p-6 shadow-sm transition-all duration-300">
            <!-- Mobile accent -->
            <div class="flex items-center gap-2 mb-3 md:hidden">
              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {{ t('education.selfTaught.label') }}
              </span>
            </div>

            <span class="hidden md:inline-block bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              {{ t('education.selfTaught.label') }}
            </span>

            <h3 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">
              {{ t('education.selfTaught.title') }}
            </h3>
            <p class="text-slate-600 dark:text-gray-400 mb-5 md:mb-6 leading-relaxed text-sm md:text-base">
              {{ t('education.selfTaught.description') }}
            </p>

            <div class="flex flex-wrap gap-1.5 md:gap-2">
              <span
                v-for="tech in selfTaughtTech"
                :key="tech"
                class="text-xs bg-gradient-to-r from-teal-500/10 to-indigo-500/10 text-teal-700 dark:text-teal-300 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg border border-teal-200 dark:border-teal-900 font-medium"
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
