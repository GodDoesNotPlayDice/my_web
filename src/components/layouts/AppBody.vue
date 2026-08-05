<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue';
import AppHero from '../sections/AppHero.vue';
import AppAbout from '../sections/AppAbout.vue';
import AppEducation from '../sections/AppEducation.vue';
import AppSkills from '../sections/AppSkills.vue';
import AppExperience from '../sections/AppExperience.vue';
import AppProjects from '../sections/AppProjects.vue';
import AppCertificates from '../sections/AppCertificates.vue';
import AppContact from '../sections/AppContact.vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// On mobile, trigger animations earlier (element enters viewport sooner)
// isMobile = viewport width < 768px
function isMobile(): boolean {
  return window.innerWidth < 768;
}

// start: 'top X%' — the higher X, the earlier the animation fires
// Mobile: 98% fires as soon as the top of the element is barely inside the viewport
// Desktop: 90% fires when the element is 10% scrolled in
function triggerStart(mobileVal = '98%', desktopVal = '90%') {
  return isMobile() ? `top ${mobileVal}` : `top ${desktopVal}`;
}

// Sections standard scroll-reveal
const scrollSections = [
  { trigger: '#about',        content: '#about .about-content' },
  { trigger: '#education',    content: '#education .education-content' },
  { trigger: '#skills',       content: '#skills .skills-content' },
  { trigger: '#experience',   content: '#experience .experience-content' },
  { trigger: '#projects',     content: '#projects .projects-content' },
  { trigger: '#certificates', content: '#certificates .certificates-content' },
  { trigger: '#contact',      content: '#contact .contact-content' },
];

onMounted(async () => {
  await nextTick();

  const mobile = isMobile();

  // ── Standard section reveal ───────────────────────────────────────
  scrollSections.forEach(({ trigger, content }) => {
    // On mobile: smaller y offset so content doesn't shift too much
    const yOffset = mobile ? 30 : 60;

    gsap.set(content, { opacity: 0, y: yOffset, scale: 0.99 });

    gsap.timeline({
      scrollTrigger: {
        trigger,
        start: triggerStart('98%', '90%'),
        toggleActions: 'play none none none',
        markers: false,
      },
    })
      .to(content, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: mobile ? 0.6 : 0.9,
        ease: 'power3.out',
      })
      .from(
        `${content} > *`,
        {
          opacity: 0,
          y: mobile ? 10 : 20,
          stagger: mobile ? 0.05 : 0.08,
          duration: mobile ? 0.4 : 0.6,
          ease: 'power2.out',
        },
        '-=0.5',
      );
  });

  // ── Skills cards stagger ──────────────────────────────────────────
  gsap.set('#skills .skill-card', { opacity: 0, y: mobile ? 20 : 30 });
  gsap.timeline({
    scrollTrigger: {
      trigger: '#skills',
      start: triggerStart('98%', '80%'),
      toggleActions: 'play none none none',
    },
  }).to('#skills .skill-card', {
    opacity: 1,
    y: 0,
    stagger: mobile ? 0.05 : 0.08,
    duration: mobile ? 0.35 : 0.5,
    ease: 'power2.out',
    delay: mobile ? 0.15 : 0.4,
  });

  // ── Experience timeline stagger ───────────────────────────────────
  // On mobile: avoid x slide (elements are full-width, looks odd)
  gsap.set('#experience .exp-item', {
    opacity: 0,
    x: mobile ? 0 : -30,
    y: mobile ? 20 : 0,
  });
  gsap.timeline({
    scrollTrigger: {
      trigger: '#experience',
      start: triggerStart('98%', '80%'),
      toggleActions: 'play none none none',
    },
  }).to('#experience .exp-item', {
    opacity: 1,
    x: 0,
    y: 0,
    stagger: mobile ? 0.08 : 0.12,
    duration: mobile ? 0.45 : 0.6,
    ease: 'power2.out',
    delay: mobile ? 0.1 : 0.3,
  });

  // ── Education items stagger ───────────────────────────────────────
  gsap.set('#education .edu-item', {
    opacity: 0,
    x: mobile ? 0 : -20,
    y: mobile ? 20 : 0,
  });
  gsap.timeline({
    scrollTrigger: {
      trigger: '#education',
      start: triggerStart('98%', '80%'),
      toggleActions: 'play none none none',
    },
  }).to('#education .edu-item', {
    opacity: 1,
    x: 0,
    y: 0,
    stagger: mobile ? 0.1 : 0.15,
    duration: mobile ? 0.5 : 0.7,
    ease: 'power2.out',
    delay: mobile ? 0.1 : 0.3,
  });
});

onBeforeUnmount(() => {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  } catch (e) {
    // silent
  }
});
</script>

<template>
  <main class="dark:bg-[#0b0f19] bg-white min-h-screen">
    <AppHero />
    <AppAbout />
    <AppEducation />
    <AppSkills />
    <AppExperience />
    <AppProjects />
    <AppCertificates />
    <AppContact />
  </main>
</template>

<style scoped></style>
