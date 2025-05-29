// career
export type CareerItemType = {
  company: string
  title: string
  image?: string
  logo: string
  start: string
  end: string
}

export const careerList: Array<CareerItemType> = [
  {
    company: 'Meituan',
    title: 'Software Engineer',
    logo: 'bank',
    start: '2022',
    end: '2024',
  },
]
