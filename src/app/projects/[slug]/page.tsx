import { SimpleLayout } from '@/components/layout/SimpleLayout'
import { projects } from '@/config/infoConfig'
import Image from 'next/image'

const title = 'Projects'

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.link.href,
  }))
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const project = projects.find((project) => project.link.href === slug)
  if (!project) {
    return (
      <SimpleLayout title={title}>
        <div>Project not found</div>
      </SimpleLayout>
    )
  }

  return (
    <SimpleLayout title={title}>
      <div>
        <div key={project.name}>
          <div className="text-2xl font-bold">{project.name}</div>
          <div className="mt-4 text-lg text-zinc-500">{project.detail}</div>
          <div className="m-8 flex items-center justify-center">
            <Image
              src={project.demo || ''}
              alt={project.name}
              width={300}
              height={300}
            />
          </div>
          {project.qrcode && (
            <div className="mt-4 flex items-center justify-center">
              <Image
                src={project.qrcode}
                alt={project.name}
                width={300}
                height={300}
              />
            </div>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
}
