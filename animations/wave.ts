export function createWaveAnimation(cols: number, rows: number) {
  const getRandomChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return chars[Math.floor(Math.random() * chars.length)]
  }

  let time = 0

  const updateWave = (grid: string[]) => {
    time += 0.1

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        const waveX = Math.sin(col * 0.2 + time) * 3
        const waveY = Math.sin(row * 0.2 + time) * 3
        const intensity = Math.sin(waveX + waveY + time) * 0.5 + 0.5

        if (intensity > 0.7) {
          grid[index] = getRandomChar()
        } else if (intensity > 0.4) {
          grid[index] = "."
        } else {
          grid[index] = " "
        }
      }
    }
  }

  return updateWave
}