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
    link: {
      href: 'https://apps.apple.com/cn/app/easy-habit/id6743850926?l=en-GB',
      label: 'Easy Habit',
    },
    logo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/4.png',
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
      'Using AI to generate full sets of WeChat stickers—it’s a fun idea with low production cost. The original goal was to create something that could be easily scaled and replicated. You can scan the QR code below👇 to see it yourself.',
    link: { href: 'wechat-stickers', label: 'Wechat Stickers' },
    logo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/1.png',
    category: ['Wechat'],
    techStack: ['Midjourney', 'Photoshop', 'Python'],
    tags: ['Wechat', 'AI', 'Sticker', 'Fun'],
    demo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/meme2.gif',
    qrcode:
      'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/qrcode.jpg',
  },
  {
    name: 'Personal AI Assistant',
    description: 'AI agent in early 2023',
    detail:
      'This project started in early 2023. Even back then, I realized that the future of AI would be all about AI taking action on its own. So I began building an app that could execute stock trades directly from a chat interface. But due to the technical challenges and limited time, I eventually had to put it on hold. Looking back, it was essentially what we now call an “agent.”',
    link: { href: 'personal-ai-assistant', label: 'Personal AI Assistant' },
    logo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/bot.png',
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
      'A ChatGPT-style UI designed for people who can’t access OpenAI’s official site, offering an easy way to experience ChatGPT. The project aims to help more people understand AI technology, while also serving as a learning exercise in building a basic conversational AI. This project is no longer maintained, since we can easily access many (more advanced) AI chatbots now.',
    link: { href: 'chatgpt-ui', label: 'ChatGPT UI' },
    logo: 'https://www.chatbotui.com/icon-256x256.png',
    category: ['Website'],
    techStack: ['Next.js', 'TailwindCSS', 'Shadcn/UI', 'OpenAI API'],
    tags: ['ChatGPT', 'AI', 'Conversational AI'],
    demo: 'https://pub-a443e563a0f4468c84a76b4d1d42e0a7.r2.dev/porforlio%20stuff/gpt2.gif',
  },
]

export const githubProjects: Array<ProjectItemType> = [
  {
    name: 'Tanstack Start Template',
    description:
      'Tanstack Start is an alternitive to Nextjs that rapidly getting attention in web dev community. This is a template for building a web app with Tanstack Start, with everything you need including authentication, database, deployment, and more.',
    link: {
      href: 'github.com/cherishh/tanstack-start-template',
      label: 'tanstack-start',
    },
    gitStars: 3,
    // gitForks: 67,
  },
  {
    name: 'Easy Habit',
    description:
      'A beautiful habit tracker iOS app. The project started from a personal need. I looked around but couldn’t find anything that met my expectations, so I "vibe coded" one myself.',
    link: {
      href: 'github.com/cherishh/minimal-habit-tracker',
      label: 'iOS',
    },
    gitStars: 1,
    // gitForks: 30,
  },
  {
    name: 'Nextjs Starter Template',
    description:
      'A Nextjs starter template, with everything included: authentication, ORM, database, CMS, UI framework, CI, deployment, analytics, logging, monitoring, rate limiting...\nLiterally everything to get started.',
    link: {
      href: 'github.com/cherishh/nextjs-all-in-one-template',
      label: 'nextjs-starter-template',
    },
    // gitStars: 1,
    // gitForks: 30,
  },
]
