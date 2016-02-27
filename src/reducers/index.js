import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import schema from '../schema';
import me from './me';
import event from './event';
import entry from './entry';
import users from './users';
import endpointCreator from './endpoint';

export default combineReducers({
  me,
  event,
  entry,
  users,
  masters: endpointCreator(schema.masters),
  entries: endpointCreator(schema.entries),
  routing: routerReducer
});
