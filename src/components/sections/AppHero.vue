<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { push } from 'notivue'

const { t, tm } = useI18n()

// Rotating roles for full-stack engineer
const roles = computed<string[]>(() => {
  const list = tm('hero.roles') as string[]
  return list && list.length ? list : [
    'FULL-STACK ENGINEER',
    'PYTHON & VUE.JS ARCHITECT',
    'CLEAN ARCHITECTURE & DDD',
    'DATA SCIENCE SPECIALIST',
  ]
})

const competencies = computed<string[]>(() => {
  const list = tm('hero.card.competenciesList') as string[]
  return list && list.length ? list : []
})

const currentRoleIndex = ref(0)
const roleText = computed(() => roles.value[currentRoleIndex.value % roles.value.length])
let roleInterval: ReturnType<typeof setInterval> | null = null

// 3D Card Interactive Tilt & Flip
const cardRef = ref<HTMLDivElement | null>(null)
const isFlipped = ref(false)
const cardRotateX = ref(0)
const cardRotateY = ref(0)

function onCardMouseMove(e: MouseEvent) {
  if (!cardRef.value || window.innerWidth < 768) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  // Subtle 3D tilt: max 12 deg
  cardRotateY.value = ((x - centerX) / centerX) * 12
  cardRotateX.value = -((y - centerY) / centerY) * 12
}

function onCardMouseLeave() {
  cardRotateX.value = 0
  cardRotateY.value = 0
}

function toggleFlip() {
  isFlipped.value = !isFlipped.value
}

function scrollToContact() {
  const target = document.getElementById('contact')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

// Typewriter effect for name
const firstNameTarget = 'Vicente'
const lastNameTarget = 'Vasquez'

const displayedFirstName = ref('')
const displayedLastName = ref('')
const isLastNameTyping = ref(false)
const isTypingComplete = ref(false)

let typingTimeouts: ReturnType<typeof setTimeout>[] = []

function clearTypingTimeouts() {
  typingTimeouts.forEach((t) => clearTimeout(t))
  typingTimeouts = []
}

function startTyping() {
  clearTypingTimeouts()
  displayedFirstName.value = ''
  displayedLastName.value = ''
  isLastNameTyping.value = false
  isTypingComplete.value = false

  let delay = 220

  // Type First Name: "Vicente"
  for (let i = 0; i < firstNameTarget.length; i++) {
    delay += 75 + Math.random() * 20
    const currentDelay = delay
    const charIndex = i
    const timeout = setTimeout(() => {
      displayedFirstName.value = firstNameTarget.slice(0, charIndex + 1)
    }, currentDelay)
    typingTimeouts.push(timeout)
  }

  // Brief pause before second line
  delay += 160
  const pauseTimeout = setTimeout(() => {
    isLastNameTyping.value = true
  }, delay)
  typingTimeouts.push(pauseTimeout)

  // Type Last Name: "Vasquez"
  for (let i = 0; i < lastNameTarget.length; i++) {
    delay += 80 + Math.random() * 20
    const currentDelay = delay
    const charIndex = i
    const timeout = setTimeout(() => {
      displayedLastName.value = lastNameTarget.slice(0, charIndex + 1)
    }, currentDelay)
    typingTimeouts.push(timeout)
  }

  // Complete typing
  delay += 80
  const completeTimeout = setTimeout(() => {
    isTypingComplete.value = true
  }, delay)
  typingTimeouts.push(completeTimeout)
}

function copyDiscord() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText('notxaxa_')
  } else {
    const el = document.createElement('textarea')
    el.value = 'notxaxa_'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  push.success(t('hero.discordCopied'))
}

onMounted(() => {
  startTyping()
  roleInterval = setInterval(() => {
    currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.value.length
  }, 3200)
})

onBeforeUnmount(() => {
  clearTypingTimeouts()
  if (roleInterval) clearInterval(roleInterval)
})
</script>

<template>
  <section
    id="hero"
    class="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
  >
    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

      <!-- Left Column: Typography & Dynamic Role Cycler -->
      <div class="lg:col-span-7 flex flex-col gap-6 text-left">
        
        <!-- High-tech Status Pill -->
        <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#09101f]/90 border border-cyan-500/30 backdrop-blur-md self-start shadow-[0_0_20px_rgba(0,217,255,0.12)]">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-[11px] font-mono tracking-widest text-cyan-400 font-semibold uppercase">
            {{ t('hero.status') }}
          </span>
        </div>

        <!-- Name with Futuristic Typography & Typewriter Effect -->
        <div class="min-h-[85px] sm:min-h-[135px] md:min-h-[160px] flex flex-col justify-center">
          <h1
            @click="startTyping"
            class="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] select-none cursor-pointer group"
            style="font-family: 'Comfortaa', cursive;"
            title="Haz clic para volver a escribir"
          >
            <span>{{ displayedFirstName }}</span>
            <span
              v-if="!isLastNameTyping && !isTypingComplete"
              class="inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[0.82em] bg-cyan-400 ml-1.5 align-baseline animate-pulse shadow-[0_0_12px_#00d9ff]"
            />
            <br />
            <span class="bg-gradient-to-r from-[#00d9ff] via-[#60a5fa] to-[#a78bfa] text-transparent bg-clip-text">
              {{ displayedLastName }}
            </span>
            <span
              v-if="isLastNameTyping || isTypingComplete"
              class="inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[0.82em] bg-cyan-400 ml-1.5 align-baseline animate-pulse shadow-[0_0_12px_#00d9ff]"
            />
          </h1>
        </div>

        <!-- Kicker HUD details -->
        <div class="flex items-center gap-2.5 text-xs font-mono tracking-[0.2em] text-slate-400 uppercase">
          <span>{{ t('hero.kicker') }}</span>
        </div>

        <!-- Hero Subtitle -->
        <p class="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal">
          {{ t('hero.description') }}
        </p>

        <!-- Dynamic Role Cycler Box -->
        <div class="flex items-center gap-3 p-3.5 rounded-xl bg-[#090f1d]/80 border border-cyan-500/20 backdrop-blur-md max-w-md">
          <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold shrink-0">
            &gt;_
          </div>
          <div class="overflow-hidden flex-1">
            <Transition mode="out-in" name="role-slide">
              <span
                :key="roleText"
                class="block text-sm sm:text-base font-mono font-bold tracking-wider text-cyan-300 truncate"
              >
                {{ roleText }}
              </span>
            </Transition>
          </div>
        </div>

        <!-- Action Row: Contact Me + Social Media Network -->
        <div class="flex flex-wrap items-center gap-3.5 pt-1">
          <!-- Contact Me Primary Cyber Button -->
          <a
            href="#contact"
            @click.prevent="scrollToContact"
            class="group relative inline-flex overflow-hidden rounded-xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_24px_rgba(0,217,255,0.2)] hover:shadow-[0_0_36px_rgba(0,217,255,0.4)]"
          >
            <span class="absolute inset-[-1000%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#00d9ff_25%,transparent_50%)]" />
            <span class="relative z-10 flex h-11 items-center justify-center gap-2 rounded-[11px] bg-[#070d18] px-5 text-xs font-mono font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors uppercase">
              <svg class="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{{ t('hero.contactMe') }}</span>
              <svg class="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>

          <!-- Subtle Divider -->
          <div class="h-6 w-px bg-white/10 hidden sm:block" />

          <!-- Social Network Icons -->
          <div class="flex items-center gap-2">
            <!-- GitHub -->
            <a
              href="https://github.com/GodDoesNotPlayDice"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              title="GitHub // @GodDoesNotPlayDice"
              class="group flex items-center justify-center w-11 h-11 rounded-xl bg-[#080e1d]/90 border border-white/10 hover:border-cyan-400/60 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-[0_0_16px_rgba(0,217,255,0.2)]"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>

            <!-- LinkedIn -->
            <a
              href="https://www.linkedin.com/in/vicente-vasquez-29ba81357/?locale=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              title="LinkedIn // Vicente Vasquez"
              class="group flex items-center justify-center w-11 h-11 rounded-xl bg-[#080e1d]/90 border border-white/10 hover:border-cyan-400/60 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-[0_0_16px_rgba(0,217,255,0.2)]"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            <!-- Discord -->
            <button
              type="button"
              @click="copyDiscord"
              aria-label="Discord Username"
              title="Discord // notxaxa_ (Click to copy)"
              class="group relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#080e1d]/90 border border-white/10 hover:border-purple-400/60 hover:bg-purple-500/10 text-slate-300 hover:text-purple-300 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-[0_0_16px_rgba(168,85,247,0.25)]"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.036.05A19.9 19.9 0 006.101 20.1a.077.077 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.028.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </button>
          </div>
        </div>

      </div>

      <!-- Right Column: Interactive 3D Holographic Flip Card -->
      <div class="lg:col-span-5 flex flex-col items-center justify-center">
        <div
          ref="cardRef"
          @mousemove="onCardMouseMove"
          @mouseleave="onCardMouseLeave"
          @click="toggleFlip"
          class="relative w-full max-w-[340px] sm:max-w-[370px] h-[480px] sm:h-[510px] cursor-pointer"
          style="perspective: 1000px;"
        >
          <!-- Floating Cyber Tags -->
          <div class="absolute -top-3 -left-3 z-30 px-3 py-1 rounded-md bg-[#070f20]/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold tracking-widest backdrop-blur-md shadow-lg pointer-events-none">
            VUE.JS · NUXT · FASTAPI
          </div>

          <div class="absolute -bottom-3 -right-3 z-30 px-3 py-1 rounded-md bg-[#160d2e]/90 border border-purple-500/40 text-[10px] font-mono text-purple-300 font-bold tracking-widest backdrop-blur-md shadow-lg pointer-events-none flex items-center gap-1.5">
            <svg class="w-3 h-3 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
            </svg>
            <span>DATA SCIENCE SPECIALTY</span>
          </div>

          <!-- 3D Card Inner (Rotates on hover and flips 180 deg on click) -->
          <div
            class="relative w-full h-full rounded-2xl transition-all duration-700 ease-out"
            :style="{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${cardRotateY + (isFlipped ? 180 : 0)}deg) rotateX(${cardRotateX}deg)`,
            }"
          >
            <!-- FRONT FACE: Photo + Clean HUD Frame -->
            <div
              class="absolute inset-0 rounded-2xl overflow-hidden border border-cyan-500/25 bg-[#060b18] shadow-[0_0_50px_rgba(0,217,255,0.1),0_30px_70px_rgba(0,0,0,0.7)]"
              style="backface-visibility: hidden; -webkit-backface-visibility: hidden;"
            >
              <!-- Image -->
              <img
                src="/me2.jpg"
                alt="Vicente Vasquez"
                class="absolute inset-0 w-full h-full object-cover object-center filter saturate-110 contrast-105"
              />

              <!-- Cyber overlay gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-[#050814]/40 opacity-80" />

              <!-- Futuristic grid lines -->
              <div
                class="absolute inset-0 pointer-events-none opacity-20"
                style="background-image: linear-gradient(rgba(0, 217, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.2) 1px, transparent 1px); background-size: 28px 28px;"
              />

              <!-- Scanline animation -->
              <div class="absolute left-0 right-0 h-[2px] bg-cyan-400/40 shadow-[0_0_12px_#00d9ff] animate-scanline pointer-events-none" />

              <!-- HUD Corner Crosshairs -->
              <div class="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400/70 z-10 pointer-events-none" />
              <div class="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400/70 z-10 pointer-events-none" />
              <div class="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400/70 z-10 pointer-events-none" />
              <div class="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-400/70 z-10 pointer-events-none" />

              <!-- Top HUD Coordinates -->
              <div class="absolute top-3 left-10 right-10 flex justify-between items-center z-10 pointer-events-none">
                <span class="text-[9px] font-mono text-cyan-400/90 tracking-widest uppercase">
                  {{ t('hero.card.spec') }}
                </span>
                <span class="inline-flex items-center gap-1 text-[9px] font-mono text-cyan-400/90 tracking-widest">
                  <span>{{ t('hero.card.tapToFlip') }}</span>
                  <svg class="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- BACK FACE: Credentials, Specialization, Stack -->
            <div
              class="absolute inset-0 rounded-2xl overflow-hidden border border-purple-500/30 bg-[#080d1e] p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(167,139,250,0.15),0_30px_70px_rgba(0,0,0,0.8)]"
              style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg);"
            >
              <!-- Cyber Grid Background -->
              <div
                class="absolute inset-0 pointer-events-none opacity-20"
                style="background-image: linear-gradient(rgba(167, 139, 250, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(167, 139, 250, 0.2) 1px, transparent 1px); background-size: 24px 24px;"
              />

              <!-- Corner Brackets -->
              <div class="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-purple-400/70 pointer-events-none" />
              <div class="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-purple-400/70 pointer-events-none" />
              <div class="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-purple-400/70 pointer-events-none" />
              <div class="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-purple-400/70 pointer-events-none" />

              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-semibold">
                    {{ t('hero.card.honorsTrack') }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-[9px] font-mono text-slate-400">
                    <span>{{ t('hero.card.tapToFlip') }}</span>
                    <svg class="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
                    </svg>
                  </span>
                </div>

                <h3 class="text-xl font-bold font-mono text-white mb-1">
                  {{ t('education.formal.degree') }}
                </h3>
                <p class="text-xs font-mono text-cyan-400 mb-4">
                  {{ t('education.formal.institution') }} · {{ t('education.formal.campus') }}
                </p>

                <!-- Distinctions Honor Card -->
                <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-4">
                  <div class="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                    <svg class="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{{ t('education.formal.distinction') }}</span>
                  </div>
                  <div class="text-[11px] font-mono text-slate-300 mt-1">
                    {{ t('hero.card.honorsDesc') }}
                  </div>
                </div>

                <!-- Academic Pillars -->
                <div class="space-y-2">
                  <div class="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    {{ t('hero.card.coreCompetencies') }}
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(comp, idx) in competencies"
                      :key="comp"
                      class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10"
                      :class="['text-cyan-300', 'text-purple-300', 'text-amber-300', 'text-emerald-300'][idx % 4]"
                    >
                      {{ comp }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Back Footer -->
              <div class="pt-4 border-t border-white/10 flex items-center justify-between">
                <span class="text-[10px] font-mono text-slate-400">DUOC UC · 2021-2025</span>
                <span class="text-[10px] font-mono text-cyan-400 font-bold uppercase">{{ t('hero.card.readyToBuild') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Hint -->
        <span class="text-[10px] font-mono text-slate-500 tracking-widest mt-4 uppercase">
          {{ t('hero.card.hoverHint') }}
        </span>
      </div>

    </div>

    <!-- Scroll Down Indicator -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 pointer-events-none">
      <div class="w-px h-7 bg-cyan-400 animate-pulse" />
      <span class="text-[8px] font-mono tracking-widest text-slate-400">SCROLL</span>
    </div>
  </section>
</template>

<style scoped>
.role-slide-enter-active,
.role-slide-leave-active {
  transition: all 0.35s ease;
}

.role-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.role-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>