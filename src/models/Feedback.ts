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

export function createDefaultFeedback(companyId: string): Feedback {
  return {
    companyId: companyId,
    questions: [
      {
        type: 'multipleChoice',
        question: 'How did the event effect your opinion/view about '
          + 'the company?',
        alternatives: [
          {
            alternative: 'More positive',
            amount: 4,
          },
          {
            alternative: 'Did not change',
            amount: 10,
          },
          {
            alternative: 'More negative',
            amount: 7,
          },
        ],
      },
      {
        type: 'scale',
        question: 'How interested are you in writing your Master\'s '
          + 'thesis/working at this company?',
        from: 'Not Interested',
        to: 'Very Interested',
        alternatives: [
          {
            alternative: '1',
            amount: 4,
          },
          {
            alternative: '2',
            amount: 10,
          },
          {
            alternative: '3',
            amount: 7,
          },
          {
            alternative: '4',
            amount: 5,
          },
          {
            alternative: '5',
            amount: 6,
          },
        ],
      },
      {
        type: 'openEnded',
        question: 'If you are not interested in working at the company, '
          + 'why is that?',
        answers: [
          'Because A...',
          'Because B...',
        ],
      },
      {
        type: 'multipleChoice',
        question: 'Do you feel like you are qualified to work at this company?',
        alternatives: [
          {
            alternative: 'Yes',
            amount: 20,
          },
          {
            alternative: 'No',
            amount: 10,
          },
        ],
      },
      {
        type: 'scale',
        question: 'How was the atmosphere at the event?',
        from: 'Not Good',
        to: 'Very Good',
        alternatives: [
          {
            alternative: '1',
            amount: 4,
          },
          {
            alternative: '2',
            amount: 10,
          },
          {
            alternative: '3',
            amount: 7,
          },
          {
            alternative: '4',
            amount: 5,
          },
          {
            alternative: '5',
            amount: 6,
          },
        ],
      },
      {
        type: 'scale',
        question: 'What did you think about the activities at the event?',
        from: 'Not Good',
        to: 'Very Good',
        alternatives: [
          {
            alternative: '1',
            amount: 4,
          },
          {
            alternative: '2',
            amount: 10,
          },
          {
            alternative: '3',
            amount: 7,
          },
          {
            alternative: '4',
            amount: 5,
          },
          {
            alternative: '5',
            amount: 6,
          },
        ],
      },
      {
        type: 'scale',
        question: 'How was the food at the event?',
        from: 'Not Good',
        to: 'Very Good',
        alternatives: [
          {
            alternative: '1',
            amount: 4,
          },
          {
            alternative: '2',
            amount: 10,
          },
          {
            alternative: '3',
            amount: 7,
          },
          {
            alternative: '4',
            amount: 5,
          },
          {
            alternative: '5',
            amount: 6,
          },
        ],
      },
      {
        type: 'openEnded',
        question: 'What did you enjoy the most about the event and company?',
        answers: [
          'This thing!',
          'That thing!',
        ],
      },
      {
        type: 'openEnded',
        question: 'What could be improved?',
        answers: [
          'This and that.',
          'That and this.',
        ],
      },
    ],
  }
}
