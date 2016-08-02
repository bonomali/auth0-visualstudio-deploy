'use latest';

const nconf = require('nconf');
const Webtask = require('webtask-tools');

const logger = require('./server/lib/logger');
logger.info('Starting webtask.');

let server = null;
const getServer = (req, res) => {
  if (!server) {
    nconf
      .defaults({
        AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
        AUTH0_CLIENT_ID: req.webtaskContext.secrets.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: req.webtaskContext.secrets.AUTH0_CLIENT_SECRET,
        EXTENSION_SECRET: req.webtaskContext.secrets.EXTENSION_SECRET,
        NODE_ENV: 'production',
        HOSTING_ENV: 'webtask',
        CLIENT_VERSION: process.env.CLIENT_VERSION,
        SLACK_INCOMING_WEBHOOK_URL: req.webtaskContext.secrets.SLACK_INCOMING_WEBHOOK_URL,
        TFS_TYPE: req.webtaskContext.secrets.TFS_TYPE,
        TFS_BRANCH: req.webtaskContext.secrets.TFS_BRANCH,
        TFS_PATH: req.webtaskContext.secrets.TFS_PATH,
        TFS_PROJECT: req.webtaskContext.secrets.TFS_PROJECT,
        TFS_INSTANCE: req.webtaskContext.secrets.TFS_INSTANCE,
        TFS_COLLECTION: req.webtaskContext.secrets.TFS_COLLECTION,
        TFS_USERNAME: req.webtaskContext.secrets.TFS_USERNAME,
        TFS_TOKEN: req.webtaskContext.secrets.TFS_TOKEN,
        WT_URL: req.webtaskContext.secrets.WT_URL
      });

    // Start the server.
    server = require('./server')(req.webtaskContext.storage);
  }

  return server(req, res);
};

module.exports = Webtask.fromExpress((req, res) => getServer(req, res));
