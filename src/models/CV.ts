export interface CV {
  userId: number
  readonly sections: [CVSection]
}

export interface CVSection {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly start: Date
  readonly end: Date
}
