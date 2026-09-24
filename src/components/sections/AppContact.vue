<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import * as v from 'valibot'
import { push } from 'notivue'

const { t } = useI18n()

const schema = computed(() =>
  toTypedSchema(
    v.object({
      name: v.pipe(v.string(), v.nonEmpty(t('contact.form.errors.nameRequired'))),
      email: v.pipe(
        v.string(),
        v.nonEmpty(t('contact.form.errors.emailRequired')),
        v.email(t('contact.form.errors.emailInvalid'))
      ),
      message: v.pipe(v.string(), v.nonEmpty(t('contact.form.errors.messageRequired'))),
    })
  )
)

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
    const cfToken = (window as any).turnstile
      ? (window as any).turnstile.getResponse(turnstileWidgetId)
      : ''

    if (!cfToken) {
      push.error(t('contact.form.errors.captchaRequired'))
      status.value = 'idle'
      return
    }

    const payload = {
      ...values,
      cfToken,
    }

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(t('contact.form.errors.rateLimit'))
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || t('contact.form.errors.serverError'))
    }

    push.success(t('contact.form.success'))
    resetForm()

    formName.value = ''
    formEmail.value = ''
    formMessage.value = ''

    if ((window as any).turnstile) {
      ;(window as any).turnstile.reset(turnstileWidgetId)
    }

    status.value = 'idle'
  } catch (error: any) {
    console.error(error)
    push.error(error.message || t('contact.form.errors.serverError'))
    status.value = 'idle'
  }
})

interface ContactLink {
  key: string
  label: string
  value: string
  href: string
  icon: string
  badgeKey: string
}

const contactLinks: ContactLink[] = [
  {
    key: 'linkedin',
    label: 'contact.links.linkedin',
    value: 'Vicente Vasquez',
    href: 'https://www.linkedin.com/in/vicente-vasquez-29ba81357/?locale=en',
    badgeKey: 'contact.channelBadges.linkedin',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  },
  {
    key: 'github',
    label: 'contact.links.github',
    value: 'GodDoesNotPlayDice',
    href: 'https://github.com/GodDoesNotPlayDice',
    badgeKey: 'contact.channelBadges.github',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  },
  {
    key: 'discord',
    label: 'contact.links.discord',
    value: 'notxaxa_',
    href: '',
    badgeKey: 'contact.channelBadges.discord',
    icon: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.036.05A19.9 19.9 0 006.101 20.1a.077.077 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.028.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
  },
]

const turnstileSiteKey =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
const turnstileContainer = ref<HTMLElement | null>(null)
let turnstileWidgetId = ''

onMounted(() => {
  const renderTurnstile = () => {
    if (turnstileContainer.value && (window as any).turnstile) {
      try {
        turnstileWidgetId = (window as any).turnstile.render(
          turnstileContainer.value,
          {
            sitekey: turnstileSiteKey,
            theme: 'dark',
          }
        )
      } catch (e) {
        console.warn('Turnstile render warning:', e)
      }
    }
  }

  if ((window as any).turnstile) {
    renderTurnstile()
  } else {
    const interval = setInterval(() => {
      if ((window as any).turnstile) {
        clearInterval(interval)
        renderTurnstile()
      }
    }, 200)
  }
})
</script>

<template>
  <section id="contact" class="py-24 md:py-32 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-5 md:px-8 relative z-10 contact-content">

      <!-- Section Header -->
      <div class="text-center mb-14 md:mb-18">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {{ t('contact.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('contact.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('contact.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Left Column: Channel Links (5 cols) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
          <div class="p-6 sm:p-7 rounded-3xl bg-[#090f20]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,217,255,0.04)]">
            <h3 class="text-lg font-bold font-mono text-white mb-2">
              {{ t('contact.info') }}
            </h3>
            <p class="text-xs text-slate-400 font-sans leading-relaxed mb-6">
              {{ t('contact.subtitleDetail') }}
            </p>

            <div class="space-y-3">
              <component
                :is="link.href ? 'a' : 'div'"
                v-for="link in contactLinks"
                :key="link.key"
                :href="link.href || undefined"
                :target="link.href ? '_blank' : undefined"
                :rel="link.href ? 'noopener noreferrer' : undefined"
                class="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all duration-300"
                :class="link.href ? 'cursor-pointer' : ''"
              >
                <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-all shrink-0">
                  <span class="w-5 h-5" v-html="link.icon" />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    {{ t(link.badgeKey) }}
                  </div>
                  <div class="text-sm font-mono font-bold text-slate-200 truncate mt-0.5">
                    {{ link.value }}
                  </div>
                </div>

                <svg
                  v-if="link.href"
                  class="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </component>
            </div>
          </div>
        </div>

        <!-- Right Column: Cyber Message Terminal (7 cols) -->
        <div class="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-[#090f20]/80 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_50px_rgba(0,217,255,0.06)] relative overflow-hidden">
          <div class="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-400/50" />

          <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h3 class="text-xl font-bold font-mono text-white">
                {{ t('contact.form.title') }}
              </h3>
              <p class="text-xs font-mono text-cyan-400 mt-0.5">
                {{ t('contact.secureTrans') }}
              </p>
            </div>
            <span class="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{{ t('contact.statusReady') }}</span>
            </span>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="submitForm">
            <!-- Name Field -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                  {{ t('contact.form.name') }}
                </label>
                <span v-if="errors.name" class="text-xs font-mono text-rose-400">{{ errors.name }}</span>
              </div>
              <input
                type="text"
                v-model="formName"
                :disabled="status === 'loading'"
                :placeholder="t('contact.form.namePlaceholder')"
                class="w-full bg-[#050711]/90 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors disabled:opacity-50"
                :class="{ 'border-rose-500 focus:border-rose-500': errors.name }"
              />
            </div>

            <!-- Email Field -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                  {{ t('contact.form.email') }}
                </label>
                <span v-if="errors.email" class="text-xs font-mono text-rose-400">{{ errors.email }}</span>
              </div>
              <input
                type="email"
                v-model="formEmail"
                :disabled="status === 'loading'"
                :placeholder="t('contact.form.emailPlaceholder')"
                class="w-full bg-[#050711]/90 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors disabled:opacity-50"
                :class="{ 'border-rose-500 focus:border-rose-500': errors.email }"
              />
            </div>

            <!-- Message Field -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                  {{ t('contact.form.message') }}
                </label>
                <span v-if="errors.message" class="text-xs font-mono text-rose-400">{{ errors.message }}</span>
              </div>
              <textarea
                rows="4"
                v-model="formMessage"
                :disabled="status === 'loading'"
                :placeholder="t('contact.form.messagePlaceholder')"
                class="w-full bg-[#050711]/90 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors resize-none disabled:opacity-50"
                :class="{ 'border-rose-500 focus:border-rose-500': errors.message }"
              ></textarea>
            </div>

            <!-- Turnstile Container -->
            <div class="mt-1 min-h-[65px]" ref="turnstileContainer"></div>

            <!-- Send Button -->
            <button
              type="submit"
              :disabled="status === 'loading'"
              class="group relative inline-flex overflow-hidden rounded-xl p-[1px] transition-transform duration-300 ease-in-out hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              <span class="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#00d9ff_25%,transparent_50%)]" />
              <span class="relative z-10 flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-[#070d18] px-6 text-xs font-mono font-bold uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                <template v-if="status === 'loading'">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ t('contact.form.sending') }}</span>
                </template>
                <template v-else>
                  <span>{{ t('contact.form.send') }}</span>
                  <svg class="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </template>
              </span>
            </button>
          </form>
        </div>

      </div>

    </div>
  </section>
</template>
