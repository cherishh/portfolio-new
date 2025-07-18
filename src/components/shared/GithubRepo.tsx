'use client'

import * as React from 'react'
import { CustomIcon } from './CustomIcon'
import Link from 'next/link'
import useSound from 'use-sound'

const SOUND_URL = '/menu-open-softer.mp3'

export function GithubRepo() {
  const [isHovering, setIsHovering] = React.useState(false)
  const [play, { stop }] = useSound(SOUND_URL, { volume: 0.5 })

  return (
    <Link
      onMouseEnter={() => {
        setIsHovering(true)
        play()
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        stop()
      }}
      href="https://github.com/cherishh/"
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-md group flex  flex-row items-center justify-start font-medium transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
    >
      <CustomIcon name="github" size={18} />
      <span className="sr-only">Github Repo</span>
    </Link>
  )
}
