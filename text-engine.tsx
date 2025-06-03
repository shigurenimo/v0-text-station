"use client"

import { useState, useMemo } from "react"

type Props = {
  width?: number
  height?: number
}

/**
 * テキストエンジンコンポーネント
 * 512x512のグリッドで文字を表示する
 */
export default function TextEngine(props: Props) {
  const width = props.width || 512
  const height = props.height || 512

  // 文字列の配列をstateで管理
  const [textGrid, setTextGrid] = useState<string[]>(() => {
    const grid = new Array(width * height)
    for (let i = 0; i < grid.length; i++) {
      // サンプルテキストで初期化
      if (i % 100 === 0) {
        grid[i] = "■"
      } else if (i % 50 === 0) {
        grid[i] = "○"
      } else if (i % 10 === 0) {
        grid[i] = "."
      } else {
        grid[i] = " "
      }
    }
    return grid
  })

  // グリッドスタイルをメモ化
  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${width}, 1fr)`,
      gridTemplateRows: `repeat(${height}, 1fr)`,
      width: "100%",
      height: "100vh",
      fontFamily: "monospace",
      fontSize: "1px",
      lineHeight: "1",
      overflow: "hidden",
    }),
    [width, height],
  )

  // 特定の位置の文字を更新する関数
  const updateCharAt = (x: number, y: number, char: string) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const index = y * width + x
      setTextGrid((prev) => {
        const newGrid = [...prev]
        newGrid[index] = char
        return newGrid
      })
    }
  }

  // グリッド全体をクリアする関数
  const clearGrid = () => {
    setTextGrid(new Array(width * height).fill(" "))
  }

  // ランダムな文字でグリッドを埋める関数
  const fillRandomChars = () => {
    const chars = ["■", "□", "●", "○", "▲", "△", "▼", "▽", "◆", "◇", "★", "☆"]
    setTextGrid((prev) =>
      prev.map(() => {
        return Math.random() < 0.1 ? chars[Math.floor(Math.random() * chars.length)] : " "
      }),
    )
  }

  return (
    <div className="w-full h-screen bg-black text-green-400 p-4">
      <div className="mb-4 space-x-2">
        <button onClick={clearGrid} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
          クリア
        </button>
        <button onClick={fillRandomChars} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
          ランダム文字
        </button>
        <span className="text-white text-sm">
          グリッドサイズ: {width} x {height}
        </span>
      </div>

      <div style={gridStyle}>
        {textGrid.map((char, index) => (
          <div
            key={index}
            className="flex items-center justify-center"
            style={{
              width: "100%",
              height: "100%",
              minWidth: "1px",
              minHeight: "1px",
            }}
            onClick={() => {
              const x = index % width
              const y = Math.floor(index / width)
              updateCharAt(x, y, char === " " ? "■" : " ")
            }}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  )
}
