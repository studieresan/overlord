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
  ): Promise<models.EventForm>

  createPostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm>

  updatePreEventForm(
    userId: string,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm>

  updatePostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm>

  deletePreEventForm(
    userId: string,
    eventId: string
  ): void

  deletePostEventForm(
    userId: string,
    eventId: string
  ): void
}
