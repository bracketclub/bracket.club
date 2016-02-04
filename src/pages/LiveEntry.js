import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';

import analytics from 'lib/analytics';
import mapDispatchToProps from 'lib/mapDispatchToProps';
import * as entrySelectors from '../selectors/entry';
import * as bracketSelectors from '../selectors/bracket';
import * as entryActionCreators from '../actions/entry';

import Page from '../components/layout/Page';
import LiveBracket from '../components/bracket/LiveBracket';
import BracketNav from '../components/bracket/Nav';
import BracketProgress from '../components/bracket/Progress';
import BracketHeader from '../components/bracket/Header';
import BracketEnterButton from '../components/bracket/EnterButton';

const mapStateToProps = (state, props) => ({
  validate: bracketSelectors.validate(state, props),
  bracket: entrySelectors.bracketString(state, props),
  empty: bracketSelectors.empty(state, props),
  navigation: entrySelectors.navigation(state, props),
  progress: entrySelectors.progress(state, props)
});

@connect(mapStateToProps, mapDispatchToProps({entryActions: entryActionCreators, routeActions}))
export default class LiveEntryPage extends Component {
  static propTypes = {
    validate: PropTypes.func,
    bracket: PropTypes.string,
    empty: PropTypes.string,
    navigation: PropTypes.object,
    progress: PropTypes.object
  };

  static getEventPath = (e) => ({pathname: `/${e}`});

  componentDidMount() {
    // Mounting with a url bracket means we need to
    // add that bracket to the store
    this.pushBracket();
    // Or we might mount with a bracket in the store
    // but no param so the path should update
    this.updatePath();
  }

  componentDidUpdate(prevProps) {
    // Changing events means that we need to sync the
    // url if there is an entry in the store
    if (prevProps.event.id !== this.props.event.id) {
      this.updatePath();
    }
  }

  pushBracket() {
    const {bracket, empty} = this.props;
    const {bracket: bracketParam} = this.props.params;

    if (bracketParam && bracketParam !== bracket && bracketParam !== empty) {
      this.props.entryActions.pushBracket(bracketParam);
    }
  }

  updatePath() {
    const {bracket, empty} = this.props;
    const {bracket: bracketParam} = this.props.params;

    if (bracket && bracket !== bracketParam && bracket !== empty) {
      this.props.entryActions.updatePath(bracket);
    }
  }

  handleNavigate = (method) => {
    this.props.entryActions.navigate(method);
  };

  handleUpdate = (game) => {
    this.props.entryActions.update(game);
  };

  handleReset = () => {
    this.props.entryActions.reset();
  };

  handleGenerate = (method) => {
    this.props.entryActions.generate(method);
  };

  handleEnter = (bracket) => {
    analytics.enterBracket(bracket);
  };

  render() {
    const {
      navigation,
      event,
      progress,
      locks,
      bracket,
      validate
    } = this.props;

    return (
      <Page width='full'>
        <BracketHeader>
          <BracketNav
            navigation={navigation}
            event={event}
            onNavigate={this.handleNavigate}
            onGenerate={this.handleGenerate}
            onReset={this.handleReset}
          />
          <BracketEnterButton
            event={event}
            bracket={bracket}
            onEnter={this.handleEnter}
            locks={locks}
            progress={progress}
          />
          <BracketProgress
            message='picks made'
            progress={progress}
          />
        </BracketHeader>
        <LiveBracket
          validate={validate}
          bracket={bracket}
          onUpdate={this.handleUpdate}
        />
      </Page>
    );
  }
}
