import * as mongodbForms from '../mongodb/EventForms'
import * as mongodbEvent from '../mongodb/Event'
import * as models from '../models'
import { EventFormActions } from './EventFormActions'

const eventPermission = (user: models.User) => {
  return user.permissions.includes(models.Permission.Events)
}

export class EventFormActionsImpl implements EventFormActions {

  getEventForms(
    user: models.User,
    userId: string,
    eventId: string
  ): Promise<models.EventForm[]> | undefined {
    if (user.id !== userId && !eventPermission(user)) {
      return undefined
    }

    const preEventForms = mongodbForms.PreEventForm.find(
      { userId, eventId }
    ).exec()

    const postEventForms = mongodbForms.PostEventForm.find(
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
  ): Promise<models.EventForm | undefined> {
    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const preEventForm = new mongodbForms.PreEventForm({
        userId,
        eventId,
        ...fields,
      })

      return preEventForm.save()
    })
  }

  createPostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined> {
    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const postEventForm = new mongodbForms.PostEventForm({
        userId,
        eventId,
        ...fields,
      })

      return postEventForm.save()
    })
  }

  updatePreEventForm(
    userId: string,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined> {
    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const modifiedPreEventForm = mongodbForms.PreEventForm.findOneAndUpdate(
        { userId, eventId },
        { $set: fields },
        { new: true }
      ).exec()

      return modifiedPreEventForm.then(form => {
        return <models.EventForm> form
      })
    })
  }

  updatePostEventForm(
    userId: string,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined> {
    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const modifiedPostEventForm = mongodbForms.PostEventForm.findOneAndUpdate(
        { userId, eventId },
        { $set: fields },
        { new: true }
      ).exec()

      return modifiedPostEventForm.then(form => {
        return <models.EventForm> form
      })
    })
  }

  deletePreEventForm(
    userId: string,
    eventId: string
  ): void {
    mongodbForms.PreEventForm.remove({
      userId,
      eventId,
    }).exec()
  }

  deletePostEventForm(
    userId: string,
    eventId: string
  ): void {
    mongodbForms.PreEventForm.remove({
      userId,
      eventId,
    }).exec()
  }
}
