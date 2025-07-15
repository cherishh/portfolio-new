'use client'

import {
  Bank,
  GithubLogo,
  XLogo,
  InstagramLogo,
  Envelope,
  GraduationCap,
  Coffee,
  Butterfly,
  Pill,
  WechatLogo,
  DiscordLogo,
  SealCheck,
  ArrowRight,
  GitFork,
  Star,
  BookOpen,
  Briefcase,
  Student,
  ArrowUpRight,
} from '@phosphor-icons/react'
import Image from 'next/image'

export function CustomIcon({
  name,
  size = 20,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  switch (name) {
    case 'bank':
      return <Bank size={size} weight="duotone" className={className} />
    case 'github':
      return <GithubLogo size={size} weight="duotone" className={className} />
    case 'x':
      return <XLogo size={size} weight="duotone" className={className} />
    case 'instagram':
      return (
        <InstagramLogo size={size} weight="duotone" className={className} />
      )
    case 'bsky':
      return <Butterfly size={size} weight="duotone" className={className} />
    case 'email':
      return <Envelope size={size} weight="duotone" className={className} />
    case 'college':
      return (
        <GraduationCap size={size} weight="duotone" className={className} />
      )
    case 'coffee':
      return <Coffee size={size} weight="duotone" className={className} />
    case 'pill':
      return <Pill size={size} weight="duotone" className={className} />
    case 'wechat':
      return <WechatLogo size={size} weight="duotone" className={className} />
    case 'discord':
      return <DiscordLogo size={size} weight="duotone" className={className} />
    case 'jike':
      return (
        <Image
          src="https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/jike2-black_white.png"
          alt="jike"
          width={size}
          height={size}
        />
      )
    case 'achievement':
      return <SealCheck size={size} weight="duotone" className={className} />
    case 'arrow-right':
      return <ArrowRight size={size} weight="duotone" className={className} />
    case 'arrow-up-right':
      return <ArrowUpRight size={size} weight="duotone" className={className} />
    case 'git-fork':
      return <GitFork size={size} weight="duotone" className={className} />
    case 'star':
      return <Star size={size} weight="duotone" className={className} />
    case 'book-open':
      return <BookOpen size={size} weight="duotone" className={className} />
    case 'briefcase':
      return <Briefcase size={size} weight="duotone" className={className} />
    case 'student':
      return <Student size={size} weight="duotone" className={className} />
    case 'wechat':
      return <WechatLogo size={size} weight="duotone" className={className} />
    default:
      return null
  }
}
