"use client"

import { useEffect, useRef } from "react"

type Props = {
  state: React.RefObject<string[]>
}

export function CanvasView(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 512
    canvas.width = size
    canvas.height = size

    // 文字をシャープにするための設定らしい
    ctx.imageSmoothingEnabled = false

    const render = () => {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, size, size)

      const cols = 32
      const rows = 32
      const cellWidth = size / cols
      const cellHeight = size / rows

      ctx.font = `${Math.floor(cellHeight * 0.8)}px sans-serif`
      ctx.fillStyle = "#000000"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const textGrid = props.state.current
      if (textGrid) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const index = row * cols + col
            const char = textGrid[index]
            const x = Math.floor(col * cellWidth + cellWidth / 2)
            const y = Math.floor(row * cellHeight + cellHeight / 2)
            ctx.fillText(char, x, y)
          }
        }
      }
    }

    const interval = setInterval(render, 10)

    render()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="aspect-square w-full"
      style={{
        imageRendering: "pixelated",
      }}
    />
  )
}
