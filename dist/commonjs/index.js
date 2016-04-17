'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GreensockAnimator = undefined;
exports.configure = configure;

var _aureliaTemplating = require('aurelia-templating');

var _animator = require('./animator');

exports.GreensockAnimator = _animator.GreensockAnimator;
function configure(config, callback) {
  var animator = config.container.get(_animator.GreensockAnimator);

  config.container.get(_aureliaTemplating.TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') {
    callback(animator);
  }
}