export const eventFormsQuery = 'Returns the event forms that match the ' +
  'provided query arguments. Every logged in user can use the query to ' +
  'return her own event forms but only user with events permission are ' +
  'allowed to fetch event forms of another userId.'
export const allEventFormsQuery = 'Returns all event forms for a certain ' +
  'event.'
export const missingPreEventFormUsersQuery = 'Returns all users that has not ' +
  'currently filled in the pre event forms for the provided event.'
export const missingPostEventFormUsersQuery = 'Returns all users that has ' +
  'not currently filled in the post event forms for the provided event.'
export const createPreEventFormMutation = 'Creates a new pre event form ' +
  'for the specified event'
export const createPostEventFormMutation = 'Creates a new post event form ' +
  'for the specified event'
export const updatePreEventFormMutation = 'Updates the provided pre event ' +
  'form'
export const updatePostEventFormMutation = 'Updates the provided post event ' +
  'form'
export const deletePreEventFormMutation = 'Deletes the provided pre event ' +
  'form'
export const deletePostEventFormMutation = 'Deletes the provided post event ' +
  'form'
