"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseX: number
  baseY: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    // Mouse com posição inicial fora da tela
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120, // Raio de atração/repulsão do mouse
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      // Quantidade de pontos baseada no tamanho da tela
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000)

      for (let i = 0; i < numberOfParticles; i++) {
        const radius = Math.random() * 2 + 1.5
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius,
          baseX: x,
          baseY: y,
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    resizeCanvas()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Movimento natural contínuo
        p.x += p.vx
        p.y += p.vy

        // Rebater nas bordas
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Interação com o Mouse (Repulsão suave ao passar o mouse)
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const force = (mouse.radius - distance) / mouse.radius
          
          // Afasta o ponto do cursor
          p.x -= forceDirectionX * force * 4
          p.y -= forceDirectionY * force * 4
        }

        // Desenhar a partícula
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        // Cor azulada/escura combinando com a paleta DARTI
        ctx.fillStyle = "rgba(10, 25, 60, 0.4)" 
        ctx.fill()

        // Conectar pontos próximos com linhas sutis
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const distNext = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)

          if (distNext < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(10, 25, 60, ${0.15 * (1 - distNext / 100)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}