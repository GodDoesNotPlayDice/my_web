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

// Spiral Galaxy Points (Float32Array for high performance)
// Each particle: [baseRadius, baseAngle, speedMult, size, armIndex, zOffset]
let numSpiralPoints = 1800
let spiralPoints: Float32Array | null = null

function initSpiralPoints(width: number, height: number) {
  const minDim = Math.min(width, height)
  const maxRadius = minDim * 0.48
  numSpiralPoints = window.innerWidth < 768 ? 1000 : 2000

  // 6 floats per particle: [radius, angle, speedMult, size, armIndex, zOffset]
  spiralPoints = new Float32Array(numSpiralPoints * 6)
  const arms = 3

  for (let i = 0; i < numSpiralPoints; i++) {
    const idx = i * 6
    // Arm assignment
    const arm = i % arms
    const armOffset = (arm * 2 * Math.PI) / arms

    // Radius distributed with density concentrated toward center
    const rDist = Math.pow(Math.random(), 1.6)
    const r = 20 + rDist * maxRadius

    // Spiral curve theta = a * log(r) or a * sqrt(r)
    const spiralAngle = Math.sqrt(r) * 0.45 + armOffset
    // Gaussian spread around the arm
    const spread = (Math.random() - 0.5) * (0.35 + rDist * 0.4)
    const angle = spiralAngle + spread

    const speedMult = 0.8 + Math.random() * 0.4
    const size = Math.random() < 0.1 ? 1.8 + Math.random() * 1.4 : 0.6 + Math.random() * 1.2
    const zOffset = (Math.random() - 0.5) * 40

    spiralPoints[idx] = r
    spiralPoints[idx + 1] = angle
    spiralPoints[idx + 2] = speedMult
    spiralPoints[idx + 3] = size
    spiralPoints[idx + 4] = arm
    spiralPoints[idx + 5] = zOffset
  }
}

function buildOffscreenStars(width: number, height: number) {
  offscreenStarsCanvas = document.createElement('canvas')
  offscreenStarsCanvas.width = width
  offscreenStarsCanvas.height = height
  const ctx = offscreenStarsCanvas.getContext('2d')
  if (!ctx) return

  const starCount = Math.floor((width * height) / 3200)

  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() < 0.85 ? Math.random() * 1.1 + 0.3 : Math.random() * 1.8 + 1.2
    const alpha = Math.random() * 0.7 + 0.2

    // Slight chromatic variety: cyan-white, soft violet, bright white
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

function spawnMeteor(width: number) {
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2 // ~45 deg downward
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
  if (ripples.length > 12) ripples.shift()
  ripples.push({
    x,
    y,
    radius: 4,
    maxRadius: isClick ? 140 : 70,
    alpha: isClick ? 0.75 : 0.35,
    speed: isClick ? 3.5 : 2.0,
    color: isClick ? '#00d9ff' : '#a78bfa',
  })
}

function render() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // Normalize scale for crisp rendering
  ctx.save()

  // 1. Deep cosmic gradient background
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.4,
    50,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.8
  )
  bgGrad.addColorStop(0, '#0a0d1b')
  bgGrad.addColorStop(0.45, '#050711')
  bgGrad.addColorStop(1, '#020308')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 2. Offscreen cached stars
  if (offscreenStarsCanvas) {
    ctx.drawImage(offscreenStarsCanvas, 0, 0)
  }

  // 3. Nebula glowing orbs
  const time = performance.now() * 0.0006
  const nebula1X = width * 0.35 + Math.sin(time * 0.6) * 60
  const nebula1Y = height * 0.35 + Math.cos(time * 0.5) * 50
  const nebGrad1 = ctx.createRadialGradient(nebula1X, nebula1Y, 10, nebula1X, nebula1Y, width * 0.38)
  nebGrad1.addColorStop(0, 'rgba(0, 217, 255, 0.07)')
  nebGrad1.addColorStop(0.5, 'rgba(14, 165, 233, 0.03)')
  nebGrad1.addColorStop(1, 'transparent')
  ctx.fillStyle = nebGrad1
  ctx.fillRect(0, 0, width, height)

  const nebula2X = width * 0.68 + Math.cos(time * 0.7) * 70
  const nebula2Y = height * 0.55 + Math.sin(time * 0.6) * 60
  const nebGrad2 = ctx.createRadialGradient(nebula2X, nebula2Y, 10, nebula2X, nebula2Y, width * 0.42)
  nebGrad2.addColorStop(0, 'rgba(167, 139, 250, 0.06)')
  nebGrad2.addColorStop(0.6, 'rgba(139, 92, 246, 0.02)')
  nebGrad2.addColorStop(1, 'transparent')
  ctx.fillStyle = nebGrad2
  ctx.fillRect(0, 0, width, height)

  // 4. Spiral Galaxy Arms
  galaxyAngle += 0.0009
  const centerX = width * 0.55
  const centerY = height * 0.42

  if (spiralPoints) {
    for (let i = 0; i < numSpiralPoints; i++) {
      const idx = i * 6
      const r = spiralPoints[idx]
      const baseAngle = spiralPoints[idx + 1]
      const speedMult = spiralPoints[idx + 2]
      const size = spiralPoints[idx + 3]
      const arm = spiralPoints[idx + 4]

      const currentAngle = baseAngle + galaxyAngle * speedMult
      const px = centerX + Math.cos(currentAngle) * r * 1.15
      const py = centerY + Math.sin(currentAngle) * (r * 0.65) // inclined perspective

      if (px < -20 || px > width + 20 || py < -20 || py > height + 20) continue

      // Fade particles as they approach outer edges
      const distFromCenter = r / (Math.min(width, height) * 0.48)
      const alpha = Math.max(0.08, 0.85 - distFromCenter * 0.75)

      // Color interpolation: core is bright white-cyan, arms vary between cyan and soft violet
      if (distFromCenter < 0.25) {
        ctx.fillStyle = `rgba(224, 247, 255, ${alpha})`
      } else if (arm === 0) {
        ctx.fillStyle = `rgba(0, 217, 255, ${alpha * 0.85})`
      } else if (arm === 1) {
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.8})`
      } else {
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.8})`
      }

      ctx.beginPath()
      ctx.arc(px, py, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Core brilliant galactic center glow
  const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 90)
  coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.45)')
  coreGlow.addColorStop(0.2, 'rgba(0, 217, 255, 0.35)')
  coreGlow.addColorStop(0.6, 'rgba(167, 139, 250, 0.12)')
  coreGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = coreGlow
  ctx.beginPath()
  ctx.arc(centerX, centerY, 90, 0, Math.PI * 2)
  ctx.fill()

  // 5. Shooting Stars / Meteors
  const now = performance.now()
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

    // Move meteor
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

    const auraGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 220)
    auraGrad.addColorStop(0, 'rgba(0, 217, 255, 0.09)')
    auraGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.035)')
    auraGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = auraGrad
    ctx.beginPath()
    ctx.arc(mouseX, mouseY, 220, 0, Math.PI * 2)
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
  animationFrameId = requestAnimationFrame(render)
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas) return

  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width
  canvas.height = height

  buildOffscreenStars(width, height)
  initSpiralPoints(width, height)
}

function handleMouseMove(e: MouseEvent) {
  targetMouseX = e.clientX
  targetMouseY = e.clientY
  isHovering = true

  // Occasional subtle motion ripple
  if (Math.random() < 0.04) {
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
