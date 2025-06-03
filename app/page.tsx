"use client"

import { useEffect, useState } from "react"
import { MainView } from "../components/main-view"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null
  }

  return <MainView />

}
