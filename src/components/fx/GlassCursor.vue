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

function updatePosition() {
  // Smooth spring lerp for ring and aura
  ringX += (mouseX - ringX) * 0.18
  ringY += (mouseY - ringY) * 0.18

  auraX += (mouseX - auraX) * 0.08
  auraY += (mouseY - auraY) * 0.08

  if (dotRef.value) {
    dotRef.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
  }
  if (ringRef.value) {
    const scale = isHoveringInteractive.value ? 1.4 : 1
    ringRef.value.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${scale})`
  }
  if (auraRef.value) {
    auraRef.value.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`
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

  // Check if hovering interactive element
  const target = e.target as HTMLElement | null
  if (target) {
    const isInteractive = !!target.closest(
      'a, button, [role="button"], input, textarea, select, .cursor-pointer, canvas'
    )
    isHoveringInteractive.value = isInteractive
  }
}

function onMouseLeave() {
  isVisible.value = false
}

function onTouchStart() {
  isTouch = true
  isVisible.value = false
}

onMounted(() => {
  if (window.matchMedia('(pointer: coarse)').matches) {
    isTouch = true
    return
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('touchstart', onTouchStart, { passive: true })

  updatePosition()
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
      class="fixed top-0 left-0 w-[110px] h-[110px] -ml-[55px] -mt-[55px] rounded-full pointer-events-none will-change-transform"
      style="background: radial-gradient(circle, rgba(0, 217, 255, 0.12) 0%, rgba(167, 139, 250, 0.05) 45%, transparent 70%); filter: blur(6px);"
    />

    <!-- Layer 2: Glass lens ring (40px) -->
    <div
      ref="ringRef"
      class="fixed top-0 left-0 w-[42px] h-[42px] -ml-[21px] -mt-[21px] rounded-full pointer-events-none will-change-transform backdrop-blur-[3px] border border-white/20 transition-[width,height,border-color] duration-150"
      :style="{
        background: 'rgba(255, 255, 255, 0.03)',
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
