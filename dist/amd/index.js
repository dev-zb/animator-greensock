define(['exports', 'aurelia-templating', './animator'], function (exports, _aureliaTemplating, _animator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GreensockAnimator = undefined;
  exports.configure = configure;
  exports.GreensockAnimator = _animator.GreensockAnimator;
  function configure(config, callback) {
    var animator = config.container.get(_animator.GreensockAnimator);

    config.container.get(_aureliaTemplating.TemplatingEngine).configureAnimator(animator);
    if (typeof callback === 'function') {
      callback(animator);
    }
  }
});