var User = require('../models/User');

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy
}

function index (req, res, next) {
  res.json(req.authenticatedUser.playlists);
}

function create(req, res, next) {

}

function show(req, res, next) {

}

function update(req, res, next) {

}

function destroy(req, res, next) {
  
}
