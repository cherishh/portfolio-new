// projects
export const projectHeadLine = "What I've done and what I'm doing."
export const projectIntro =
  "I've made a variety of AI related pet projects just for fun. Here are a few of my favorites."

export type ProjectItemType = {
  name: string
  description: string
  detail?: string
  clarify?: string
  link: { href: string; label: string }
  date?: string
  logo?: string
  category?: string[]
  tags?: string[]
  image?: string
  demo?: string
  techStack?: string[]
  gitStars?: number
  gitForks?: number
  qrcode?: string
}

// projects
export const projects: Array<ProjectItemType> = [
  {
    name: 'Easy Habit',
    description: 'Vibe coding an iOS app with 0 experience',
    detail:
      'This is a minimal habit tracker, born from my own need. I was looking for a simple, easy-to-use app that would let me check off habits directly from a widget—but couldn’t find one that worked well. So, with no prior iOS development experience, I built it myself through vibe coding.',
    link: { href: 'todo', label: 'Easy Habit' },
    category: ['iOS'],
    techStack: ['Swift', 'SwiftUI', 'Xcode'],
    tags: ['iOS', 'Swift', 'SwiftUI', 'Cursor'],
    demo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/meme2.gif',
    qrcode:
      'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/qrcode.jpg',
  },
  {
    name: 'Wechat Stickers',
    description: 'Using AI to generate full sets of WeChat stickers',
    detail:
      'Using AI to generate full sets of WeChat stickers—it’s a fun idea with low production cost. The original goal was to create something that could be easily scaled and replicated.',
    link: { href: '', label: 'Wechat Stickers' },
    category: ['Wechat'],
    techStack: ['Midjourney', 'Photoshop', 'Python'],
    tags: ['Wechat', 'AI', 'Sticker', 'Fun'],
    demo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/meme2.gif',
    qrcode:
      'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/qrcode.jpg',
  },
  {
    name: 'Personal AI Assistant(deprecated)',
    description: 'AI agent in early 2023',
    detail:
      'Most AI bots today are generic—they treat everyone the same. They don’t know your style or preferences, who you follow on Weibo, or what matters to you. And they can’t really do things for you, like managing your schedule or handling your accounts. I’m building a true personal AI assistant—one that actually knows you and can take real actions on your behalf.',
    clarify:
      'This project started in early 2023. Even back then, I realized that the future of AI would be all about taking action. So I began building an app that could execute stock trades directly from a chat interface. But due to the technical challenges and limited time, I eventually had to put it on hold. Looking back, it was essentially what we now call an “agent.”',
    link: { href: '', label: 'Personal AI Assistant' },
    logo: '🛑',
    category: ['AI'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI', 'OpenAI API'],
    tags: ['AI', 'OpenAI API', 'Agent'],
    demo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/personal-assistant.gif',
  },
  {
    name: 'ChatGPT UI',
    description:
      'A ChatGPT-style UI designed for people who can’t access OpenAI’s official site',
    detail:
      'A ChatGPT-style UI designed for people who can’t access OpenAI’s official site, offering an easy way to experience ChatGPT. The project aims to help more people understand AI technology, while also serving as a learning exercise in building a basic conversational AI.',
    link: { href: '', label: 'ChatGPT UI' },
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI', 'OpenAI API'],
    tags: ['ChatGPT', 'AI', 'Conversational AI'],
    demo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/gpt2.gif',
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
