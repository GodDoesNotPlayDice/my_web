<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const mobileMenuOpen = ref(false)
const activeSection = ref('hero')
const isScrolled = ref(false)
const isLanguageTransitioning = ref(false)

function scrollToSection(id: string) {
  mobileMenuOpen.value = false
  activeSection.value = id
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

// Consistent order matching the page DOM layout
const navigationLinks = computed(() => [
  { id: 1, name: t('nav.home'), hash: 'hero' },
  { id: 2, name: t('nav.about'), hash: 'about' },
  { id: 3, name: t('nav.skills'), hash: 'skills' },
  { id: 4, name: t('nav.experience'), hash: 'experience' },
  { id: 5, name: t('nav.projects'), hash: 'projects' },
  { id: 6, name: t('nav.education'), hash: 'education' },
  { id: 7, name: t('nav.certificates'), hash: 'certificates' },
])

// Invariant fixed widths per section link: guarantees 0.00px layout shift between ES and EN
const linkWidthMap: Record<string, string> = {
  hero: 'w-[78px]',
  about: 'w-[94px]',
  skills: 'w-[122px]',
  experience: 'w-[122px]',
  projects: 'w-[104px]',
  education: 'w-[104px]',
  certificates: 'w-[130px]',
}

function setLocale(newLocale: 'es' | 'en') {
  if (locale.value === newLocale || isLanguageTransitioning.value) return
  isLanguageTransitioning.value = true

  // Trigger gentle cinematic morphing transition
  document.documentElement.classList.add('lang-morphing')

  setTimeout(() => {
    locale.value = newLocale
    setTimeout(() => {
      document.documentElement.classList.remove('lang-morphing')
      isLanguageTransitioning.value = false
    }, 200)
  }, 120)
}

function handleScroll() {
  isScrolled.value = window.scrollY > 30

  // Detect active section in reverse DOM order
  const sections = ['contact', 'certificates', 'education', 'projects', 'experience', 'skills', 'about', 'hero']
  const scrollPos = window.scrollY + 220

  for (const s of sections) {
    const el = document.getElementById(s)
    if (el) {
      const top = el.offsetTop
      if (scrollPos >= top) {
        activeSection.value = s
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- Floating Glass Island Control Dock (Zero Layout Shift) -->
  <header
    class="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-auto max-w-6xl transition-all duration-300"
  >
    <nav
      class="w-full flex items-center justify-between lg:justify-center gap-2 sm:gap-3 rounded-2xl px-4 sm:px-5 lg:px-4 py-2 transition-all duration-300"
      :style="{
        background: isScrolled ? 'rgba(7, 11, 22, 0.90)' : 'rgba(9, 14, 28, 0.80)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(0, 217, 255, 0.18)',
        boxShadow: isScrolled
          ? '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 217, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
          : '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 217, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }"
    >
      <!-- Mobile Brand Logo on Left (Only visible on < lg screens) -->
      <a
        href="#hero"
        @click.prevent="scrollToSection('hero')"
        class="lg:hidden text-sm sm:text-base font-bold tracking-tight text-white select-none shrink-0 hover:opacity-85 transition-opacity"
        style="font-family: 'Comfortaa', cursive;"
      >
        vicente<span class="text-cyan-400">.dev</span>
      </a>

      <!-- Desktop Navigation Links with Fixed Invariant Widths -->
      <div class="hidden lg:flex items-center gap-1">
        <a
          v-for="link in navigationLinks"
          :key="link.id"
          :href="`#${link.hash}`"
          @click.prevent="scrollToSection(link.hash)"
          class="relative h-9 flex items-center justify-center text-xs font-mono tracking-wider uppercase transition-all duration-200 rounded-xl group select-none overflow-hidden"
          :class="[
            linkWidthMap[link.hash],
            activeSection === link.hash
              ? 'text-cyan-400 font-bold bg-cyan-500/15 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.06]',
          ]"
        >
          <!-- Smooth crossfade between translations -->
          <Transition mode="out-in" name="nav-crossfade">
            <span :key="locale" class="truncate">{{ link.name }}</span>
          </Transition>

          <span
            v-if="activeSection === link.hash"
            class="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff]"
          />
        </a>
      </div>

      <!-- Subtle Divider between Nav Links and Controls (Desktop only) -->
      <div class="h-5 w-px bg-white/10 hidden lg:block mx-1" />

      <!-- Right Controls Group (Language Switcher + Mobile Menu Toggle) -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- Smooth Sliding Language Switcher (Zero Layout Shift) -->
        <div
          class="relative flex items-center p-1 rounded-xl bg-black/50 border border-white/10 w-[84px] h-[36px] select-none shrink-0"
          role="group"
          aria-label="Language selector"
        >
          <!-- Sliding Indicator Pill -->
          <div
            class="absolute top-1 bottom-1 w-[36px] rounded-lg bg-cyan-500/25 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,217,255,0.35)] transition-transform duration-300 ease-out pointer-events-none"
            :style="{
              transform: locale === 'es' ? 'translateX(0px)' : 'translateX(40px)',
            }"
          />

          <!-- ES Button -->
          <button
            @click="setLocale('es')"
            type="button"
            class="relative z-10 w-[36px] h-full flex items-center justify-center text-xs font-mono font-bold transition-colors duration-200"
            :class="locale === 'es' ? 'text-cyan-300' : 'text-slate-400 hover:text-white'"
          >
            ES
          </button>

          <!-- EN Button -->
          <button
            @click="setLocale('en')"
            type="button"
            class="relative z-10 w-[36px] h-full flex items-center justify-center text-xs font-mono font-bold transition-colors duration-200"
            :class="locale === 'en' ? 'text-cyan-300' : 'text-slate-400 hover:text-white'"
          >
            EN
          </button>
        </div>

        <!-- Mobile Menu Toggle Button (Visible on < lg) -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] border border-white/10 transition-colors shrink-0"
          aria-label="Toggle Menu"
        >
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>
  </header>

  <!-- Mobile Drawer / Overlay Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-[1001] bg-black/70 backdrop-blur-md lg:hidden"
      @click="mobileMenuOpen = false"
    />
  </Transition>

  <!-- Mobile Drawer Slide -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-250 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="mobileMenuOpen"
      class="fixed top-0 right-0 h-full w-72 z-[1002] lg:hidden flex flex-col bg-[#070b16]/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-[-20px_0_60px_rgba(0,0,0,0.8)]"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d9ff]" />
          <span
            class="text-sm font-bold tracking-tight text-white select-none"
            style="font-family: 'Comfortaa', cursive;"
          >
            vicente<span class="text-cyan-400">.dev</span>
          </span>
        </div>
        <button
          @click="mobileMenuOpen = false"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Drawer Nav List -->
      <nav class="flex-1 overflow-y-auto px-4 py-5">
        <ul class="flex flex-col gap-1.5">
          <li v-for="link in navigationLinks" :key="link.id">
            <a
              :href="`#${link.hash}`"
              @click.prevent="scrollToSection(link.hash)"
              class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-mono tracking-wider transition-all duration-200"
              :class="activeSection === link.hash
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'"
            >
              <span>{{ link.name }}</span>
              <svg class="w-3.5 h-3.5 text-cyan-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </Transition>
</template>

<style scoped>
.nav-crossfade-enter-active,
.nav-crossfade-leave-active {
  transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-crossfade-enter-from {
  opacity: 0;
  transform: translateY(3px) scale(0.96);
}

.nav-crossfade-leave-to {
  opacity: 0;
  transform: translateY(-3px) scale(0.96);
}
</style>