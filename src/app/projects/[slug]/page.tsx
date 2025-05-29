import { SimpleLayout } from '@/components/layout/SimpleLayout'
import { projects } from '@/config/infoConfig'
import Image from 'next/image'

const title = 'Projects'

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((project) => project.name === params.slug)
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
          <div className="text-lg text-zinc-500">{project.description}</div>
          <div className="mt-4">
            <Image
              src={project.demo || ''}
              alt={project.name}
              width={300}
              height={300}
            />
          </div>
          {project.qrcode && (
            <div className="mt-4">
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
