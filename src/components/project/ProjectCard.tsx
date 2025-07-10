'use client'

import { HashIcon } from 'lucide-react'
import Image from 'next/image'
import { ProjectItemType } from '@/config/infoConfig'
import { utm_source } from '@/config/siteConfig'
import Link from 'next/link'
import { CustomIcon } from '../shared/CustomIcon'

export function ProjectCard({
  project,
  titleAs,
}: {
  project: ProjectItemType
  titleAs?: keyof JSX.IntrinsicElements
}) {
  const utmLink = `${project.link.href}?utm_source=${utm_source}`
  const internalLink = `/projects/${project.link.href}`
  let Component = titleAs ?? 'h2'
  return (
    <li className="group relative flex h-full flex-col items-start">
      <div className="relative flex h-full w-full flex-col justify-between rounded-2xl border border-muted-foreground/20 p-4 shadow-sm transition-all group-hover:scale-[1.03] group-hover:bg-muted/5 group-hover:shadow-md">
        <div className="">
          <div className="flex flex-col items-start justify-center gap-4 sm:flex-row sm:items-center sm:justify-start">
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-muted-foreground/20">
                <Image
                  src={project.logo ?? ''}
                  alt={project.name}
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <Component className="text-base font-semibold">
              {project.name}
            </Component>
          </div>
          <p className="relative z-10 ml-2 mt-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="relative z-10 ml-1 mt-auto pt-4">
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2">
              {project.tags.map((tag, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-center space-x-0.5"
                >
                  <HashIcon className="icon-scale h-3 w-3 text-muted-foreground" />
                  <span className="text-xs tracking-tighter text-muted-foreground">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Link
          href={project.link.href.startsWith('http') ? utmLink : internalLink}
          target={project.link.href.startsWith('http') ? '_blank' : undefined}
          rel={
            project.link.href.startsWith('http')
              ? 'noopener noreferrer'
              : undefined
          }
          className="absolute inset-0 z-20"
        >
          {project.link.href.startsWith('http') ? (
            <CustomIcon
              name="arrow-up-right"
              size={32}
              className="absolute right-4 top-4 h-4 w-4 group-hover:cursor-pointer group-hover:text-primary"
            />
          ) : null}
        </Link>
      </div>
    </li>
  )
}
