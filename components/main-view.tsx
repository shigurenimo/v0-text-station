"use client"

import { createNoiseAnimation } from "@/animations/noise"
import { createRainAnimation } from "@/animations/rain"
import { createWaveAnimation } from "@/animations/wave"
import { Card } from "@/components/ui/card"
import { memo, useEffect, useRef, useState } from "react"
import { CanvasView } from "@/components/canvas-view"
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
    if (freq >= 88 && freq <= 92) {
      setChannel("rain")
    } else if (freq >= 102 && freq <= 106) {
      setChannel("wave")
    } else {
      setChannel("noise")
    }
  }, [frequency])

  useEffect(() => {
    const cols = 32
    const rows = 32

    let updateFunction: (grid: string[]) => void

    if (channel === "rain") {
      updateFunction = createRainAnimation(cols, rows)
    } else if (channel === "wave") {
      updateFunction = createWaveAnimation(cols, rows)
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
    if (freq >= 88 && freq <= 92) return "RAIN STATION"
    if (freq >= 102 && freq <= 106) return "WAVE STATION"
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
