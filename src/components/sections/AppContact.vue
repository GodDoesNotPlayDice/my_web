<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { push } from 'notivue'

const { t } = useI18n()

const schema = computed(() => toTypedSchema(
  v.object({
    name: v.pipe(v.string(), v.nonEmpty(t('contact.form.errors.nameRequired'))),
    email: v.pipe(
      v.string(),
      v.nonEmpty(t('contact.form.errors.emailRequired')),
      v.email(t('contact.form.errors.emailInvalid'))
    ),
    message: v.pipe(v.string(), v.nonEmpty(t('contact.form.errors.messageRequired'))),
  })
))

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
})

const [formName] = defineField('name')
const [formEmail] = defineField('email')
const [formMessage] = defineField('message')

const status = ref<'idle' | 'loading'>('idle')

const submitForm = handleSubmit(async (values) => {
  status.value = 'loading'
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    if (!response.ok) throw new Error('Failed to send')
    
    push.success(t('contact.form.success'))
    resetForm()
    status.value = 'idle'
  } catch (error) {
    console.error(error)
    push.error(t('contact.form.error'))
    status.value = 'idle'
  }
})

interface ContactLink {
  key: string
  label: string
  value: string
  href: string
  icon: string
  color: string
}

const contactLinks: ContactLink[] = [
  {
    key: 'linkedin',
    label: 'contact.links.linkedin',
    value: 'Vicente Vasquez',
    href: 'https://www.linkedin.com/in/vicente-vasquez-29ba81357/?locale=en',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    color: 'indigo',
  },
  {
    key: 'github',
    label: 'contact.links.github',
    value: 'GodDoesNotPlayDice',
    href: 'https://github.com/GodDoesNotPlayDice',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
    color: 'teal',
  },
  {
    key: 'discord',
    label: 'contact.links.discord',
    value: 'Discord',
    href: '#',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.036.05A19.9 19.9 0 006.101 20.1a.077.077 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.028.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
    color: 'indigo',
  },
]

const colorMap: Record<string, { icon: string; hover: string }> = {
  teal: {
    icon: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white',
    hover: 'hover:border-teal-300 dark:hover:border-teal-800',
  },
  indigo: {
    icon: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white',
    hover: 'hover:border-indigo-300 dark:hover:border-indigo-800',
  },
}
</script>

<template>
  <section id="contact" class="py-16 md:py-24 bg-white dark:bg-[#0b0f19] transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-5 md:px-8 contact-content">

      <!-- Header -->
      <div class="mb-10 md:mb-16">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {{ t('contact.title') }}
        </h2>
        <div class="w-12 h-1 bg-[#20b2aa] mt-3 mb-4 md:mb-6"></div>
        <p class="text-slate-600 dark:text-gray-400 max-w-2xl transition-colors text-sm md:text-base">
          {{ t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <!-- Contact links -->
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            {{ t('contact.info') }}
          </h3>
          <div class="flex flex-col gap-3">
            <a
              v-for="link in contactLinks"
              :key="link.key"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center gap-4 p-4 bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 transition-all duration-300 hover:-translate-x-0.5"
              :class="colorMap[link.color].hover"
            >
              <div
                class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                :class="colorMap[link.color].icon"
              >
                <span class="w-5 h-5" v-html="link.icon"></span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                  {{ t(link.label) }}
                </p>
                <p class="text-sm font-semibold text-slate-800 dark:text-gray-200 truncate mt-0.5">
                  {{ link.value }}
                </p>
              </div>
              <svg
                class="w-4 h-4 text-slate-400 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Contact form (visual only) -->
        <div class="bg-white dark:bg-[#13131f] rounded-xl border border-slate-200 dark:border-gray-800 p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            {{ t('contact.form.title') }}
          </h3>

          <form class="flex flex-col gap-4" @submit.prevent="submitForm">
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('contact.form.name') }}
                </label>
                <span v-if="errors.name" class="text-xs font-medium text-red-500 dark:text-red-400">{{ errors.name }}</span>
              </div>
              <input
                type="text"
                v-model="formName"
                :disabled="status === 'loading'"
                :placeholder="t('contact.form.namePlaceholder')"
                class="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-colors disabled:opacity-50"
                :class="{ 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/30': errors.name }"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('contact.form.email') }}
                </label>
                <span v-if="errors.email" class="text-xs font-medium text-red-500 dark:text-red-400">{{ errors.email }}</span>
              </div>
              <input
                type="email"
                v-model="formEmail"
                :disabled="status === 'loading'"
                :placeholder="t('contact.form.emailPlaceholder')"
                class="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-colors disabled:opacity-50"
                :class="{ 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/30': errors.email }"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('contact.form.message') }}
                </label>
                <span v-if="errors.message" class="text-xs font-medium text-red-500 dark:text-red-400">{{ errors.message }}</span>
              </div>
              <textarea
                rows="5"
                v-model="formMessage"
                :disabled="status === 'loading'"
                :placeholder="t('contact.form.messagePlaceholder')"
                class="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-colors resize-none disabled:opacity-50"
                :class="{ 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/30': errors.message }"
              ></textarea>
            </div>

            <!-- Success/Error Messages handled by Notivue -->

            <button
              type="submit"
              :disabled="status === 'loading'"
              class="w-full bg-[#20b2aa] hover:bg-teal-500 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <template v-if="status === 'loading'">
                {{ t('contact.form.sending') }}
              </template>
              <template v-else>
                {{ t('contact.form.send') }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </template>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
