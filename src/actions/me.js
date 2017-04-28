import {CALL_API} from 'redux-api-middleware';
import qs from 'query-string';
import {replace} from 'react-router-redux';
import {auth as fbAuth, twitter as fbTwitter} from 'lib/firebase';
import * as actions from '../constants/me';
import * as meSelectors from '../selectors/me';

export const syncLogin = (auth) => {
  if (!auth) {
    return syncLogout();
  }
  return {
    type: actions.LOGIN,
    auth
  };
};

export const syncLogout = (error) => ({
  type: actions.LOGOUT,
  error
});

export const getFriends = () => (dispatch, getState) => {
  const {me} = getState();
  const {id, twitterAuth} = me;
  const {accessToken: token, secret} = twitterAuth;

  if (!token || !secret || !id) {
    return dispatch({
      type: actions.FRIENDS_FETCH_ERROR,
      error: true,
      payload: new Error('Login required')
    });
  }

  return dispatch({
    [CALL_API]: {
      endpoint: `https://wt-lukekarrys-gmail_com-0.run.webtask.io/twitter-friends-webtask?${qs.stringify({id, token, secret})}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      // Cache friends forever
      bailout: meSelectors.friends,
      types: [
        actions.FRIENDS_FETCH_START,
        actions.FRIENDS_FETCH_SUCCESS,
        actions.FRIENDS_FETCH_ERROR
      ]
    }
  });
};

export const loginUser = (user) => (dispatch, getState) => {
  if (!user) {
    return syncLogout();
  }

  return dispatch({
    type: actions.LOGIN,
    auth: {user}
  });
};

export const login = ({redirect} = {}) => (dispatch, getState) => {
  dispatch({type: actions.LOGIN_START});
  fbAuth.signInWithPopup(fbTwitter).then((result) => {
    dispatch(syncLogin(result));
    if (redirect) {
      return dispatch(replace(redirect));
    }
    return null;
  }).catch((err) => {
    dispatch(syncLogout(err));
  });
};

export const logout = () => (dispatch) => {
  fbAuth.signOut();
  dispatch(syncLogout());
};
