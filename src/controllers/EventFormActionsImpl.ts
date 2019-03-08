import * as mongodb from '../mongodb/EventForms'
import * as models from '../models'
import { EventFormActions } from './EventFormActions'

const eventPermission = (user) => {
  return user.permissions.includes(models.Permission.Events);
}

export class EventFormActionsImpl implements EventFormActions {

  getEventForms(
    user: models.User,
    userId: string,
    eventId: string
  ): Promise<models.EventForm[]> | undefined {
    if (user.id != userId && !eventPermission(user)) {
      return undefined
    }

    const preEventForms = mongodb.PreEventForm.find(
      { userId, eventId }
    ).exec()

    const postEventForms = mongodb.PostEventForm.find(
      { userId, eventId }
    ).exec()

    return preEventForms.then((preForms: models.EventForm[]) => {
      return postEventForms.then((postForms: models.EventForm[]) => {
        return preForms.concat(postForms)
      })
    })
  }

  createPreEventForm(
    userId: string,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm> {
    const preEventForm = new mongodb.PreEventForm({
      userId,
      eventId,
      ...fields,
    })

    return preEventForm.save()
  }

  createPostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm> {
    const postEventForm = new mongodb.PostEventForm({
      userId,
      eventId,
      ...fields,
    })

    return postEventForm.save()
  }

  updatePreEventForm(
    userId: string,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm> {
    const modifiedPreEventForm = mongodb.PreEventForm.findOneAndUpdate(
      { userId, eventId },
      { $set: fields },
      { new: true }
    ).exec()

    return modifiedPreEventForm.then(form => {
      return <models.EventForm> form
    })
  }

  updatePostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm> {
    const modifiedPostEventForm = mongodb.PostEventForm.findOneAndUpdate(
      { userId, eventId },
      { $set: fields },
      { new: true }
    ).exec()

    return modifiedPostEventForm.then(form => {
      return <models.EventForm> form
    })
  }

  deletePreEventForm(
    userId: string,
    eventId: string
  ): void {
    mongodb.PreEventForm.remove({
      userId,
      eventId,
    }).exec()
  }

  deletePostEventForm(
    userId: string,
    eventId: string
  ): void {
    mongodb.PreEventForm.remove({
      userId,
      eventId,
    }).exec()
  }
}
