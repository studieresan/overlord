export interface CV {
  readonly userId: string
  readonly sections: CVSection[]
}

export interface CVSection {
  readonly title: string
  readonly description: string
  readonly items: CVItem[]
}

export interface CVItem {
  readonly title: string
  readonly description: string
  readonly when: string
  readonly organization: string
  readonly city: string
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
