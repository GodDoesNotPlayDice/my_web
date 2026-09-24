<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const dotRef = ref<HTMLDivElement | null>(null)
const ringRef = ref<HTMLDivElement | null>(null)
const auraRef = ref<HTMLDivElement | null>(null)

const isVisible = ref(false)
const isHoveringInteractive = ref(false)
let isTouch = false

let mouseX = -100
let mouseY = -100
let ringX = -100
let ringY = -100
let auraX = -100
let auraY = -100
let animId: number | null = null
let isRunning = false
let lastCheckTime = 0

function updatePosition() {
  const dx = mouseX - ringX
  const dy = mouseY - ringY
  const adx = mouseX - auraX
  const ady = mouseY - auraY

  ringX += dx * 0.22
  ringY += dy * 0.22
  auraX += adx * 0.12
  auraY += ady * 0.12

  if (dotRef.value) {
    dotRef.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  }
  if (ringRef.value) {
    const scale = isHoveringInteractive.value ? 1.35 : 1
    ringRef.value.style.transform = `translate3d(${Math.round(ringX)}px, ${Math.round(ringY)}px, 0) scale(${scale})`
  }
  if (auraRef.value) {
    auraRef.value.style.transform = `translate3d(${Math.round(auraX)}px, ${Math.round(auraY)}px, 0)`
  }

  // Sleep when settled to save 100% idle frames
  if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2 && Math.abs(adx) < 0.3 && Math.abs(ady) < 0.3) {
    isRunning = false
    animId = null
    return
  }

  animId = requestAnimationFrame(updatePosition)
}

function onMouseMove(e: MouseEvent) {
  if (isTouch) return
  mouseX = e.clientX
  mouseY = e.clientY

  if (!isVisible.value) {
    isVisible.value = true
    ringX = mouseX
    ringY = mouseY
    auraX = mouseX
    auraY = mouseY
  }

  if (!isRunning) {
    isRunning = true
    animId = requestAnimationFrame(updatePosition)
  }

  // Throttled check for interactive element (max once every 100ms)
  const now = performance.now()
  if (now - lastCheckTime > 100) {
    lastCheckTime = now
    const target = e.target as HTMLElement | null
    if (target) {
      isHoveringInteractive.value = !!target.closest(
        'a, button, [role="button"], input, textarea, select, .cursor-pointer, canvas'
      )
    }
  }
}

function onMouseLeave() {
  isVisible.value = false
  isRunning = false
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
}

function onTouchStart() {
  isTouch = true
  isVisible.value = false
  isRunning = false
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
}

onMounted(() => {
  if (window.matchMedia('(pointer: coarse)').matches) {
    isTouch = true
    return
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('touchstart', onTouchStart)
})
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300"
    :class="isVisible ? 'opacity-100' : 'opacity-0'"
    aria-hidden="true"
  >
    <!-- Layer 1: Ambient trailing aura (100px) -->
    <div
      ref="auraRef"
      class="fixed top-0 left-0 w-[100px] h-[100px] -ml-[50px] -mt-[50px] rounded-full pointer-events-none will-change-transform"
      style="background: radial-gradient(circle, rgba(0, 217, 255, 0.08) 0%, rgba(167, 139, 250, 0.03) 45%, transparent 70%);"
    />

    <!-- Layer 2: Glass lens ring (42px) without expensive backdrop-filter -->
    <div
      ref="ringRef"
      class="fixed top-0 left-0 w-[42px] h-[42px] -ml-[21px] -mt-[21px] rounded-full pointer-events-none will-change-transform bg-cyan-400/[0.04] border border-white/20 transition-[width,height,border-color] duration-150"
      :style="{
        boxShadow: isHoveringInteractive
          ? '0 0 16px rgba(0, 217, 255, 0.35), inset 0 1px 0 rgba(255,255,255,0.3)'
          : '0 0 10px rgba(0, 217, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
        borderColor: isHoveringInteractive ? 'rgba(0, 217, 255, 0.6)' : 'rgba(255, 255, 255, 0.25)',
      }"
    >
      <!-- Specular reflection highlight on lens -->
      <div
        class="absolute top-1.5 left-2 w-2.5 h-1 rounded-full bg-white/40 blur-[0.8px] -rotate-25"
      />
    </div>

    <!-- Layer 3: Sharp glowing center point (6px) -->
    <div
      ref="dotRef"
      class="fixed top-0 left-0 w-[6px] h-[6px] -ml-[3px] -mt-[3px] rounded-full pointer-events-none will-change-transform bg-[#00d9ff]"
      style="box-shadow: 0 0 8px #00d9ff, 0 0 14px rgba(0, 217, 255, 0.8);"
    />
  </div>
</template>
