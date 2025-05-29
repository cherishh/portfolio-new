export * from './projects'
export * from './friends'
export * from './changelog'
export * from './education'
export * from './career'
export * from './activity'

// personal info
export const name = 'Tuxi'
export const headline =
  'Software engineer, Full-Stack web developer, and indie hacker.'
export const introduction =
  'I’m Tuxi(图蜥), a software engineer based in Shanghai, China. I like coding, and building interesting things'
export const email = 'one77r@gmail.com'
export const githubUsername = 'Cherishh'

// about page
export const aboutMeHeadline = 'This guy'
export const aboutParagraphs = [
  // 'I used to live by “hustle nonstop.” Studied medicine, coded, worked in finance, and chased shortcuts in life. Now I realize: slow is fast. What matters is meaningful work and meaningful relationships.',
  'I used to live by “hustle nonstop.” Studied medicine, got into tech, and chased shortcuts in life. Now I realize: slow is fast. What matters is meaningful work and meaningful relationships.',
  'Curious and sharp, with a rebellious spark 😈. I also love to jog, read, and deep chat over a glass of 🍻',
  "Deeply believe in AI will reshape the world. And I'm gonna be a part of it.",
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
    name: 'Jike',
    icon: 'pill',
    href: 'https://okjk.co/P7c1zU',
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
  'mysql',
  'react',
  'nodedotjs',
  'nextdotjs',
  'prisma',
  'postgresql',
  'nginx',
  'vercel',
  'docker',
  'git',
  'github',
  'visualstudiocode',
  'ios',
  'apple',
  'wechat',
  'python',
  'redis',
  'mongodb',
  'hono',
  'bun',
  'tailwindcss',
  'cursor',
]
