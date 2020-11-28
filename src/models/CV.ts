export interface CV {
  userId?: string
  sections?: CVSection[]
}

export interface CVSection {
  title?: string
  description?: string
  items?: CVItem[]
}

export interface CVItem {
  title?: string
  description?: string
  when?: string
  organization?: string
  city?: string
}

export function createDefaultCV(userId: string): CV {
  return {
    userId: userId,
    sections: [
      {
        title: 'Education',
        description: '',
        items: [],
      },
      {
        title: 'Work Experience',
        description: '',
        items: [],
      },
      {
        title: 'Extracurricular Activities',
        description: '',
        items: [],
      },
    ],
  }
}
