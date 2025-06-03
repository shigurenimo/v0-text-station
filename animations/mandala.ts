export function createMandalaAnimation(cols: number, rows: number) {
  let time = 0
  const centerX = cols / 2
  const centerY = rows / 2

  const getSacredChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return chars[Math.floor(Math.random() * chars.length)]
  }

  const updateMandala = (grid: string[]) => {
    time += 0.03

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        const dx = col - centerX
        const dy = row - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx)

        const pattern1 = Math.sin(angle * 8 + time * 2)
        const pattern2 = Math.cos(distance * 0.4 - time)
        const pattern3 = Math.sin(angle * 4 - distance * 0.2 + time)

        const intensity = (pattern1 + pattern2 + pattern3) / 3 + 0.5

        if (intensity > 0.85) {
          grid[index] = getSacredChar()
        } else if (intensity > 0.6) {
          grid[index] = "*"
        } else if (intensity > 0.4) {
          grid[index] = "."
        } else {
          grid[index] = " "
        }
      }
    }
  }

  return updateMandala
}
