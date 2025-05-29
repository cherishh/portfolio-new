// projects
export const projectHeadLine = "What I've done and what I'm doing."
export const projectIntro =
  "I've worked on a variety of AI related pet projects. Here are a few of my favorites."

export type ProjectItemType = {
  name: string
  description: string
  link: { href: string; label: string }
  date?: string
  logo?: string
  category?: string[]
  tags?: string[]
  image?: string
  techStack?: string[]
  gitStars?: number
  gitForks?: number
}

// projects
export const projects: Array<ProjectItemType> = [
  {
    name: 'GitHub Cards',
    description:
      'Showcase your GitHub contributions into stunning visual cards.',
    link: { href: 'github.cards', label: 'GitHub Cards' },
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
    tags: ['Visual Cards', 'GitHub Contribution Cards'],
  },
  {
    name: 'AI Best Tools',
    description: 'Find the best AI tools in AIBest.tools',
    link: { href: 'aibest.tools', label: 'AI Best Tools' },
    logo: '/images/icon/aibesttools.png',
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
    tags: ['AI', 'Tools Directory'],
  },
  {
    name: 'Best Directories',
    description: 'Your ultimate directory of directories.',
    link: { href: 'bestdirectories.org', label: 'Best Directories' },
    logo: '/images/icon/bestdirectories.png',
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
    tags: ['Directory of Directories'],
  },
  {
    name: 'User Growth',
    description: 'Boost Your business growth with UserGrowth.link',
    link: { href: 'usergrowth.link', label: 'User Growth' },
    logo: '/images/icon/usergrowth.ico',
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
    tags: ['User Growth', 'Marketing', 'SEO'],
  },
  {
    name: 'Dev Toolset',
    description: 'Open-source database-free tools directory.',
    link: { href: 'devtoolset.net', label: 'Dev Toolset' },
    logo: '/images/icon/devtoolset.png',
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
    tags: ['Open Source', 'Database-Free', 'Tools Directory'],
  },
  {
    name: 'Domain Score',
    description: 'Ultimate AI-Powered tool for domain scoring and evaluation',
    link: { href: 'domainscore.ai', label: 'Domain Score' },
    logo: '/images/icon/domainscore.png',
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
    tags: ['Domain', 'AI', 'SEO'],
  },
  {
    name: 'MagicBox Tools',
    description: 'Find the best AI tools in MagicBox.tools',
    link: { href: 'magicbox.tools', label: 'MagicBox Tools' },
    logo: '/images/icon/magicbox.png',
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI'],
    tags: ['AI', 'Tools Directory'],
  },
]

export const githubProjects: Array<ProjectItemType> = [
  {
    name: 'Devtoolset',
    description:
      'Open-source & database-free developer tools navigator / 开源无数据库配置的开发者工具导航站',
    link: { href: 'github.com/iAmCorey/devtoolset', label: 'Devtoolset' },
    gitStars: 203,
    gitForks: 67,
  },
  {
    name: 'Tuxi Portfolio Template',
    description: 'portfolio template by Tuxi',
    link: {
      href: 'github.com/iAmCorey/coreychiu-portfolio-template',
      label: 'Tuxi Portfolio Template',
    },
    gitStars: 229,
    gitForks: 30,
  },
]
