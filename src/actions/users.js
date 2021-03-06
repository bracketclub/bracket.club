import config from 'config'
import restActions from 'lib/reduxApiRestActions'
import bailoutEvent from 'lib/bailoutEvent'
import { user as schema } from '../schema'
import * as bracketSelectors from '../selectors/bracket'

const endpoint = 'users'

// If there is an eventId then only check if that event is open
// Otherwise check if any event if open, since that would mean to always check
// a user's profile for new entries
const bailout = bailoutEvent(
  endpoint,
  (state, props) => {
    const { eventId } = props.match.params
    // A user entry for a specific event is not allowed after a tournament has locked
    // But a user page could be updated with new entries if any tournament is open
    const selector = eventId
      ? bracketSelectors.locks
      : bracketSelectors.allLocks
    return selector(state, props)
  },
  (id) => id.split('/')[1]
)

export const fetch = restActions({
  schema,
  bailout,
  url: `${config.apiUrl}/${endpoint}`,
})
