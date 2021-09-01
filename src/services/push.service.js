const Pusher = require('pusher');
const config = require('../config/config');

const pusher = new Pusher({
  appId: config.pusher.appId,
  key: config.pusher.key,
  secret: config.pusher.secret,
  cluster: config.pusher.cluster,
  useTLS: true,
});

module.exports = {
  pusher,
};
