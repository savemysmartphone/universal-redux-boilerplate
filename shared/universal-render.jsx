import crypto from 'crypto';
import serialize from 'serialize-javascript';

import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';

import ReduxResolver from './redux-resolver';
import routes from '../app/routes';
import * as I18nActions from 'ducks/i18n';

const { BROWSER, NODE_ENV } = process.env;
const cache = {};

const runRouter = function(location) {
  return new Promise(function(resolve) {
    Router.run(routes, location, function(error, initialState) {
      return resolve({ error, initialState });
    });
  });
};

export default async function({ location, history, store, locale }) {
  const resolver = new ReduxResolver();
  store.resolver = resolver;

  if (BROWSER && NODE_ENV === 'development') {
    // add redux-devtools on client side
    const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');

    return (
      <div>
        <Provider store={ store }>
          { () => <Router history={ history } routes={ routes } /> }
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={ store } monitor={ LogMonitor } />
        </DebugPanel>
      </div>
    );
  } else if (BROWSER) {
    return (
      <Provider store={ store }>
        { () => <Router history={ history } routes={ routes } /> }
      </Provider>
    );
  } else {
    // simple cache
    const { pathname, query } = location;
    const cacheKey = crypto
      .createHash('md5')
      .update(pathname + JSON.stringify(query) + locale)
      .digest('hex');

    if (NODE_ENV === 'production' && cache[cacheKey] !== undefined) {
      return cache[cacheKey];
    }

    // Initialize locale of rendering
    try {
      const messages = require(`i18n/${locale}`);
      store.dispatch(I18nActions.initialize(locale, messages));
    } catch (error) {
      store.dispatch(I18nActions.initialize('en', require('i18n/en')));
    }

    const { error, initialState } = await runRouter(location);
    if (error) throw error;

    const props = { location, ...initialState };
    const element = (
      <Provider store={ store }>
        { () => <Router { ...props } /> }
      </Provider>
    );

    // Collect promises with a first render
    React.renderToString(element);
    // Resolve them, populate stores
    await resolver.dispatchPendingActions();
    // Re-render application with data
    const state = serialize(store.getState());
    const body = React.renderToString(element);

    cache[cacheKey] = { body, state };
    return cache[cacheKey];
  }
}
