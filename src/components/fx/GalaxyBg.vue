<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Meteor {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  size: number
  active: boolean
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  speed: number
  color: string
}

let animationFrameId: number | null = null
let offscreenStarsCanvas: HTMLCanvasElement | null = null
let offscreenNebulaCyan: HTMLCanvasElement | null = null
let offscreenNebulaPurple: HTMLCanvasElement | null = null
let offscreenCoreGlow: HTMLCanvasElement | null = null
let cachedBgGrad: CanvasGradient | null = null

// Mouse tracking
let mouseX = -1000
let mouseY = -1000
let targetMouseX = -1000
let targetMouseY = -1000
let isHovering = false

// Galaxy rotation angle
let galaxyAngle = 0

// Ripples array
const ripples: Ripple[] = []

// Meteors array
const meteors: Meteor[] = []
let lastMeteorTime = 0

// Spiral Galaxy Points (Float32Array)
// Each particle: [radius, angle, speedMult, size, armIndex, isCore]
let numSpiralPoints = 450
let spiralPoints: Float32Array | null = null

// FPS throttle
let lastFrameTime = 0

function initSpiralPoints(width: number, height: number) {
  const minDim = Math.min(width, height)
  const maxRadius = minDim * 0.48
  numSpiralPoints = window.innerWidth < 768 ? 200 : 450

  // 6 floats per particle: [radius, angle, speedMult, size, armIndex, isCore]
  spiralPoints = new Float32Array(numSpiralPoints * 6)
  const arms = 3

  for (let i = 0; i < numSpiralPoints; i++) {
    const idx = i * 6
    const arm = i % arms
    const armOffset = (arm * 2 * Math.PI) / arms

    // Radius distribution concentrated toward center
    const rDist = Math.pow(Math.random(), 1.5)
    const r = 20 + rDist * maxRadius

    const spiralAngle = Math.sqrt(r) * 0.45 + armOffset
    const spread = (Math.random() - 0.5) * (0.35 + rDist * 0.4)
    const angle = spiralAngle + spread

    const speedMult = 0.8 + Math.random() * 0.4
    const size = Math.random() < 0.12 ? 1.6 + Math.random() * 1.2 : 0.6 + Math.random() * 1.0
    const isCore = (r / maxRadius < 0.22) ? 1 : 0

    spiralPoints[idx] = r
    spiralPoints[idx + 1] = angle
    spiralPoints[idx + 2] = speedMult
    spiralPoints[idx + 3] = size
    spiralPoints[idx + 4] = arm
    spiralPoints[idx + 5] = isCore
  }
}

function buildOffscreenStars(width: number, height: number) {
  offscreenStarsCanvas = document.createElement('canvas')
  offscreenStarsCanvas.width = width
  offscreenStarsCanvas.height = height
  const ctx = offscreenStarsCanvas.getContext('2d')
  if (!ctx) return

  const starCount = Math.floor((width * height) / 3800)

  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() < 0.85 ? Math.random() * 1.1 + 0.3 : Math.random() * 1.8 + 1.1
    const alpha = Math.random() * 0.7 + 0.2

    const colorRoll = Math.random()
    let starColor = 'rgba(255, 255, 255, '
    if (colorRoll < 0.25) {
      starColor = 'rgba(0, 217, 255, '
    } else if (colorRoll < 0.4) {
      starColor = 'rgba(167, 139, 250, '
    }

    ctx.fillStyle = `${starColor}${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

function buildSprites() {
  // 1. Nebula Cyan Sprite (240x240)
  const nSize = 240
  offscreenNebulaCyan = document.createElement('canvas')
  offscreenNebulaCyan.width = nSize
  offscreenNebulaCyan.height = nSize
  const c1 = offscreenNebulaCyan.getContext('2d')
  if (c1) {
    const g = c1.createRadialGradient(nSize / 2, nSize / 2, 8, nSize / 2, nSize / 2, nSize / 2)
    g.addColorStop(0, 'rgba(0, 217, 255, 0.08)')
    g.addColorStop(0.5, 'rgba(14, 165, 233, 0.03)')
    g.addColorStop(1, 'transparent')
    c1.fillStyle = g
    c1.fillRect(0, 0, nSize, nSize)
  }

  // 2. Nebula Purple Sprite (240x240)
  offscreenNebulaPurple = document.createElement('canvas')
  offscreenNebulaPurple.width = nSize
  offscreenNebulaPurple.height = nSize
  const c2 = offscreenNebulaPurple.getContext('2d')
  if (c2) {
    const g = c2.createRadialGradient(nSize / 2, nSize / 2, 8, nSize / 2, nSize / 2, nSize / 2)
    g.addColorStop(0, 'rgba(167, 139, 250, 0.07)')
    g.addColorStop(0.6, 'rgba(139, 92, 246, 0.02)')
    g.addColorStop(1, 'transparent')
    c2.fillStyle = g
    c2.fillRect(0, 0, nSize, nSize)
  }

  // 3. Core Glow Sprite (180x180)
  const coreSize = 180
  offscreenCoreGlow = document.createElement('canvas')
  offscreenCoreGlow.width = coreSize
  offscreenCoreGlow.height = coreSize
  const c3 = offscreenCoreGlow.getContext('2d')
  if (c3) {
    const g = c3.createRadialGradient(coreSize / 2, coreSize / 2, 0, coreSize / 2, coreSize / 2, coreSize / 2)
    g.addColorStop(0, 'rgba(255, 255, 255, 0.45)')
    g.addColorStop(0.2, 'rgba(0, 217, 255, 0.35)')
    g.addColorStop(0.6, 'rgba(167, 139, 250, 0.12)')
    g.addColorStop(1, 'transparent')
    c3.fillStyle = g
    c3.fillRect(0, 0, coreSize, coreSize)
  }
}

function spawnMeteor(width: number) {
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2
  const startX = Math.random() * width * 1.2 - width * 0.1
  const startY = -40

  meteors.push({
    x: startX,
    y: startY,
    length: 90 + Math.random() * 80,
    speed: 12 + Math.random() * 10,
    angle,
    opacity: 0.8 + Math.random() * 0.2,
    size: 1.5 + Math.random() * 1.2,
    active: true,
  })
}

function addRipple(x: number, y: number, isClick = false) {
  if (ripples.length > 8) ripples.shift()
  ripples.push({
    x,
    y,
    radius: 4,
    maxRadius: isClick ? 130 : 65,
    alpha: isClick ? 0.70 : 0.30,
    speed: isClick ? 3.5 : 2.0,
    color: isClick ? '#00d9ff' : '#a78bfa',
  })
}

function render(now = performance.now()) {
  animationFrameId = requestAnimationFrame(render)

  // Cap rendering to ~60 FPS (skip frames on 120Hz/144Hz to avoid unnecessary GPU/CPU burn)
  if (now - lastFrameTime < 15.5) return
  lastFrameTime = now

  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  ctx.save()

  // 1. Deep cosmic gradient background (cached)
  if (cachedBgGrad) {
    ctx.fillStyle = cachedBgGrad
    ctx.fillRect(0, 0, width, height)
  }

  // 2. Offscreen cached stars
  if (offscreenStarsCanvas) {
    ctx.drawImage(offscreenStarsCanvas, 0, 0)
  }

  // 3. Nebula glowing orbs (hardware-accelerated drawImage instead of full-screen gradients)
  const time = now * 0.0006
  if (offscreenNebulaCyan) {
    const nebula1X = width * 0.35 + Math.sin(time * 0.6) * 60
    const nebula1Y = height * 0.35 + Math.cos(time * 0.5) * 50
    const s1 = width * 0.75
    ctx.drawImage(offscreenNebulaCyan, nebula1X - s1 / 2, nebula1Y - s1 / 2, s1, s1)
  }

  if (offscreenNebulaPurple) {
    const nebula2X = width * 0.68 + Math.cos(time * 0.7) * 70
    const nebula2Y = height * 0.55 + Math.sin(time * 0.6) * 60
    const s2 = width * 0.8
    ctx.drawImage(offscreenNebulaPurple, nebula2X - s2 / 2, nebula2Y - s2 / 2, s2, s2)
  }

  // 4. Spiral Galaxy Arms (Batched into 3 draw calls instead of hundreds)
  galaxyAngle += 0.0009
  const centerX = width * 0.55
  const centerY = height * 0.42

  if (spiralPoints) {
    // Arrays to collect coordinates per color batch
    const coreP: number[] = []
    const cyanP: number[] = []
    const purpleP: number[] = []

    for (let i = 0; i < numSpiralPoints; i++) {
      const idx = i * 6
      const r = spiralPoints[idx]
      const baseAngle = spiralPoints[idx + 1]
      const speedMult = spiralPoints[idx + 2]
      const size = spiralPoints[idx + 3]
      const arm = spiralPoints[idx + 4]
      const isCore = spiralPoints[idx + 5]

      const currentAngle = baseAngle + galaxyAngle * speedMult
      const px = centerX + Math.cos(currentAngle) * r * 1.15
      const py = centerY + Math.sin(currentAngle) * (r * 0.65)

      if (px < -20 || px > width + 20 || py < -20 || py > height + 20) continue

      if (isCore === 1) {
        coreP.push(px, py, size)
      } else if (arm === 0 || arm === 2) {
        cyanP.push(px, py, size)
      } else {
        purpleP.push(px, py, size)
      }
    }

    // Batch 1: Core particles
    if (coreP.length > 0) {
      ctx.fillStyle = 'rgba(224, 247, 255, 0.75)'
      ctx.beginPath()
      for (let i = 0; i < coreP.length; i += 3) {
        ctx.moveTo(coreP[i] + coreP[i + 2], coreP[i + 1])
        ctx.arc(coreP[i], coreP[i + 1], coreP[i + 2], 0, Math.PI * 2)
      }
      ctx.fill()
    }

    // Batch 2: Cyan arm particles
    if (cyanP.length > 0) {
      ctx.fillStyle = 'rgba(0, 217, 255, 0.65)'
      ctx.beginPath()
      for (let i = 0; i < cyanP.length; i += 3) {
        ctx.moveTo(cyanP[i] + cyanP[i + 2], cyanP[i + 1])
        ctx.arc(cyanP[i], cyanP[i + 1], cyanP[i + 2], 0, Math.PI * 2)
      }
      ctx.fill()
    }

    // Batch 3: Purple arm particles
    if (purpleP.length > 0) {
      ctx.fillStyle = 'rgba(167, 139, 250, 0.60)'
      ctx.beginPath()
      for (let i = 0; i < purpleP.length; i += 3) {
        ctx.moveTo(purpleP[i] + purpleP[i + 2], purpleP[i + 1])
        ctx.arc(purpleP[i], purpleP[i + 1], purpleP[i + 2], 0, Math.PI * 2)
      }
      ctx.fill()
    }
  }

  // Core brilliant galactic center glow (pre-rendered sprite)
  if (offscreenCoreGlow) {
    ctx.drawImage(offscreenCoreGlow, centerX - 90, centerY - 90, 180, 180)
  }

  // 5. Shooting Stars / Meteors
  if (now - lastMeteorTime > 3400 && Math.random() < 0.4) {
    spawnMeteor(width)
    lastMeteorTime = now
  }

  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i]
    if (!m.active) {
      meteors.splice(i, 1)
      continue
    }

    const tailX = m.x - Math.cos(m.angle) * m.length
    const tailY = m.y - Math.sin(m.angle) * m.length

    const meteorGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
    meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`)
    meteorGrad.addColorStop(0.2, `rgba(0, 217, 255, ${m.opacity * 0.8})`)
    meteorGrad.addColorStop(1, 'transparent')

    ctx.strokeStyle = meteorGrad
    ctx.lineWidth = m.size
    ctx.beginPath()
    ctx.moveTo(m.x, m.y)
    ctx.lineTo(tailX, tailY)
    ctx.stroke()

    m.x += Math.cos(m.angle) * m.speed
    m.y += Math.sin(m.angle) * m.speed
    m.opacity *= 0.985

    if (m.y > height + 100 || m.x > width + 100 || m.opacity < 0.03) {
      m.active = false
    }
  }

  // 6. Smooth Mouse Follower Light Aura
  if (isHovering && targetMouseX > 0 && targetMouseY > 0) {
    mouseX += (targetMouseX - mouseX) * 0.08
    mouseY += (targetMouseY - mouseY) * 0.08

    const auraGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200)
    auraGrad.addColorStop(0, 'rgba(0, 217, 255, 0.07)')
    auraGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.025)')
    auraGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = auraGrad
    ctx.beginPath()
    ctx.arc(mouseX, mouseY, 200, 0, Math.PI * 2)
    ctx.fill()
  }

  // 7. Interactive Ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i]
    r.radius += r.speed
    r.alpha *= 0.955

    if (r.alpha < 0.01 || r.radius > r.maxRadius) {
      ripples.splice(i, 1)
      continue
    }

    ctx.beginPath()
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${r.color === '#00d9ff' ? '0, 217, 255' : '167, 139, 250'}, ${r.alpha})`
    ctx.lineWidth = 1.2
    ctx.stroke()
  }

  ctx.restore()
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return

  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (ctx) {
    cachedBgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.4,
      50,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.8
    )
    cachedBgGrad.addColorStop(0, '#0a0d1b')
    cachedBgGrad.addColorStop(0.45, '#050711')
    cachedBgGrad.addColorStop(1, '#020308')
  }

  buildOffscreenStars(width, height)
  buildSprites()
  initSpiralPoints(width, height)
}

function handleMouseMove(e: MouseEvent) {
  targetMouseX = e.clientX
  targetMouseY = e.clientY
  isHovering = true

  if (Math.random() < 0.03) {
    addRipple(e.clientX, e.clientY, false)
  }
}

function handleClick(e: MouseEvent) {
  addRipple(e.clientX, e.clientY, true)
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    targetMouseX = e.touches[0].clientX
    targetMouseY = e.touches[0].clientY
    isHovering = true
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  } else {
    if (!animationFrameId) {
      lastFrameTime = performance.now()
      render()
    }
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('click', handleClick, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)

  render()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('click', handleClick)
  window.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    <canvas ref="canvasRef" class="w-full h-full block" />
    <!-- Fine HUD cosmic grid overlay -->
    <div
      class="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
      style="background-image: linear-gradient(rgba(0, 217, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.025) 1px, transparent 1px); background-size: 56px 56px;"
    />
  </div>
</template>
