export function createCellularAnimation(cols: number, rows: number) {
  let cells: boolean[] = new Array(cols * rows)
  let generation = 0

  for (let i = 0; i < cells.length; i++) {
    cells[i] = Math.random() > 0.7
  }

  const getLifeChar = (alive: boolean, neighbors: number) => {
    if (alive) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      return chars[Math.min(neighbors, chars.length - 1)]
    }
    const chars = "....."
    return neighbors > 0
      ? chars[Math.min(neighbors - 1, chars.length - 1)]
      : " "
  }

  const countNeighbors = (row: number, col: number) => {
    let count = 0
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const nr = (row + dr + rows) % rows
        const nc = (col + dc + cols) % cols
        if (cells[nr * cols + nc]) count++
      }
    }
    return count
  }

  const updateCellular = (grid: string[]) => {
    generation++
    const newCells = [...cells]

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        const neighbors = countNeighbors(row, col)
        const alive = cells[index]

        if (alive && (neighbors < 2 || neighbors > 3)) {
          newCells[index] = false
        } else if (!alive && neighbors === 3) {
          newCells[index] = true
        }

        grid[index] = getLifeChar(newCells[index], neighbors)
      }
    }

    cells = newCells

    if (generation % 100 === 0) {
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * cells.length)
        cells[randomIndex] = true
      }
    }
  }

  return updateCellular
}
