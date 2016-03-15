import React, {PropTypes, Component} from 'react';
import qs from 'query-string';
import {Button, Popover, Alert, OverlayTrigger, Glyphicon} from 'react-bootstrap';
import TimeAgo from 'react-timeago';
import dateFormat from 'dateformat';
import CSSModules from 'react-css-modules';

import Countdown from '../event/Countdown';

const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`;

@CSSModules(require('./styles/EnterButton.less'))
export default class BracketEnterButton extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    bracket: PropTypes.string.isRequired,
    onEnter: PropTypes.func.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    progress: PropTypes.object.isRequired
  };

  getHref() {
    const {event, bracket} = this.props;

    const tweetQs = qs.stringify({
      text: 'I tweeted my #marchmadness bracket!',
      url: `http://tweetyourbracket.com/${event.id}/entry/${bracket}`,
      hashtags: 'tybrkt',
      lang: 'en',
      related: 'tweetthebracket',
      via: 'tweetthebracket',
      count: 'none'
    });

    return `https://twitter.com/share?${tweetQs}`;
  }

  getOverlay() {
    const {onEnter, bracket, locks, mocked} = this.props;

    const popover = (
      <Popover id='enter-popover'>
        <p>You'll be taken to <strong>twitter.com</strong> to tweet your bracket!</p>
        {!mocked &&
          <Alert bsStyle='info'>
            Don't alter the <strong>url</strong> or <strong>#tybrkt hashtag</strong> of the tweet.
            {' '}
            Those are used to verify your entry.
          </Alert>
        }
        {mocked &&
          <Alert bsStyle='info'>
            <strong>Hey!</strong>
            {' '}
            Entries aren't open yet (this is just the the latest projected bracket).
            You're welcome to tweet it, but make sure to come back before
            {' '}
            <strong>{dateFormat(new Date(locks), 'mmmm dS h:MMTT')}</strong>
            {' '}
            to tweet your bracket for real.
          </Alert>
        }
      </Popover>
    );

    return (
      <OverlayTrigger trigger={['hover', 'focus']} placement='bottom' overlay={popover}>
        <Button
          styleName='enter-button-active'
          bsStyle='primary'
          block
          href={this.getHref()}
          onClick={() => onEnter(bracket)}
          target='_blank'
        >
          Tweet My Bracket!
        </Button>
      </OverlayTrigger>
    );
  }

  getLock() {
    const {locks, locked} = this.props;

    const popover = (
      <Popover id='countdown-popover'>
        <strong><Countdown {...{locks, locked}} /></strong>
      </Popover>
    );

    return (
      <OverlayTrigger trigger={['hover', 'focus']} placement='bottom' overlay={popover}>
        <Button
          block
          bsStyle='default'
          componentClass='button'
          styleName='enter-button-disabled'
        >
          Entries lock in <TimeAgo date={locks} formatter={formatter} />
          {' '}
          <Glyphicon glyph='time' />
        </Button>
      </OverlayTrigger>
    );
  }

  render() {
    const {progress} = this.props;

    return (
      <div className='bracket-enter'>
        {progress.complete ? this.getOverlay() : this.getLock()}
      </div>
    );
  }
}
