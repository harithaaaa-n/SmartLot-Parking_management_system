"use client"

import { useTheme } from "context/ThemeContext"; // Assuming a custom context or next-themes wrapper
// If using next-themes directly:
// import { useTheme } from "next-themes";

// However, the project seems to use "useTheme" from "next-themes" in the previous file content.
import { useTheme as useNextTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import "@/styles/ToggleSwitch.css"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // or a placeholder
  }

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className={`scale-75 ${className || ''}`}> {/* Scaling down slightly as 100px might be too big for header */}
      <div className="toggle-switch">
        <label className="switch-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={isDark}
            onChange={toggleTheme}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  )
}