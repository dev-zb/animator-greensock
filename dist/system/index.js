'use strict';

System.register(['aurelia-templating', './animator'], function (_export, _context) {
  "use strict";

  var TemplatingEngine, GreensockAnimator;
  function configure(config, callback) {
    var animator = config.container.get(GreensockAnimator);

    config.container.get(TemplatingEngine).configureAnimator(animator);
    if (typeof callback === 'function') {
      callback(animator);
    }
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaTemplating) {
      TemplatingEngine = _aureliaTemplating.TemplatingEngine;
    }, function (_animator) {
      GreensockAnimator = _animator.GreensockAnimator;
    }],
    execute: function () {
      _export('GreensockAnimator', GreensockAnimator);
    }
  };
});