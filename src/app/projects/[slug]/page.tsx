import { SimpleLayout } from '@/components/layout/SimpleLayout'
import {
  projectHeadLine,
  projectIntro,
  projects,
  githubProjects,
} from '@/config/infoConfig'

export default function ProjectPage() {
  return (
    <SimpleLayout title={projectHeadLine} intro={projectIntro}>
      <div>ProjectPage</div>
    </SimpleLayout>
  )
}
