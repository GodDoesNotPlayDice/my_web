<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

interface ContributionDay {
  date: string
  count: number
  level: number
}

const hoveredDay = ref<ContributionDay | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

// Generate a clean 365-day grid with zero mock data
function generateEmpty365Days(): ContributionDay[] {
  const days: ContributionDay[] = []
  const today = new Date()
  const oneYearAgo = new Date(today)
  oneYearAgo.setDate(today.getDate() - 364)

  for (let i = 0; i < 365; i++) {
    const d = new Date(oneYearAgo)
    d.setDate(oneYearAgo.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    days.push({ date: dateStr, count: 0, level: 0 })
  }
  return days
}

const rawContributions = ref<ContributionDay[]>(generateEmpty365Days())

// Group 365 days into 52/53 columns (weeks of 7 days each)
const weeks = computed(() => {
  const result: ContributionDay[][] = []
  const list = rawContributions.value
  for (let i = 0; i < list.length; i += 7) {
    result.push(list.slice(i, i + 7))
  }
  return result
})

async function fetchLiveGithubContributions() {
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/GodDoesNotPlayDice?y=last')
    if (res.ok) {
      const data = await res.json()
      if (data && data.contributions && data.contributions.length > 0) {
        rawContributions.value = data.contributions
        nextTick(() => {
          if (!userScrolledGithub) {
            scrollToRight(githubScrollRef.value)
          }
        })
      }
    }
  } catch {
    // Retain baseline data without failing
  }
}

function onHoverCell(day: ContributionDay, event: MouseEvent) {
  hoveredDay.value = day
  const target = event.currentTarget as HTMLElement
  if (target) {
    const rect = target.getBoundingClientRect()
    tooltipX.value = Math.round(rect.left + rect.width / 2)
    tooltipY.value = Math.round(rect.top - 8)
  }
}

function onLeaveCell() {
  hoveredDay.value = null
}

// LeetCode Submissions in the past one year state
const hoveredLeetCodeDay = ref<ContributionDay | null>(null)
const tooltipLeetCodeX = ref(0)
const tooltipLeetCodeY = ref(0)

const rawLeetCodeSubmissions = ref<ContributionDay[]>(generateEmpty365Days())

const leetcodeWeeks = computed(() => {
  const result: ContributionDay[][] = []
  const list = rawLeetCodeSubmissions.value
  for (let i = 0; i < list.length; i += 7) {
    result.push(list.slice(i, i + 7))
  }
  return result
})

function onHoverLeetCodeCell(day: ContributionDay, event: MouseEvent) {
  hoveredLeetCodeDay.value = day
  const target = event.currentTarget as HTMLElement
  if (target) {
    const rect = target.getBoundingClientRect()
    tooltipLeetCodeX.value = Math.round(rect.left + rect.width / 2)
    tooltipLeetCodeY.value = Math.round(rect.top - 8)
  }
}

function onLeaveLeetCodeCell() {
  hoveredLeetCodeDay.value = null
}

async function fetchLiveLeetCodeSubmissions() {
  try {
    const res = await fetch('https://alfa-leetcode-api.onrender.com/GodDoesNotPlayDice/calendar')
    if (res.ok) {
      const data = await res.json()
      let calendar: Record<string, number> = {}
      if (typeof data.submissionCalendar === 'string') {
        try {
          calendar = JSON.parse(data.submissionCalendar || '{}')
        } catch {
          calendar = {}
        }
      } else if (data.submissionCalendar && typeof data.submissionCalendar === 'object') {
        calendar = data.submissionCalendar
      }

      const countByDate = new Map<string, number>()
      const timestamps = Object.keys(calendar)
      timestamps.forEach((ts) => {
        const d = new Date(parseInt(ts) * 1000)
        const dateStr = d.toISOString().split('T')[0]
        countByDate.set(dateStr, calendar[ts])
      })

      const today = new Date()
      const oneYearAgo = new Date(today)
      oneYearAgo.setDate(today.getDate() - 364)
      const realDays: ContributionDay[] = []

      for (let i = 0; i < 365; i++) {
        const d = new Date(oneYearAgo)
        d.setDate(oneYearAgo.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]
        const count = countByDate.get(dateStr) || 0
        let level = 0
        if (count >= 6) level = 4
        else if (count >= 4) level = 3
        else if (count >= 2) level = 2
        else if (count >= 1) level = 1
        realDays.push({ date: dateStr, count, level })
      }
      rawLeetCodeSubmissions.value = realDays
      nextTick(() => {
        if (!userScrolledLeetCode) {
          scrollToRight(leetcodeScrollRef.value)
        }
      })
    }
  } catch {
    // Retain clean empty grid
  }
}

// Scroll container references & mobile auto-scroll state
const githubScrollRef = ref<HTMLElement | null>(null)
const leetcodeScrollRef = ref<HTMLElement | null>(null)

let userScrolledGithub = false
let userScrolledLeetCode = false

function onGithubScroll() {
  onLeaveCell()
  userScrolledGithub = true
}

function onLeetCodeScroll() {
  onLeaveLeetCodeCell()
  userScrolledLeetCode = true
}

function scrollToRight(el: HTMLElement | null) {
  if (el && el.scrollWidth > el.clientWidth) {
    el.scrollLeft = el.scrollWidth - el.clientWidth
  }
}

function scrollHeatmapsToEnd(force = false) {
  nextTick(() => {
    if (force || !userScrolledGithub) {
      scrollToRight(githubScrollRef.value)
    }
    if (force || !userScrolledLeetCode) {
      scrollToRight(leetcodeScrollRef.value)
    }
  })
}

// Rolling month labels: align the 12 month markers with the actual rolling timeline ending in current month
function getRollingMonths(allMonths: string[], firstDateStr?: string) {
  if (!firstDateStr) return allMonths
  const parts = firstDateStr.split('-').map(Number)
  if (parts.length < 3 || isNaN(parts[0])) return allMonths
  const firstDate = new Date(parts[0], parts[1] - 1, parts[2])
  const startMonth = firstDate.getDate() > 20 ? (firstDate.getMonth() + 1) % 12 : firstDate.getMonth()
  const result: string[] = []
  for (let i = 0; i < 12; i++) {
    result.push(allMonths[(startMonth + i) % 12])
  }
  return result
}

const githubMonths = computed(() => {
  const allMonths = (tm('activity.github.months') as string[]) || [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ]
  return getRollingMonths(allMonths, rawContributions.value[0]?.date)
})

const leetcodeMonths = computed(() => {
  const allMonths = (tm('activity.leetcode.months') as string[]) || (tm('activity.github.months') as string[]) || [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ]
  return getRollingMonths(allMonths, rawLeetCodeSubmissions.value[0]?.date)
})

let activityObserver: IntersectionObserver | null = null

function handleScroll() {
  if (hoveredDay.value) hoveredDay.value = null
  if (hoveredLeetCodeDay.value) hoveredLeetCodeDay.value = null
}

function handleResize() {
  if (!userScrolledGithub || !userScrolledLeetCode) {
    scrollHeatmapsToEnd()
  }
}

onMounted(() => {
  fetchLiveGithubContributions()
  fetchLiveLeetCodeSubmissions()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)

  scrollHeatmapsToEnd(true)
  setTimeout(() => scrollHeatmapsToEnd(true), 50)
  setTimeout(() => scrollHeatmapsToEnd(true), 250)
  setTimeout(() => scrollHeatmapsToEnd(true), 600)

  const sectionEl = document.getElementById('activity')
  if (sectionEl && typeof IntersectionObserver !== 'undefined') {
    activityObserver = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        if (!userScrolledGithub || !userScrolledLeetCode) {
          scrollHeatmapsToEnd()
        }
      }
    }, { threshold: 0.05 })
    activityObserver.observe(sectionEl)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  activityObserver?.disconnect()
})
</script>

<template>
  <section id="activity" class="py-20 md:py-28 relative overflow-hidden">
    <!-- Ambient cyber light gradients -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl" />
      <div class="absolute bottom-10 right-10 w-[400px] h-[250px] bg-purple-500/5 rounded-full blur-3xl" />
    </div>

    <div class="max-w-6xl mx-auto px-5 md:px-8 relative z-10">

      <!-- Section Header with Cyber Monospace Kicker -->
      <div class="text-center mb-12 md:mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-3">
          {{ t('activity.kicker') }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
          style="font-family: 'Comfortaa', cursive;"
        >
          {{ t('activity.title') }}
        </h2>

        <div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-4 mb-4 rounded-full" />

        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {{ t('activity.subtitle') }}
        </p>
      </div>

      <!-- Main Activity Grid: GitHub Matrix Card + LeetCode Performance Card -->
      <div class="flex flex-col gap-8">

        <!-- 1. GITHUB CONTRIBUTIONS CARD -->
        <div
          class="rounded-3xl bg-[#070b18]/80 border border-cyan-500/20 backdrop-blur-xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,217,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300"
        >
          <!-- Subtle holographic scanline accent -->
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          <!-- Card Top Bar: Icon + Title + Clickable Handle Profile Link -->
          <div class="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white/[0.06] border border-cyan-500/30 flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,217,255,0.15)] shrink-0">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                  {{ t('activity.github.title') }}
                </h3>
                <a
                  href="https://github.com/GodDoesNotPlayDice"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 transition-colors"
                >
                  <span>{{ t('activity.github.handle') }}</span>
                  <svg class="w-3 h-3 text-cyan-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Heatmap Container (Horizontal scroll on mobile with touch support) -->
          <div
            ref="githubScrollRef"
            @scroll.passive="onGithubScroll"
            class="pt-6 overflow-x-auto select-none scrollbar-thin scrollbar-thumb-cyan-500/20"
          >
            <div class="min-w-[700px] flex flex-col gap-2 pb-2">

              <!-- Month header markers -->
              <div class="flex pl-8 text-[10px] font-mono text-slate-500 tracking-wider">
                <span v-for="(m, i) in githubMonths" :key="i" class="flex-1">
                  {{ m }}
                </span>
              </div>

              <!-- Days + Grid Matrix -->
              <div class="flex items-start gap-2">
                <!-- Day of week indicators -->
                <div class="flex flex-col justify-between h-[96px] text-[9px] font-mono text-slate-500 pr-1 select-none">
                  <span>{{ t('activity.github.days.mon') }}</span>
                  <span>{{ t('activity.github.days.wed') }}</span>
                  <span>{{ t('activity.github.days.fri') }}</span>
                </div>

                <!-- 52-week Columns Grid -->
                <div class="flex-1 flex gap-[3.5px]">
                  <div
                    v-for="(week, wIdx) in weeks"
                    :key="wIdx"
                    class="flex flex-col gap-[3.5px]"
                  >
                    <div
                      v-for="(day, dIdx) in week"
                      :key="dIdx"
                      @mouseenter="onHoverCell(day, $event)"
                      @mouseleave="onLeaveCell"
                      class="w-[11.5px] h-[11.5px] rounded-[2.5px] transition-all duration-150 cursor-pointer"
                      :class="[
                        day.level === 0 && 'bg-white/[0.04] border border-white/[0.02] hover:border-cyan-400/40',
                        day.level === 1 && 'bg-cyan-500/25 border border-cyan-500/40 hover:scale-125 hover:shadow-[0_0_8px_#00d9ff]',
                        day.level === 2 && 'bg-cyan-400/55 border border-cyan-400/70 hover:scale-125 hover:shadow-[0_0_10px_#00d9ff]',
                        day.level === 3 && 'bg-cyan-300 border border-cyan-200 hover:scale-125 hover:shadow-[0_0_12px_#00d9ff]',
                        day.level === 4 && 'bg-white border border-cyan-100 shadow-[0_0_6px_rgba(0,217,255,0.7)] hover:scale-125',
                      ]"
                    />
                  </div>
                </div>
              </div>

              <!-- Legend Footer -->
              <div class="flex items-center justify-end gap-2 pt-3 text-[10px] font-mono text-slate-400">
                <span>{{ t('activity.github.less') }}</span>
                <span class="w-2.5 h-2.5 rounded-[2px] bg-white/[0.04] border border-white/[0.04]" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-cyan-500/25 border border-cyan-500/40" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-cyan-400/55 border border-cyan-400/70" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-cyan-300 border border-cyan-200" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-white border border-cyan-100 shadow-[0_0_6px_rgba(0,217,255,0.7)]" />
                <span>{{ t('activity.github.more') }}</span>
              </div>

            </div>
          </div>

          <!-- Tooltip Floating Badge Teleported to Body to Escape Stacking Context -->
          <Teleport to="body">
            <div
              v-if="hoveredDay"
              class="fixed z-[99999] -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-[#0a1224] border border-cyan-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(0,217,255,0.3)] pointer-events-none text-xs font-mono text-white whitespace-nowrap transition-opacity duration-150"
              :style="{ left: `${tooltipX}px`, top: `${tooltipY}px` }"
            >
              <div class="text-cyan-400 font-bold text-center">
                {{ hoveredDay.count }} {{ hoveredDay.count === 1 ? 'commit' : 'commits' }}
              </div>
              <div class="text-[10px] text-slate-400 text-center">
                {{ hoveredDay.date }}
              </div>
              <!-- Centered arrow pointing down toward square -->
              <div class="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-2 h-2 bg-[#0a1224] border-r border-b border-cyan-500/40 rotate-45" />
            </div>
          </Teleport>
        </div>


        <!-- 2. LEETCODE SUBMISSIONS IN THE PAST ONE YEAR CARD -->
        <div
          class="rounded-3xl bg-[#070b18]/80 border border-amber-500/20 backdrop-blur-xl p-5 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.04),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300"
        >
          <!-- Subtle scanline accent -->
          <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          <!-- Card Top Bar: Icon + Title + Clickable Handle Profile Link -->
          <div class="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white/[0.06] border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] shrink-0">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#FFA116" d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.874 5.874 0 0 0 .349 1.017 5.938 5.938 0 0 0 .481.82 5.163 5.163 0 0 0 .835 1.018l2.973 2.778 3.037 2.838a3.957 3.957 0 0 0 2.664 1.054 3.905 3.905 0 0 0 2.663-1.054l4.417-4.137a1.378 1.378 0 0 0 .06-1.947 1.378 1.378 0 0 0-1.948-.06l-4.417 4.137a1.144 1.144 0 0 1-1.579-.001L7.684 18.34l-2.974-2.779a2.41 2.41 0 0 1-.387-.514 2.49 2.49 0 0 1-.225-.515 2.68 2.68 0 0 1-.03-.99 2.6 2.6 0 0 1 .158-.517 2.51 2.51 0 0 1 .584-1.017l3.854-4.127 5.405-5.789a1.374 1.374 0 0 0-.06-1.947A1.374 1.374 0 0 0 13.483 0z" />
                  <path fill="#ffffff" d="M16.48 8.64a1.377 1.377 0 0 0-.974.404L10.99 13.56a1.378 1.378 0 0 0 0 1.948 1.378 1.378 0 0 0 1.948 0l4.516-4.516a1.378 1.378 0 0 0-.974-2.352z" />
                  <path fill="#ffffff" fill-opacity="0.6" d="M8.2 13h12a1 1 0 0 0 0-2H8.2a1 1 0 0 0 0 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                  {{ t('activity.leetcode.title') }}
                </h3>
                <a
                  href="https://leetcode.com/u/GodDoesNotPlayDice"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs font-mono text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1 transition-colors"
                >
                  <span>{{ t('activity.leetcode.handle') }}</span>
                  <svg class="w-3 h-3 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Heatmap Container (Horizontal scroll on mobile with touch support) -->
          <div
            ref="leetcodeScrollRef"
            @scroll.passive="onLeetCodeScroll"
            class="pt-6 overflow-x-auto select-none scrollbar-thin scrollbar-thumb-amber-500/20"
          >
            <div class="min-w-[700px] flex flex-col gap-2 pb-2">

              <!-- Month header markers -->
              <div class="flex pl-8 text-[10px] font-mono text-slate-500 tracking-wider">
                <span v-for="(m, i) in leetcodeMonths" :key="i" class="flex-1">
                  {{ m }}
                </span>
              </div>

              <!-- Days + Grid Matrix -->
              <div class="flex items-start gap-2">
                <!-- Day of week indicators -->
                <div class="flex flex-col justify-between h-[96px] text-[9px] font-mono text-slate-500 pr-1 select-none">
                  <span>{{ t('activity.leetcode.days.mon') }}</span>
                  <span>{{ t('activity.leetcode.days.wed') }}</span>
                  <span>{{ t('activity.leetcode.days.fri') }}</span>
                </div>

                <!-- 52-week Columns Grid in LeetCode Emerald & Amber -->
                <div class="flex-1 flex gap-[3.5px]">
                  <div
                    v-for="(week, wIdx) in leetcodeWeeks"
                    :key="wIdx"
                    class="flex flex-col gap-[3.5px]"
                  >
                    <div
                      v-for="(day, dIdx) in week"
                      :key="dIdx"
                      @mouseenter="onHoverLeetCodeCell(day, $event)"
                      @mouseleave="onLeaveLeetCodeCell"
                      class="w-[11.5px] h-[11.5px] rounded-[2.5px] transition-all duration-150 cursor-pointer"
                      :class="[
                        day.level === 0 && 'bg-white/[0.04] border border-white/[0.02] hover:border-amber-400/40',
                        day.level === 1 && 'bg-emerald-500/25 border border-emerald-500/40 hover:scale-125 hover:shadow-[0_0_8px_#10b981]',
                        day.level === 2 && 'bg-emerald-400/55 border border-emerald-400/70 hover:scale-125 hover:shadow-[0_0_10px_#10b981]',
                        day.level === 3 && 'bg-emerald-300 border border-emerald-200 hover:scale-125 hover:shadow-[0_0_12px_#10b981]',
                        day.level === 4 && 'bg-amber-300 border border-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.8)] hover:scale-125',
                      ]"
                    />
                  </div>
                </div>
              </div>

              <!-- Legend Footer -->
              <div class="flex items-center justify-end gap-2 pt-3 text-[10px] font-mono text-slate-400">
                <span>{{ t('activity.leetcode.less') }}</span>
                <span class="w-2.5 h-2.5 rounded-[2px] bg-white/[0.04] border border-white/[0.04]" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/25 border border-emerald-500/40" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-emerald-400/55 border border-emerald-400/70" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-emerald-300 border border-emerald-200" />
                <span class="w-2.5 h-2.5 rounded-[2px] bg-amber-300 border border-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                <span>{{ t('activity.leetcode.more') }}</span>
              </div>

            </div>
          </div>

          <!-- Tooltip Floating Badge for LeetCode Teleported to Body -->
          <Teleport to="body">
            <div
              v-if="hoveredLeetCodeDay"
              class="fixed z-[99999] -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-[#0a1224] border border-amber-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(245,158,11,0.3)] pointer-events-none text-xs font-mono text-white whitespace-nowrap transition-opacity duration-150"
              :style="{ left: `${tooltipLeetCodeX}px`, top: `${tooltipLeetCodeY}px` }"
            >
              <div class="text-amber-400 font-bold text-center">
                {{ hoveredLeetCodeDay.count }} {{ hoveredLeetCodeDay.count === 1 ? t('activity.leetcode.submission') : t('activity.leetcode.submissions') }}
              </div>
              <div class="text-[10px] text-slate-400 text-center">
                {{ hoveredLeetCodeDay.date }}
              </div>
              <!-- Centered arrow pointing down toward square -->
              <div class="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-2 h-2 bg-[#0a1224] border-r border-b border-amber-500/40 rotate-45" />
            </div>
          </Teleport>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* Custom scrollbar for horizontal heatmap */
.scrollbar-thin::-webkit-scrollbar {
  height: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 9999px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(0, 217, 255, 0.25);
  border-radius: 9999px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 217, 255, 0.6);
}
.scrollbar-thumb-amber-500\/20::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.25);
  border-radius: 9999px;
}
.scrollbar-thumb-amber-500\/20::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 158, 11, 0.6);
}
</style>
