'use client'

import { useState } from 'react'
import { email, socialLinks } from '@/config/infoConfig'
import { utm_source } from '@/config/siteConfig'
import Link from 'next/link'
import { CustomIcon } from '@/components/shared/CustomIcon'
import { cn } from '@/lib/utils'
import useSound from 'use-sound'

const SOUND_URL = '/menu-open-softer.mp3'

export default function SocialLinks({ className }: { className?: string }) {
  const [isHovering, setIsHovering] = useState(false)
  const [play, { stop }] = useSound(SOUND_URL, { volume: 0.5 })

  return (
    <div className={cn('mt-6 flex items-center', className)}>
      {socialLinks.map((link) => (
        <Link
          onMouseEnter={() => {
            setIsHovering(true)
            play()
          }}
          onMouseLeave={() => {
            setIsHovering(false)
            stop()
          }}
          key={link.name}
          href={`${link.href}?utm_source=${utm_source}`}
          target="_blank"
          rel="noreferrer"
          aria-label={link.ariaLabel ?? `Follow on ${link.name}`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          <CustomIcon name={link.icon} />
          <span className="sr-only">{link.name}</span>
        </Link>
      ))}
      <Link
        href={`mailto:${email}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Email"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
      >
        <CustomIcon name="email" />
        <span className="sr-only">Email</span>
      </Link>
    </div>
  )
}
