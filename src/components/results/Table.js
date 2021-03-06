import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  PageHeader,
  Table,
  Glyphicon,
  ButtonGroup,
  Button,
} from 'react-bootstrap'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import dateFormat from 'dateformat'
import SortableTh from './SortableTh'
import EntryCanWin, { Legend as CanWinLegend } from './CanWin'

export default class ResultsTable extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    locked: PropTypes.bool.isRequired,
    locks: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    onSort: PropTypes.func.isRequired,
    onCanWinCheck: PropTypes.func.isRequired,
    sortParams: PropTypes.object.isRequired,
    friends: PropTypes.bool,
    progress: PropTypes.object,
    columns: PropTypes.array,
  }

  handleCanWinCheck = (e, id) => {
    e.preventDefault()

    const { onCanWinCheck, entries, friends } = this.props
    onCanWinCheck({ entries, id, list: friends ? 'friends' : 'global' })
  }

  render() {
    const {
      entries,
      sortParams,
      friends,
      event,
      locked,
      locks,
      onSort,
      progress,
      columns,
    } = this.props
    const hasResults = entries.length

    const headerProps = hasResults
      ? {
          sortParams,
          onClick: onSort,
        }
      : {}

    return (
      <div>
        <PageHeader>
          Results {friends && <small>(friends only) </small>}
          <ButtonGroup>
            <LinkContainer to={`/${event.id}/entries`}>
              <Button bsStyle="primary" bsSize="sm">
                <Glyphicon glyph="globe" />
              </Button>
            </LinkContainer>
            <LinkContainer to={`/${event.id}/entries/friends`}>
              <Button bsStyle="primary" bsSize="sm">
                <Glyphicon glyph="user" />
              </Button>
            </LinkContainer>
          </ButtonGroup>
        </PageHeader>
        <CanWinLegend progress={progress} />
        {!locked && (
          <p>
            Check back once the first round starts{' '}
            <strong>({dateFormat(new Date(locks), 'mmmm dS h:MMTT')})</strong>{' '}
            to see all the entries and the live results.
          </p>
        )}
        <Table condensed striped className="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              {columns
                .map((column) =>
                  column.key.indexOf('gooley') === 0 && !locked ? null : (
                    <SortableTh
                      {...headerProps}
                      hideXs={column.hideXs}
                      hideSm={column.hideSm}
                      key={column.key}
                      sortKey={column.key}
                    >
                      {column.display}
                    </SortableTh>
                  )
                )
                .filter(Boolean)}
            </tr>
          </thead>
          <tbody>
            {!hasResults && (
              <tr>
                <td colSpan="99">{`There are no results yet ${
                  friends ? 'from your friends ' : ''
                }for this event.`}</td>
              </tr>
            )}
            {entries.map((entry) =>
              // Race condition! Currently this component can be rendered with entries before
              // the scores are loaded. This causes the entries to be in their correct shape
              // except for the score. So for now just dont render a row if there is no score.
              entry.score ? (
                <tr key={entry.id} className={entry.isMe ? 'info' : ''}>
                  <td>{entry.score.index}</td>
                  <td>
                    {/* Only show links if locked or if the user is logged in and it is their entry.
                     * Obviously this isn't secure and the brackets are fetched and in the data store
                     * but this is just to make it obvious that entries aren't open and that you probably
                     * shouldn't look at anyone else's entry yet. This also makes it so that the SSE fetching
                     * for entries actually does something because prior to this change I don't think there was
                     * anywhere to actually see that data.
                     */}
                    {locked || entry.isMe ? (
                      <Link
                        to={`/${entry.sport}-${entry.year}/entries/${entry.user.id}`}
                      >
                        {entry.user.username}
                      </Link>
                    ) : (
                      entry.user.username
                    )}
                  </td>
                  {columns
                    .map((c, index) => {
                      const { key, hideSm, hideXs } = c
                      const classes = cx({
                        'hidden-xs': hideXs,
                        'hidden-sm': hideSm,
                      })

                      let result = null

                      if (key.indexOf('rounds.') === 0) {
                        result = (
                          <span>
                            {entry.score.rounds[index]}
                            {entry.score.bonus
                              ? ` (${entry.score.bonus[index]})`
                              : ''}
                          </span>
                        )
                      } else if (c.key === 'standard') {
                        result = (
                          <span>
                            {entry.score.standard}{' '}
                            <EntryCanWin
                              {...{ event, progress, entry }}
                              onCanWinCheck={this.handleCanWinCheck}
                            />
                          </span>
                        )
                      } else if (key.indexOf('gooley') === 0 && !locked) {
                        result = null
                      } else {
                        result = entry.score[key]
                      }

                      return (
                        result != null && (
                          <td key={key} className={classes}>
                            {result}
                          </td>
                        )
                      )
                    })
                    .filter(Boolean)}
                </tr>
              ) : null
            )}
          </tbody>
        </Table>
      </div>
    )
  }
}
