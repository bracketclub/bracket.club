import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import eventDisplayName from 'lib/eventDisplayName'

export default class UserEntries extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  render() {
    const { user } = this.props

    if (!user.entries) {
      return (
        <ListGroup>
          <ListGroupItem>The user has no entries</ListGroupItem>
        </ListGroup>
      )
    }

    return (
      <ListGroup>
        {user.entries.map((entry) => (
          <LinkContainer
            key={entry.id}
            to={`/${entry.sport}-${entry.year}/entries/${user.id}`}
          >
            <ListGroupItem>{eventDisplayName(entry)}</ListGroupItem>
          </LinkContainer>
        ))}
      </ListGroup>
    )
  }
}
