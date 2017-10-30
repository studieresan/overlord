export interface CV {
  readonly userId: string
  readonly text: string
  readonly sections: [CVSection]
}

export interface CVSection {
  readonly title: string
  readonly description: string
  readonly items: [CVItem]
}

export interface CVItem {
  readonly title: string
  readonly description: string
  readonly start: Date
  readonly end: Date
}
