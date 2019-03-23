import * as models from '../models'

export interface EventFormActions {

  getEventForms(
    user: models.User,
    userId: string,
    eventId: string
  ): Promise<models.EventForm[]> | undefined

  getAllEventForms(
    user: models.User,
    eventId: string
  ): Promise<models.EventForm[]> | undefined

  createPreEventForm(
    user: models.User,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined> | undefined

  createPostEventForm(
    user: models.User,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined> | undefined

  updatePreEventForm(
    user: models.User,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined> | undefined

  updatePostEventForm(
    user: models.User,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined> | undefined

  deletePreEventForm(
    user: models.User,
    eventId: string
  ): void

  deletePostEventForm(
    user: models.User,
    eventId: string
  ): void
}
