import * as models from '../models'

export interface EventFormActions {

  getEventForms(
    user: models.User,
    userId: string,
    eventId: string
  ): Promise<models.EventForm[]> | undefined

  createPreEventForm(
    userId: string,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined>

  createPostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined>

  updatePreEventForm(
    userId: string,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined>

  updatePostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined>

  deletePreEventForm(
    userId: string,
    eventId: string
  ): void

  deletePostEventForm(
    userId: string,
    eventId: string
  ): void
}
