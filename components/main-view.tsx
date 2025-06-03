"use client"

import { createCellularAnimation } from "@/animations/cellular"
import { createMandalaAnimation } from "@/animations/mandala"
import { createNoiseAnimation } from "@/animations/noise"
import { createRainAnimation } from "@/animations/rain"
import { createSpiralAnimation } from "@/animations/spiral"
import { createWaveAnimation } from "@/animations/wave"
import { CanvasView } from "@/components/canvas-view"
import { Card } from "@/components/ui/card"
import { memo, useEffect, useRef, useState } from "react"
import { FrequencyControl } from "./frequency-control"

const MemoizedCanvasView = memo(CanvasView)

export function MainView() {
  const createInitialGrid = () => {
    const cols = 32
    const rows = 32
    const grid = new Array(rows * cols)
    for (let i = 0; i < grid.length; i++) {
      grid[i] = " "
    }
    return grid
  }

  const textGridRef = useRef<string[]>(createInitialGrid())

  const [frequency, setFrequency] = useState([95])

  const [channel, setChannel] = useState<string>("noise")

  useEffect(() => {
    const freq = frequency[0]
    if (freq >= 75 && freq <= 78) {
      setChannel("spiral")
    } else if (freq >= 82 && freq <= 85) {
      setChannel("mandala")
    } else if (freq >= 88 && freq <= 92) {
      setChannel("rain")
    } else if (freq >= 102 && freq <= 106) {
      setChannel("wave")
    } else if (freq >= 110 && freq <= 113) {
      setChannel("cellular")
    } else {
      setChannel("noise")
    }
  }, [frequency])

  useEffect(() => {
    const cols = 32
    const rows = 32

    let updateFunction: (grid: string[]) => void

    if (channel === "spiral") {
      updateFunction = createSpiralAnimation(cols, rows)
    } else if (channel === "mandala") {
      updateFunction = createMandalaAnimation(cols, rows)
    } else if (channel === "rain") {
      updateFunction = createRainAnimation(cols, rows)
    } else if (channel === "wave") {
      updateFunction = createWaveAnimation(cols, rows)
    } else if (channel === "cellular") {
      updateFunction = createCellularAnimation(cols, rows)
    } else {
      updateFunction = createNoiseAnimation(cols, rows)
    }

    const interval = setInterval(() => {
      updateFunction(textGridRef.current)
    }, 50)

    return () => clearInterval(interval)
  }, [channel])

  const getCurrentStation = () => {
    const freq = frequency[0]
    if (freq >= 75 && freq <= 78) return "SPIRAL ART"
    if (freq >= 82 && freq <= 85) return "MANDALA"
    if (freq >= 88 && freq <= 92) return "RAIN STATION"
    if (freq >= 102 && freq <= 106) return "WAVE STATION"
    if (freq >= 110 && freq <= 113) return "LIFE FORMS"
    return "--"
  }

  return (
    <div className="flex h-svh w-full flex-col items-center justify-center">
      <div className="w-full max-w-[512px] space-y-2 px-4">
        <div className="items-top flex w-full justify-end text-center">
          <div className="font-mono text-muted-foreground text-sm">
            {getCurrentStation()}
          </div>
        </div>
        <Card className="relative z-10 max-w-xl overflow-hidden">
          <MemoizedCanvasView state={textGridRef} />
        </Card>
      </div>
      <FrequencyControl
        value={frequency[0]}
        onChange={(value) => setFrequency([value])}
        min={70}
        max={120}
        step={0.1}
      />
    </div>
  )
}
