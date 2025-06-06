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
    start: '2021',
    end: '2024',
  },
  {
    company: 'Alibaba',
    title: 'Software Engineer',
    logo: 'bank',
    start: '2019',
    end: '2021',
  },
  {
    company: 'Clobotics',
    title: 'Software Engineer',
    logo: 'bank',
    start: '2018',
    end: '2019',
  },
  {
    company: 'CEFC Shanghai Securities',
    title: 'Software Engineer',
    logo: 'bank',
    start: '2017',
    end: '2018',
  },
]
