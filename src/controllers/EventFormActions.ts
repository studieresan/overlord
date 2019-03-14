import * as models from '../models'

export interface EventFormActions {

  getEventForms(
    user: models.User,
    userId: string,
    eventId: string
  ): Promise<models.EventForm[]> | undefined

  createPreEventForm(
    user: models.User,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined>

  createPostEventForm(
    user: models.User,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined>

  updatePreEventForm(
    user: models.User,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined>

  updatePostEventForm(
    user: models.User,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined>

  deletePreEventForm(
    user: models.User,
    eventId: string
  ): void

  deletePostEventForm(
    user: models.User,
    eventId: string
  ): void
}
