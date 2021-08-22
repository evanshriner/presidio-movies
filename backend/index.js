const express = require('express');
const process = require('process');
const http = require('http');
const config = require('./config');

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
        response.status(parseInt(err.code, 10));
        response.json({
          error: err.message,
        });
      })
      .catch(next);
  };
}

async function run() {
  app.get('/', asyncHandler(async (req, res) => {
    res.json({
      woot: 'woot',
    });
  }));

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
      await run();
    } catch (e) {
      console.error(e);
      process.kill(process.pid, 'SIGINT');
    }
  })();
}
