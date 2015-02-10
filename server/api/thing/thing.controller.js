/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');

// Get list of things
exports.index = function(req, res) {
  return res.json(200, {
    id: process.env.GOOGLE_ID_MOB,
    key: process.env.GOOGLE_CALENDER_KEY
  });
};

function handleError(res, err) {
  return res.send(500, err);
}