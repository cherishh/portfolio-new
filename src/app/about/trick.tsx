'use client'

import { toast } from 'sonner'

export default function Trick() {
  return (
    <section className="absolute bottom-0 h-1 w-full text-center">
      <div className="relative">
        <p className="mb-[350rem] mt-[200rem]">
          Something&apos;s off. Don&apos;t scroll down.
        </p>
        <p className="mb-[350rem]">Seriously. Stop.</p>
        <p className="pb-[30rem]">Oh you rebel. I like you :)</p>
        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs">
          <span>Here&apos;s my Wechat:</span>{' '}
          <span
            className="cursor-pointer font-bold text-zinc-800 dark:text-zinc-100 "
            onClick={() => {
              navigator.clipboard.writeText('coastroad')
              toast.success('Copied to clipboard')
            }}
          >
            coastroad
          </span>
          <p>I&apos;d like to get to know you :)</p>
        </p>
      </div>
    </section>
  )
}
