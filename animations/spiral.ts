export function createSpiralAnimation(cols: number, rows: number) {
  let time = 0
  const centerX = cols / 2
  const centerY = rows / 2

  const getArtChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return chars[Math.floor(Math.random() * chars.length)]
  }

  const updateSpiral = (grid: string[]) => {
    time += 0.05

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        const dx = col - centerX
        const dy = row - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx)

        const spiralValue = Math.sin(angle * 3 + distance * 0.3 - time * 3)
        const intensity = (spiralValue + 1) * 0.5

        if (intensity > 0.8) {
          grid[index] = getArtChar()
        } else if (intensity > 0.5) {
          grid[index] = "."
        } else {
          grid[index] = " "
        }
      }
    }
  }

  return updateSpiral
}
