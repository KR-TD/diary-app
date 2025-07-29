"use client"

import { useEffect, useState } from "react"

export function FloatingTrophies() {
  const [trophies, setTrophies] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const newTrophies = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setTrophies(newTrophies)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {trophies.map((trophy) => (
        <div
          key={trophy.id}
          className="absolute text-2xl opacity-20 animate-bounce"
          style={{
            left: `${trophy.x}%`,
            top: `${trophy.y}%`,
            animationDelay: `${trophy.delay}s`,
            animationDuration: "3s",
          }}
        >
          🏆
        </div>
      ))}
    </div>
  )
}

export function GoldenParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}
