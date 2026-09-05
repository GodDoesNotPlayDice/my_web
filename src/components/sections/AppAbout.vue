<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section id="about" class="py-16 md:py-24 bg-white dark:bg-[#0b0f19] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-5 md:px-8 about-content">

      <div class="mb-10 md:mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('about.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-4 md:mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors text-sm md:text-base">
          {{ t('about.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

        <!-- Image — hidden on mobile, shown on lg -->
        <div class="hidden lg:block w-full aspect-square relative">
          <img
            src="/me2.jpg"
            alt="Vicente Vasquez"
            class="w-full h-full object-cover object-center rounded-xl shadow-lg dark:shadow-none"
          />
        </div>

        <div class="flex flex-col justify-start">
          <h3 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 transition-colors">
            {{ t('about.role') }}
          </h3>
          <p class="text-slate-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed transition-colors text-sm md:text-base">
            {{ t('about.description') }}
          </p>

          <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <div
              v-for="stat in ['education', 'experience', 'projects', 'stack']"
              :key="stat"
              class="bg-slate-50 dark:bg-[#13131f] p-4 md:p-5 rounded-lg border border-slate-200 dark:border-gray-800 transition-colors"
            >
              <h4 class="text-slate-900 dark:text-white font-semibold text-xs md:text-sm">
                {{ t(`about.stats.${stat}.label`) }}
              </h4>
              <p class="text-slate-500 dark:text-gray-400 text-xs mt-1">
                {{ t(`about.stats.${stat}.value`) }}
              </p>
            </div>
          </div>


        </div>
      </div>
    </div>
  </section>
</template>