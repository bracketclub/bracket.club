import config from 'config'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Popover,
  Alert,
  OverlayTrigger,
  Glyphicon,
} from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import CSSModules from 'react-css-modules'
import tweetHref from 'lib/tweetHref'
import Countdown from '../../event/Countdown'
import styles from './index.less'

const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`

@CSSModules(styles)
export default class BracketEnterButton extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    bracket: PropTypes.string.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    progress: PropTypes.object.isRequired,
  }

  getOverlay() {
    const { event, bracket } = this.props

    const popover = (
      <Popover id="enter-popover">
        <p>
          You’ll be taken to <strong>twitter.com</strong> to tweet your bracket!
        </p>
        <Alert bsStyle="info">
          Don’t alter the <strong>url</strong> or{' '}
          <strong>#{config.twitter.hashtag} hashtag</strong> of the tweet. Those
          are used to verify your entry.
        </Alert>
      </Popover>
    )

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={popover}
      >
        <Button
          styleName="enter-button-active"
          bsStyle="primary"
          block
          href={tweetHref({ event, bracket })}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enter My Bracket!
        </Button>
      </OverlayTrigger>
    )
  }

  getLock() {
    const { locks, locked } = this.props

    const popover = (
      <Popover id="countdown-popover">
        <strong>
          <Countdown {...{ locks, locked }} />
        </strong>
      </Popover>
    )

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={popover}
      >
        <Button
          block
          bsStyle="default"
          componentClass="button"
          styleName="enter-button-disabled"
        >
          Entries lock in <TimeAgo date={locks} formatter={formatter} />{' '}
          <Glyphicon glyph="time" />
        </Button>
      </OverlayTrigger>
    )
  }

  render() {
    const { progress } = this.props

    return (
      <div className="bracket-enter">
        {progress.complete ? this.getOverlay() : this.getLock()}
      </div>
    )
  }
}
