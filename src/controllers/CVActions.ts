import { CV, CVSection, } from '../models'

export default interface CVActions {

  // Get a CV for a specific user id
  getCV(userId: number): CV

  // Set the sections of a CV, returning the modified CV
  updateCV(sections: [CVSection], userId: number): CV

}
