/* global __MOCK__ */

import React, {Component, PropTypes} from 'react';
import Clone from 'react-clone';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {last} from 'lodash';

import countdown from 'lib/countdown';
import eventInfo from '../../selectors/event';
import * as bracketSelectors from '../../selectors/bracket';
import * as meActionCreators from '../../actions/me';
import * as eventActionCreators from '../../actions/event';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

const mapStateToProps = (state, props) => {
  const event = eventInfo(state, props);
  const locked = (state.event[event.id] || {}).locked;
  const locks = bracketSelectors.locks(state, props);
  return {
    locks,
    event,
    me: state.me,
    mocked: __MOCK__.indexOf(event.id) > -1,
    locked: typeof locked !== 'undefined' ? locked : new Date().toJSON() >= locks
  };
};

const mapDispatchToProps = (dispatch) => ({
  meActions: bindActionCreators(meActionCreators, dispatch),
  eventActions: bindActionCreators(eventActionCreators, dispatch)
});

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    locks: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
    mocked: PropTypes.bool.isRequired,
    children: PropTypes.node,
    lockedComponent: PropTypes.node,
    unlockedComponent: PropTypes.node
  };

  // The top level App component is responsible for setting the locked status
  // of the event it is currently displaying
  componentDidMount() {
    this.startCountdown();
  }

  componentDidUpdate() {
    this.startCountdown();
  }

  componentWillUnmount() {
    this.endCountdown();
  }

  endCountdown() {
    if (this.cancelCountdown) {
      this.cancelCountdown();
    }
  }

  startCountdown() {
    const {locks, eventActions, event, locked} = this.props;

    if (locked) return;

    // Start a countdown to lock the event
    this.endCountdown();
    this.cancelCountdown = countdown(locks, () => eventActions.lock(event));
  }

  render() {
    const {me, event, meActions, locked, locks, mocked} = this.props;
    const {routes, params, location} = this.props;
    const {children, lockedComponent, unlockedComponent} = this.props;

    let renderedChild, getEventPath;

    if (lockedComponent && unlockedComponent) {
      renderedChild = locked ? lockedComponent : unlockedComponent;
      getEventPath = renderedChild.type.getEventPath;
    }
    else {
      renderedChild = children;
      getEventPath = last(routes).component.getEventPath;
    }

    return (
      <div className='main-container'>
        <Header
          eventPath={getEventPath ? (e) => getEventPath(e, {params, query: location.query, pathname: location.pathname}) : null}
          me={me}
          event={event}
          onLogin={meActions.login}
          onLogout={meActions.logout}
        />
        <Clone
          element={renderedChild}
          {...{locked, event, locks, mocked, me}}
        />
        <Footer />
      </div>
    );
  }
}
