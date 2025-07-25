export * from './projects'
export * from './friends'
export * from './changelog'
export * from './education'
export * from './career'
export * from './activity'

// personal info
export const name = 'Tuxi'
export const headline = 'Full-Stack Developer & Indie Hacker'
export const introduction =
  'I’m Tuxi(图蜥), a software engineer based in Shanghai, China. I like building interesting things. And I have a broad interest in all kinds of tech related stuff.'
export const email = 'one77r@gmail.com'
export const githubUsername = 'Cherishh'

// about page
export const aboutMeHeadline = 'This guy'
export const aboutParagraphs = [
  // 'I used to live by “hustle nonstop.” Studied medicine, coded, worked in finance, and chased shortcuts in life. Now I realize: slow is fast. What matters is meaningful work and meaningful relationships.',
  "I'm a software engineer, full-stack web developer, and indie hacker. Formerly worked at Meituan and Alibaba. In my free time I like to explore bleeding-edge technologies purely for fun.",
  "I'm intensely curious, with a deep thirst for knowledge of all kinds. I enjoy jogging, reading, singing, and deep chat over a glass of 🍻.",
  'I’m practical and transparent, always thinking from first principles. Love work with interesting people, always up for a good chat—anytime!',
]

// blog
export const blogHeadLine = "What I've thinking about."
export const blogIntro = 'Please just see my Jike(即刻) for now😅'

// social links
export type SocialLinkType = {
  name: string
  ariaLabel?: string
  icon: string
  href: string
}

export const socialLinks: Array<SocialLinkType> = [
  {
    name: 'Jike',
    icon: 'jike',
    href: 'https://okjk.co/axeG1b',
  },
  {
    name: 'X',
    icon: 'x',
    href: 'https://x.com/tuatara_ai',
  },
  {
    name: 'Bsky',
    icon: 'bsky',
    href: 'https://bsky.app/profile/tuxiii.bsky.social',
  },
  {
    name: 'Github',
    icon: 'github',
    href: 'https://github.com/cherishh',
  },
  // {
  //   name: 'Wechat',
  //   icon: 'wechat',
  //   href: 'https://mp.weixin.qq.com/s/DxnRgqNfgzXIhqj6w_x0dQ',
  // },
]

// https://simpleicons.org/
export const techIcons = [
  'typescript',
  'javascript',
  'supabase',
  'cloudflare',
  'react',
  'nodedotjs',
  'nextdotjs',
  'postgresql',
  'nginx',
  'vercel',
  'docker',
  'git',
  'github',
  'ios',
  'apple',
  'wechat',
  'python',
  'redis',
  'mongodb',
  'hono',
  'bun',
  'tailwindcss',
  'drizzle',
  'zod',
  'sentry',
  'posthog',
  'stripe',
  'upstash',
  'openai',
  'anthropic',
  'claude',
  'googlegemini',
  'ollama',
  'tensorflow',
  'pandas',
  'huggingface',
  'vite',
  'railway',
  'flyio',

  // NOT USE YET
  // 'LangChain',
  // 'prisma',
  // 'mysql',
  // 'numpy',
  // 'langchain',

  // NOT HAVE
  // 'scikit-learn',
  // 'deepseek',
  // 'qwen',
  // 'cursor',
  // 'llamaIndex',
]
