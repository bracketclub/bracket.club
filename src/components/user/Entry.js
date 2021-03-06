import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DiffBracket from '../bracket/DiffBracket'

export default class UserEntry extends Component {
  static propTypes = {
    user: PropTypes.object,
    diff: PropTypes.func,
    master: PropTypes.string,
    bestOf: PropTypes.object,
  }

  render() {
    const { user, diff, master, bestOf } = this.props

    if (!user) {
      return null
    }

    if (!user.entry) {
      return (
        <Alert bsStyle="info">
          <strong>@{user.username}</strong> does not have an entry for this
          event. Go to their <Link to={`/users/${user.id}`}>user page</Link> to
          see all their entries.
        </Alert>
      )
    }

    if (!diff || !master) {
      return null
    }

    return (
      <DiffBracket {...{ diff, entry: user.entry.bracket, master, bestOf }} />
    )
  }
}
