import { ThemeToggle } from "@/components/ui/theme-toggle"
import React from "react"

function DefaultToggle() {
  return (
    <div className="space-y-2 text-center">
      <h3 className="text-xl font-semibold mb-4">Theme Toggle Demo</h3>
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  )
}

export { DefaultToggle }