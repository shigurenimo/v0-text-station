"use client"

import { useRef, useState, useEffect } from "react"

type Props = {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
}

export function FrequencyControl(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const [startX, setStartX] = useState(0)

  const [startValue, setStartValue] = useState(props.value)

  const stepSize = props.step || 0.2

  /**
   * 何ピクセルで1ステップ移動するか（小さいほど敏感）
   */
  const pixelsPerStep = 2

  /**
   * 一度のスワイプで移動するステップ数の倍率
   */
  const stepsPerSwipe = 1

  const getAllMarks = () => {
    const marks = []
    const maxDistance = 10

    for (let i = props.min; i <= props.max; i += stepSize) {
      const mark = Math.round(i / stepSize) * stepSize
      const distance = Math.abs(mark - props.value)

      const scale = 1 - Math.min(distance / maxDistance, 0.9)
      const offset =
        Math.sign(mark - props.value) * ((distance * 80) / (1 + distance / 10))

      const isInteger = Number.isInteger(mark)
      const baseOpacity = Math.max(0.1, 1 - distance / maxDistance)
      const opacity = isInteger ? baseOpacity : baseOpacity * 0.5

      const isCenter = distance < 0.1
      const showNumber = isInteger && distance < 3

      const markHeight = isInteger ? "h-10" : "h-8"

      marks.push({
        value: mark,
        distance,
        scale,
        offset,
        opacity,
        isCenter,
        showNumber,
        markHeight,
      })
    }
    return marks
  }

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setStartValue(props.value)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const deltaX = clientX - startX
    const steps = Math.round(deltaX / pixelsPerStep) * stepsPerSwipe
    const deltaValue = steps * stepSize
    const newValue = Math.max(
      props.min,
      Math.min(props.max, startValue - deltaValue),
    )
    const rounded = Math.round(newValue / stepSize) * stepSize
    props.onChange(rounded)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleMouseUp = () => handleEnd()

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startX, startValue])

  const handleMarkClick = (value: number) => {
    props.onChange(value)
  }

  return (
    <div className="-mt-4 relative w-full select-none">
      <div
        ref={containerRef}
        className="relative h-16 cursor-grab overflow-hidden active:cursor-grabbing"
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* <div className="-translate-x-1/2 absolute top-0 bottom-0 left-1/2 h-8 w-0.5 transform bg-primary" /> */}
        <div className="relative h-full">
          {getAllMarks().map((mark) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={mark.value}
              className="absolute flex cursor-pointer flex-col items-center text-muted-foreground transition-opacity"
              style={{
                left: `calc(50% + ${mark.offset}px)`,
                transform: `translateX(-50%) scaleY(${mark.scale})`,
                opacity: mark.opacity,
              }}
              onClick={() => handleMarkClick(mark.value)}
            >
              <div className={`w-0.5 bg-current ${mark.markHeight}`} />
              {mark.showNumber && (
                <span
                  className={`mt-1 text-xs ${mark.isCenter ? "font-bold text-primary" : ""}`}
                >
                  {mark.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
