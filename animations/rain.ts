export function createRainAnimation(cols: number, rows: number) {
  const getRandomChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return chars[Math.floor(Math.random() * chars.length)]
  }

  // 各列の雨粒の状態を管理
  const rainDrops = new Array(cols).fill(0).map(() => ({
    position: Math.floor(Math.random() * rows),
    speed: 0.3 + Math.random() * 0.5,
    trail: Math.floor(Math.random() * 8) + 5,
  }))

  const updateRain = (grid: string[]) => {
    // 全体を暗くする（フェードアウト効果を強化）
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] !== " ") {
        if (Math.random() > 0.9) {
          grid[i] = " "
        }
      }
    }

    // 各列の雨粒を更新
    for (let col = 0; col < cols; col++) {
      const drop = rainDrops[col]
      drop.position += drop.speed

      // 雨粒が下端を超えて軌跡も完全に画面外に出たらリセット
      if (drop.position >= rows + drop.trail) {
        drop.position = -drop.trail
        drop.speed = 0.3 + Math.random() * 0.5
        drop.trail = Math.floor(Math.random() * 8) + 5
      }

      // 雨粒とその軌跡を描画
      const headRow = Math.floor(drop.position)

      // 先頭の文字
      if (headRow >= 0 && headRow < rows) {
        const index = headRow * cols + col
        grid[index] = getRandomChar()
      }

      // 軌跡
      for (let i = 1; i < drop.trail; i++) {
        const trailRow = headRow - i
        if (trailRow >= 0 && trailRow < rows) {
          const index = trailRow * cols + col
          const intensity = 1 - i / drop.trail
          if (intensity > 0.5) {
            grid[index] = getRandomChar()
          } else if (intensity > 0.2) {
            grid[index] = "."
          }
        }
      }
    }
  }

  return updateRain
}