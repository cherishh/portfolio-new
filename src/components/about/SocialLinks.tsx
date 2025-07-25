'use client'

import { useState } from 'react'
import Link from 'next/link'
import { email, socialLinks } from '@/config/infoConfig'
import { CustomIcon } from '@/components/shared/CustomIcon'
import useSound from 'use-sound'

const SOUND_URL = '/menu-open-softer.mp3'

export default function SocialLinks() {
  const [isHovering, setIsHovering] = useState(false)
  const [play, { stop }] = useSound(SOUND_URL, { volume: 0.5 })

  return (
    <div>
      <div className="mt-6 flex items-center gap-1">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.ariaLabel ?? `Follow on ${link.name}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            onMouseEnter={() => {
              setIsHovering(true)
              play()
            }}
            onMouseLeave={() => {
              setIsHovering(false)
              stop()
            }}
          >
            <CustomIcon name={link.icon} />
            <span className="sr-only">{link.name}</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-t pt-8 ">
        <Link
          href={`mailto:${email}`}
          className="text-md group ml-3 flex flex-row items-center justify-start font-medium transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
          onMouseEnter={() => {
            setIsHovering(true)
            play()
          }}
          onMouseLeave={() => {
            setIsHovering(false)
            stop()
          }}
        >
          <CustomIcon name="email" size={22} />
          <span className="ml-4">{email}</span>
        </Link>
      </div>
    </div>
  )
}
