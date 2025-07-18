'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import useSound from 'use-sound'

const AUDIO_SWITCH_ON = '/switch-on.mp3'
const AUDIO_SWITCH_OFF = '/switch-off.mp3'

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [playOn] = useSound(AUDIO_SWITCH_ON, {
    volume: 0.5,
  })
  const [playOff] = useSound(AUDIO_SWITCH_OFF, {
    volume: 0.5,
  })

  const toggleTheme = () => {
    // 直接在light和dark之间切换，跳过system
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    // console.log('切换主题:', newTheme)
    setTheme(newTheme)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      onMouseDown={() => {
        if (resolvedTheme === 'dark') {
          playOn()
        } else {
          playOff()
        }
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
