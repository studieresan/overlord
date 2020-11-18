
// export enum SaleStatus {
//   WillHaveMeeting = {
// 		description: "Ska ha möte",
// 		priority: 5
// 	},
// 	HasResponded = {
// 		description: "Har svarat",
// 		priority: 4
// 	},
// 	HaveReminded = {
// 		description: "Har påmint"
// 		priority: 3
// 	},
// 	No = {
// 		description: "Nej"
// 	priority :-1
// 	ContractSent = {
// 		description: "Avtal skickat"
// 		priority: 8
// 	},
// 	NotContacted = {
// 		description: "Ej kontaktat"
// 		priority: 1
// 	},
// 	Contacted = {
// 		description: "Kontaktat"
// 		priority: 2
// 	},
// 	HadMeeting = {
// 		description: "Haft möte",
// 		priority: 6
// 	},
// 	PrelBooked{
// 		description: "Prel bokat"
// 		priority: 7
// 	},
// 	AllDone = {
// 		description: "Allt klart"
// 		priority: 9
// 	}
// }

export interface CompanySalesStatus {
  readonly id: string
  readonly description: string
  readonly priority: number
}

