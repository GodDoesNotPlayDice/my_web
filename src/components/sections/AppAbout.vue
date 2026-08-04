<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section id="about" class="py-24 bg-white dark:bg-[#0b0f19] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-8 about-content">
      
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('about.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors">
          {{ t('about.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        
        <div class="w-full h-full relative">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Workspace" 
            class="w-full h-full object-cover rounded-xl shadow-lg dark:shadow-none"
          />
        </div>

        <div class="flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
            {{ t('about.role') }}
          </h3>
          <p class="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed transition-colors">
            {{ t('about.description') }}
          </p>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-slate-50 dark:bg-[#13131f] p-5 rounded-lg border border-slate-200 dark:border-gray-800 transition-colors">
              <h4 class="text-slate-900 dark:text-white font-semibold text-sm">{{ t('about.stats.education.label') }}</h4>
              <p class="text-slate-500 dark:text-gray-400 text-xs mt-1">{{ t('about.stats.education.value') }}</p>
            </div>
            
            <div class="bg-slate-50 dark:bg-[#13131f] p-5 rounded-lg border border-slate-200 dark:border-gray-800 transition-colors">
              <h4 class="text-slate-900 dark:text-white font-semibold text-sm">{{ t('about.stats.experience.label') }}</h4>
              <p class="text-slate-500 dark:text-gray-400 text-xs mt-1">{{ t('about.stats.experience.value') }}</p>
            </div>

            <div class="bg-slate-50 dark:bg-[#13131f] p-5 rounded-lg border border-slate-200 dark:border-gray-800 transition-colors">
              <h4 class="text-slate-900 dark:text-white font-semibold text-sm">{{ t('about.stats.projects.label') }}</h4>
              <p class="text-slate-500 dark:text-gray-400 text-xs mt-1">{{ t('about.stats.projects.value') }}</p>
            </div>

            <div class="bg-slate-50 dark:bg-[#13131f] p-5 rounded-lg border border-slate-200 dark:border-gray-800 transition-colors">
              <h4 class="text-slate-900 dark:text-white font-semibold text-sm">{{ t('about.stats.stack.label') }}</h4>
              <p class="text-slate-500 dark:text-gray-400 text-xs mt-1">{{ t('about.stats.stack.value') }}</p>
            </div>
          </div>

          <button class="w-full bg-[#20b2aa] hover:bg-teal-500 text-white py-3.5 rounded text-sm font-medium transition-colors flex justify-center items-center gap-2">
            {{ t('about.button') }} <span>→</span>
          </button>
        </div>

      </div>
    </div>
  </section>
</template>