import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { devTools, persistState } from 'redux-devtools';

import createMiddleware from './clientMiddleware';
import * as reducers from './reducers';
import i18n from '../ducks/i18n';

// Once everythig is a duck we can create a app/duck/reducer.js file:
// https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/ducks/reducer.js
const reducer = combineReducers({ i18n, ...reducers });

export default function(client, data) {
  const middleware = createMiddleware(client);

  let finalCreateStore;
  if (process.env.BROWSER) {
    finalCreateStore = compose(
      applyMiddleware(middleware),
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
      createStore
    );
  } else {
    finalCreateStore = applyMiddleware(middleware)(createStore);
  }

  return finalCreateStore(reducer, data);
}
