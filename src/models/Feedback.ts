export interface Feedback {
  companyId: string
  eventId?: string
  questions: Question[]
}

type Question = MultipleChoice | Scale | OpenEnded

export interface MultipleChoice {
  type: 'multipleChoice'
  question: string
  alternatives: Alternative[]
}

export interface Scale {
  type: 'scale'
  question: string
  from: string
  to: string
  alternatives: Alternative[]
}

export interface OpenEnded {
  type: 'openEnded'
  question: string
  answers: string[]
}

interface Alternative {
  alternative: string
  amount: number
}
