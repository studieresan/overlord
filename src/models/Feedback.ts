interface Feedback {
  companyId: string
  // eventId: string? ?
  questions: Question[]
}

type Question = MultipleChoice | Scale | OpenEnded

interface MultipleChoice {
  id: string
  question: string
  alternatives: Alternative[]
}

interface Scale {
  id: string
  question: string
  from: string
  to: string
  steps: Alternative[]
}

interface OpenEnded {
  id: string
  question: string
  feedback: string[]
}

interface Alternative {
  id: string
  text: string
  amount: number
}
