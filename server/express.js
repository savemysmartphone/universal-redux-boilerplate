import path from 'path';
import debug from 'debug';
import express from 'express';
import helmet from 'helmet';
import serialize from 'serialize-javascript';

import Location from 'react-router/lib/Location';

import client from '../app/redux/api-client';
import createStore from '../app/redux/create';
import universalRender from '../shared/universal-render';

const PORT = parseInt(process.env.PORT, 10) || 3000;
const server = express();

if (process.env.NODE_ENV !== 'production') {
  debug.enable('dev,server');
} else {
  debug.enable('server');
}

// expressjs middlewares
server.use(require('response-time')());
server.use(require('morgan')('tiny'));

// helmet middlewares / security
server.use(helmet.xframe());
server.use(helmet.xssFilter());
server.use(helmet.nosniff());
server.use(helmet.ienoopen());
server.disable('x-powered-by');

// enable body parser
server.use(require('body-parser').json());

// Should be placed before express.static
server.use(require('compression')({
  // only compress files for the following content types
  filter: function(req, res) {
    return (/json|text|javascript|css/)
      .test(res.getHeader('Content-Type'));
  },
  // zlib option for compression level
  level: 3
}));

server.use('/assets', express.static(path.resolve(__dirname, '..', 'dist')));
server.set('views', path.resolve(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(async function(req, res) {
  try {
    const location = new Location(req.path, req.query);
    const store = createStore(client, {});
    const body = await universalRender({location, store, client});
    const initialState = serialize(store.getState());

    // Load assets paths from `webpack-stats`
    // remove cache on dev env
    const assets = require('./webpack-stats.json');
    if (process.env.NODE_ENV === 'development') {
      delete require.cache[require.resolve('./webpack-stats.json')];
    }

    return res.render('index.ejs', {body, assets, initialState});
  } catch (error) {
    debug('server')('error with rendering');
    debug('server')(error);

    return res.status(500).end(error);
  }
});

server.listen(PORT);
debug('server')('express server listening on %s', PORT);

if (process.send) process.send('online');