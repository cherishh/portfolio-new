import { Container } from '@/components/layout/Container'
import Newsletter from '@/components/home/Newsletter'
import Feed from '@/components/home/Feed'
import Career from '@/components/home/Career'
import Education from '@/components/home/Education'
import SocialLinks from '@/components/home/SocialLinks'
import { headline, introduction } from '@/config/infoConfig'
import { BlogCard } from '@/components/home/BlogCard'
import { getAllBlogs, type BlogType } from '@/lib/blogs'
import { ProjectCard } from '@/components/project/ProjectCard'
import { GithubProjectCard } from '@/components/project/GithubProjectCard'
import {
  projectHeadLine,
  projectIntro,
  projects,
  githubProjects,
  blogHeadLine,
  blogIntro,
  techIcons,
  activityHeadLine,
  activityIntro,
} from '@/config/infoConfig'
import GithubContributions from '@/components/home/GithubCalendar'
import GitHubSnake from '@/components/home/GitHubSnake'
import { CustomIcon } from '@/components/shared/CustomIcon'
import IconCloud from '@/components/ui/icon-cloud'
import { TweetGrid } from '@/components/home/TweetGrid'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  let blogList = (await getAllBlogs()).slice(0, 4)

  return (
    <>
      <Container className="mt-9">
        {/* personal info */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2">
          <div className="md:mt-20">
            <h2 className="text-2xl font-semibold tracking-tight opacity-80 sm:text-3xl">
              {headline}
            </h2>
            <p className="mt-6 text-base text-muted-foreground">
              {introduction}
            </p>
            <SocialLinks className="md:mt-24" />
          </div>
          <div className="relative ml-auto flex size-full w-full items-center justify-center overflow-hidden px-20 md:mr-8 md:w-2/3 md:px-0">
            <IconCloud iconSlugs={techIcons} />
          </div>
        </div>
        <div className="mt-6 border-t border-zinc-100 py-8 dark:border-zinc-700/40">
          {/* <GithubContributions /> */}
          <GitHubSnake />
        </div>
        {/* projects */}
        <div className="mx-auto my-4 flex max-w-xl flex-col gap-6 border-t border-muted py-8 lg:max-w-none">
          <h2 className="text-3xl font-semibold tracking-tight opacity-80 md:text-5xl">
            {projectHeadLine}
          </h2>
          <p className="mb-8 max-w-2xl text-base text-muted-foreground">
            {projectIntro}
          </p>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3"
          >
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} titleAs="h3" />
            ))}
          </ul>
        </div>
        <div className="mx-auto my-4 flex max-w-xl flex-col gap-6 border-t border-muted py-8 lg:max-w-none">
          <h2 className="mb-4 flex flex-row items-center justify-start gap-2 text-xl font-semibold tracking-tight opacity-80 md:text-3xl">
            <CustomIcon name="github" size={28} />
            Open Source
          </h2>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3"
          >
            {githubProjects.map((project) => (
              <GithubProjectCard
                key={project.name}
                project={project}
                titleAs="h3"
              />
            ))}
          </ul>
        </div>
        <div className="mx-auto my-8 flex max-w-xl flex-col gap-6 border-t border-muted py-8 lg:max-w-none">
          <h2 className="text-3xl font-semibold tracking-tight opacity-80 md:text-5xl">
            {blogHeadLine}
          </h2>
          <p className="mb-8 max-w-2xl text-base text-muted-foreground">
            {blogIntro}
          </p>
        </div>
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 pb-4 lg:max-w-none lg:grid-cols-2">
          {/* left column */}
          {/* blog */}
          <div className="flex flex-col gap-16">
            {blogList.map((blog: BlogType) => (
              <BlogCard key={blog.slug} blog={blog} titleAs="h3" />
            ))}
            <Link
              href="/blogs"
              className="flex flex-row items-center text-sm font-semibold capitalize text-primary hover:underline"
            >
              Read more blogs
              <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" />
            </Link>
          </div>

          {/* right column */}
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Career />
            <Education />

            {/* <Newsletter /> */}
            {/* <Feed /> */}
          </div>
        </div>
        {/* <div className="mx-auto my-4 flex max-w-xl flex-col gap-6 border-t border-muted py-8 lg:max-w-none">
          <h2 className="text-3xl font-semibold tracking-tight opacity-80 md:text-5xl">
            {activityHeadLine}
          </h2>
          <p className="mb-2 max-w-2xl text-base text-muted-foreground">
            {activityIntro}
          </p>
          <TweetGrid />
        </div> */}
      </Container>
    </>
  )
}
