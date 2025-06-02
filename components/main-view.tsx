"use client"

import { useEffect, useRef, useState } from "react"

export function MainView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [text] = useState("a")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 512
    canvas.width = size
    canvas.height = size

    // 文字をシャープにするための設定
    ctx.imageSmoothingEnabled = false

    // 背景を塗りつぶす
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // 32x32のグリッドに文字を配置
    const cols = 32
    const rows = 32
    const cellWidth = size / cols
    const cellHeight = size / rows

    // フォント設定
    ctx.font = `${Math.floor(cellHeight * 1)}px sans-serif`
    ctx.fillStyle = "#000000"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = Math.floor(col * cellWidth + cellWidth / 2)
        const y = Math.floor(row * cellHeight + cellHeight / 2)
        ctx.fillText(text, x, y)
      }
    }
  }, [text])

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        className="aspect-square w-full max-w-xl border"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  )
}
