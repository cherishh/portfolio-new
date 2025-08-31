// education
export type EducationItemType = {
  school: string
  major: string
  image?: string
  logo: string
  start: string
  end: string
}

export const educationList: Array<EducationItemType> = [
  {
    school: 'Wuhan University',
    major: 'Communication Engineering',
    logo: 'college',
    start: '2012',
    end: '2016',
  },
]
