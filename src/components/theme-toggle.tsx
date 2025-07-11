"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { IconMoon, IconSun } from "@tabler/icons-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground dark:text-white group-data-[collapsible=icon]:hidden">Theme</span>
      <button
        className="relative inline-flex h-6 w-6 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 group-data-[collapsible=default]:hidden"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "dark" ? (
          <IconMoon className="size-4" />
        ) : (
          <IconSun className="size-4" />
        )}
      </button>
      <div 
        className="relative inline-flex h-6 w-[100px] flex-shrink-0 cursor-pointer select-none rounded-full border-2 border-transparent bg-zinc-200 p-0.5 transition-colors duration-200 ease-in-out dark:bg-zinc-700 group-data-[collapsible=icon]:hidden"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <div className="relative flex w-full items-center justify-between">
          <span className={`z-10 px-1.5 text-[10px] font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-900'}`}>Light</span>
          <span className={`z-10 px-1.5 text-[10px] font-medium ${theme === 'dark' ? 'text-white' : 'text-zinc-400'}`}>Dark</span>
          <div 
            className={`absolute h-5 w-[46px] transform rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-in-out dark:bg-zinc-900 ${theme === 'dark' ? 'translate-x-[46px]' : 'translate-x-0'}`}
          />
        </div>
      </div>
    </div>
  )
}
