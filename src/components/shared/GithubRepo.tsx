'use client'

import * as React from 'react'
import { CustomIcon } from './CustomIcon'
import Link from 'next/link'

export function GithubRepo() {
  return (
    <Link
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
