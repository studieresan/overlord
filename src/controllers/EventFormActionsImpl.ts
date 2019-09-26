import * as mongodbForms from '../mongodb/EventForms'
import * as mongodbEvent from '../mongodb/Event'
import * as mongodbUser from '../mongodb/User'
import * as models from '../models'
import { EventFormActions } from './EventFormActions'

const eventPermission = (user: models.User) => {
  return user.permissions.includes(models.Permission.Events)
}

const studsUser = (user: models.User) => {
  return user.profile.memberType === models.MemberType.StudsMember
}

export class EventFormActionsImpl implements EventFormActions {

  getEventForms(
    user: models.User,
    userId: string,
    eventId: string
  ): Promise<models.EventForm[]> | undefined {
    if (!studsUser(user)) {
      return undefined
    }

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

  getAllEventForms(
    user: models.User,
    eventId: string
  ): Promise<models.EventForm[]> | undefined {
    if (!studsUser(user) && !eventPermission(user)) {
      return undefined
    }

    const preEventForms = mongodbForms.PreEventForm.find(
      { eventId }
    ).exec()

    const postEventForms = mongodbForms.PostEventForm.find(
      { eventId }
    ).exec()

    return preEventForms.then((preForms: models.EventForm[]) => {
      return postEventForms.then((postForms: models.EventForm[]) => {
        return preForms.concat(postForms)
      })
    })
  }

  async getMissingPreEventFormUsers(
    user: models.User,
    eventId: string
  ): Promise<models.User[] | undefined> {
    if (!studsUser(user) && !eventPermission(user)) {
      return undefined
    }

    const users: models.User[] = await mongodbUser.User.find(
      { 'profile.memberType': models.MemberType.StudsMember }
    ).exec()

    const preEventForms: models.EventForm[] =
      await mongodbForms.PreEventForm.find(
        { eventId }
      ).exec()

    const preEventFormUserIds = preEventForms.map(it => it.userId)

    return users.filter(user =>
      !preEventFormUserIds.includes(user.id)
    )
  }

  async getMissingPostEventFormUsers(
    user: models.User,
    eventId: string
  ): Promise<models.User[] | undefined> {
    if (!studsUser(user) && !eventPermission(user)) {
      return undefined
    }

    const users: models.User[] = await mongodbUser.User.find(
      { 'profile.memberType': models.MemberType.StudsMember }
    ).exec()

    const postEventForms: models.EventForm[] =
      await mongodbForms.PostEventForm.find(
        { eventId }
      ).exec()

    const postEventFormUserIds = postEventForms.map(it => it.userId)

    return users.filter(user =>
      !postEventFormUserIds.includes(user.id)
    )
  }

  createPreEventForm(
    user: models.User,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined> | undefined {
    if (!studsUser(user)) {
      return undefined
    }

    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const preEventForm = new mongodbForms.PreEventForm({
        userId: user.id,
        eventId: eventId,
        ...fields,
      })

      return preEventForm.save()
    })
  }

  createPostEventForm(
    user: models.User,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined> | undefined {
    if (!studsUser(user)) {
      return undefined
    }

    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const postEventForm = new mongodbForms.PostEventForm({
        userId: user.id,
        eventId: eventId,
        ...fields,
      })

      return postEventForm.save()
    })
  }

  updatePreEventForm(
    user: models.User,
    eventId: string,
    fields: models.PreEventForm
  ): Promise<models.EventForm | undefined> | undefined {
    if (!studsUser(user)) {
      return undefined
    }

    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const modifiedPreEventForm = mongodbForms.PreEventForm.findOneAndUpdate(
        { userId: user.id, eventId: eventId },
        { $set: fields },
        { new: true }
      ).exec()

      return modifiedPreEventForm.then(form => {
        return <models.EventForm> form
      })
    })
  }

  updatePostEventForm(
    user: models.User,
    eventId: string,
    fields: models.PostEventForm
  ): Promise<models.EventForm | undefined> | undefined {
    if (!studsUser(user)) {
      return undefined
    }

    return mongodbEvent.Event.find({'_id': eventId}).count().then((count) => {
      if (count === 0) {
        return undefined
      }

      const modifiedPostEventForm = mongodbForms.PostEventForm.findOneAndUpdate(
        { userId: user.id, eventId: eventId },
        { $set: fields },
        { new: true }
      ).exec()

      return modifiedPostEventForm.then(form => {
        return <models.EventForm> form
      })
    })
  }

  deletePreEventForm(
    user: models.User,
    eventId: string
  ): void {
    if (!studsUser(user)) {
      return undefined
    }

    mongodbForms.PreEventForm.remove({
      userId: user.id,
      eventId: eventId,
    }).exec()
  }

  deletePostEventForm(
    user: models.User,
    eventId: string
  ): void {
    if (!studsUser(user)) {
      return undefined
    }

    mongodbForms.PostEventForm.remove({
      userId: user.id,
      eventId: eventId,
    }).exec()
  }
}