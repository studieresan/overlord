import * as models from '../models'

export interface EventFormActions {
  getEventForms(userId: string, eventId: string): Promise<models.EventForm[]>

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
