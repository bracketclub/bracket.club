import * as types from '../constants/canWin'
import * as mastersSelectors from '../selectors/masters'
import * as eventSelectors from '../selectors/event'
import { location } from './history'

const CanWinWorker = require('worker-loader!lib/canWinWorker')

export const canWin = ({ entries, id, list }) => (dispatch, getState) => {
  const state = getState()
  const props = { location: location() }
  const index = mastersSelectors.index(state, props)
  const master = mastersSelectors.bracketString(state, props)
  const { sport, year, id: eventId } = eventSelectors.info(state, props)

  const meta = { id, event: eventId, index, list }

  dispatch({ type: types.CAN_WIN_START, meta })

  const canWinWorker = new CanWinWorker()

  canWinWorker.postMessage({
    sport,
    year,
    entries,
    master,
    id,
  })

  canWinWorker.onerror = (e) =>
    dispatch({
      type: types.CAN_WIN_ERROR,
      payload: e.message,
      meta,
    })

  canWinWorker.onmessage = (e) => {
    const { data } = e
    dispatch({
      type: data ? types.CAN_WIN_SUCCESS : types.CAN_WIN_FAILURE,
      payload: data,
      meta,
    })
  }
}
