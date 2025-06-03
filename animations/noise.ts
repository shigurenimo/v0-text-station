export function createNoiseAnimation(cols: number, rows: number) {
  let frameCount = 0
  let glitchIntensity = 0
  let prevGrid = new Array(cols * rows).fill(" ")

  const getRandomChar = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    return chars[Math.floor(Math.random() * chars.length)]
  }

  const updateNoise = (grid: string[]) => {
    frameCount++

    // ランダムにグリッチの強度を変更
    if (Math.random() > 0.9) {
      glitchIntensity = Math.random()
    } else {
      glitchIntensity *= 0.9 // 徐々に減衰
    }

    // 水平方向のグリッチライン
    const glitchLines = []
    if (glitchIntensity > 0.3) {
      const numLines = Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < numLines; i++) {
        glitchLines.push(Math.floor(Math.random() * rows))
      }
    }

    // グリッド更新
    for (let row = 0; row < rows; row++) {
      const isGlitchLine = glitchLines.includes(row)

      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        const rand = Math.random()

        if (isGlitchLine) {
          // グリッチライン上は激しく変化
          if (rand > 0.2) {
            grid[index] = getRandomChar()
          } else {
            grid[index] = " "
          }
        } else if (glitchIntensity > 0.5 && rand > 0.95) {
          // ランダムな位置に文字ブロック
          const blockSize = Math.floor(Math.random() * 4) + 1
          const char = getRandomChar()
          for (let i = 0; i < blockSize && col + i < cols; i++) {
            grid[row * cols + col + i] = char
          }
        } else if (rand > 0.98) {
          // まれに前のフレームの文字を残す（残像効果）
          grid[index] = prevGrid[index]
        } else if (rand > 0.8) {
          // 通常のノイズ
          grid[index] = rand > 0.9 ? getRandomChar() : "."
        } else {
          grid[index] = " "
        }
      }
    }

    // 垂直方向のシフト（データ破損風）
    if (glitchIntensity > 0.7 && Math.random() > 0.5) {
      const shiftCol = Math.floor(Math.random() * cols)
      const shiftAmount = Math.floor(Math.random() * 10) - 5

      for (let row = 0; row < rows; row++) {
        const srcRow = (row + shiftAmount + rows) % rows
        const srcIndex = srcRow * cols + shiftCol
        const dstIndex = row * cols + shiftCol
        grid[dstIndex] = prevGrid[srcIndex]
      }
    }

    // 現在のグリッドを保存
    prevGrid = [...grid]
  }

  return updateNoise
}
