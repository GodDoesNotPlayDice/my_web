<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHero from '../sections/AppHero.vue'
import AppActivity from '../sections/AppActivity.vue'
import AppAbout from '../sections/AppAbout.vue'
import AppSkills from '../sections/AppSkills.vue'
import AppExperience from '../sections/AppExperience.vue'
import AppProjects from '../sections/AppProjects.vue'
import AppEducation from '../sections/AppEducation.vue'
import AppCertificates from '../sections/AppCertificates.vue'
import AppContact from '../sections/AppContact.vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()

function isMobile(): boolean {
  return window.innerWidth < 768
}

function triggerStart(mobileVal = '98%', desktopVal = '90%') {
  return isMobile() ? `top ${mobileVal}` : `top ${desktopVal}`
}

// Consistent order matching navigation
const scrollSections = [
  { trigger: '#about', content: '#about .about-content' },
  { trigger: '#skills', content: '#skills .skills-content' },
  { trigger: '#experience', content: '#experience .experience-content' },
  { trigger: '#projects', content: '#projects .projects-content' },
  { trigger: '#education', content: '#education .education-content' },
  { trigger: '#certificates', content: '#certificates .certificates-content' },
  { trigger: '#contact', content: '#contact .contact-content' },
]

onMounted(async () => {
  await nextTick()
  const mobile = isMobile()

  scrollSections.forEach(({ trigger, content }) => {
    const yOffset = mobile ? 24 : 45
    gsap.set(content, { opacity: 0, y: yOffset, scale: 0.99 })

    gsap
      .timeline({
        scrollTrigger: {
          trigger,
          start: triggerStart('98%', '88%'),
          toggleActions: 'play none none none',
          markers: false,
        },
      })
      .to(content, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: mobile ? 0.6 : 0.85,
        ease: 'power3.out',
      })
  })
})

onBeforeUnmount(() => {
  try {
    ScrollTrigger.getAll().forEach((tr) => tr.kill())
  } catch (e) {
    // silent
  }
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="bg-transparent min-h-screen relative z-10">
    <!-- Ordered Sections -->
    <AppHero />
    <AppActivity />
    <AppAbout />
    <AppSkills />
    <AppExperience />
    <AppProjects />
    <AppEducation />
    <AppCertificates />
    <AppContact />

    <!-- Futuristic Cyber Footer -->
    <footer class="relative z-10 border-t border-cyan-500/15 bg-[#050711]/90 backdrop-blur-2xl py-12 px-6">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <!-- Left: Branding & Status -->
        <div class="flex items-center gap-3">
          <div>
            <div class="text-sm font-bold font-mono text-white">
              VICENTE VASQUEZ // DEV_PORTFOLIO
            </div>
            <div class="text-[11px] font-mono text-slate-400">
              {{ t('footer.role') }}
            </div>
          </div>
        </div>


        <!-- Right: Back to Top -->
        <div class="flex items-center gap-4">
          <button
            @click="scrollToTop"
            class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-400 transition-all duration-200"
          >
            <span>{{ t('footer.topOfSystem') }}</span>
            <span>↑</span>
          </button>
        </div>

      </div>

      <div class="max-w-6xl mx-auto text-center mt-8 pt-6 border-t border-white/5 text-[11px] font-mono text-slate-500">
        © {{ new Date().getFullYear() }} Vicente Vasquez. {{ t('footer.copyright') }}
      </div>
    </footer>
  </main>
</template>
