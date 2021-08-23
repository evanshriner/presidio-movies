const express = require('express');
const process = require('process');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const http = require('http');
const config = require('./config');
const Db = require('./src/db');
const RequestHandler = require('./src/requestHandler');

const db = new Db();
const requestHandler = new RequestHandler(db);
const app = express();

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise
      .resolve(fn(req, res, next))
      .catch(next);
  };
}

function errorHandler() {
  return (err, req, res, next) => {
    Promise
      .resolve(async (error, request, response) => {
        console.error(error);
        response.status(parseInt(err.code, 10) || 500);
        response.json({
          error: err.message || 'Unknown Error',
        });
      })
      .catch(next);
  };
}

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.AUTH_DOMAIN}/.well-known/jwks.json`,
  }),

  audience: config.AUTH_AUDIENCE,
  issuer: `https://${config.AUTH_DOMAIN}/`,
  algorithms: ['RS256'],
});

const checkAdmin = (req, res, next) => {
  if (!req.user.permissions.includes('admin')) return res.sendStatus(401);
  next();
};

async function run() {
  app.use(express.json());
  app.use(cors());

  app.use(checkJwt);
  // user endpoints (jwt validation only)
  app.get('/movie', asyncHandler(async (req, res) => {
    res.json(await requestHandler.getMovies());
  }));

  // admin endpoints
  app.use(checkAdmin);

  app.post('/movie', asyncHandler(async (req, res) => {
    res.json(await requestHandler.createMovie(req.body));
  }));

  app.delete('/movie/:id', asyncHandler(async (req, res) => {
    res.json(await requestHandler.deleteMovie(req.params.id));
  }));

  // test endpoint
  app.get('/admin', asyncHandler(async (req, res) => {
    res.json({
      wootAdmin: 'wootAdmin',
    });
  }));

  // for thrown errors
  app.use(errorHandler);

  const server = http.Server(app).listen(config.LISTEN_PORT, '0.0.0.0', () => {
    console.info(`Express is listening on port ${config.LISTEN_PORT}`);
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.info('Gracefully Shut Down Express');
    });
  });
}

if (require.main === module) {
  (async () => {
    try {
      // ensure connection to db prior to starting
      await db.authenticate();
      await run();
    } catch (e) {
      console.error(e);
      process.kill(process.pid, 'SIGINT');
    }
  })();
}
