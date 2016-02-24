define(['exports', 'greensock', 'aurelia-templating', 'aurelia-pal', 'aurelia-binding'], function (exports, _greensock, _aureliaTemplating, _aureliaPal, _aureliaBinding) {
    'use strict';

    exports.__esModule = true;
    exports.configure = configure;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var extendedEffects = new Map([['reset-rot', { set: { transformOrigin: 'center center', rotationX: 0, rotationY: 0, rotationZ: 0 } }], ['reset-pos', { set: { x: 0, y: 0, z: 0 } }], ['reset-vis', { set: { opacity: 1 } }], ['reset-all', { set: { x: 0, y: 0, z: 0, rotation: 0, rotationZ: 0, rotationX: 0, rotationY: 0, scale: 1, scaleZ: 1, transformOrigin: 'center center', opacity: 1 } }], ['show', { set: { opacity: 1 } }], ['hide', { set: { opacity: 0 } }], ['puff-out', { from: { opacity: 1, scale: 1, scaleZ: 1 }, to: { opacity: 0, scale: 1.8, scaleZ: 1.2 } }], ['puff-in', { to: { opacity: 1, scale: 1, scaleZ: 1 }, from: { opacity: 0, scale: .6, scaleZ: .8 } }], ['fade-in', { duration: .5, from: { opacity: 0 }, to: { opacity: 1 } }], ['fade-out', { duration: .5, to: { opacity: 0 } }], ['scale-in-up', { duration: .5, set: { transformOrigin: 'top center' }, from: { scaleY: 1, opacity: 1 }, to: { scaleY: 0, opacity: 0 } }], ['scale-out-down', { duration: .5, set: { transformOrigin: 'center top' }, from: { scaleY: 0, opacity: 0 }, to: { scaleY: 1, opacity: 1 } }], ['bounce-up-in', { ease: Bounce.easeOut, from: { y: +1000 } }], ['bounce-down-in', { ease: Bounce.easeOut, from: { y: -1000 } }], ['bounce-right-in', { ease: Bounce.easeOut, from: { x: -1000 } }], ['bounce-left-in', { ease: Bounce.easeOut, from: { x: +1000 } }], ['bounce-up-out', { ease: Elastic.easeIn.config(2.5, .8), from: { y: 0 }, to: { y: -1000 } }], ['bounce-down-out', { ease: Elastic.easeIn.config(2.5, .8), from: { y: 0 }, to: { y: +1000 } }], ['bounce-right-out', { ease: Elastic.easeIn.config(2.5, .8), from: { x: 0 }, to: { x: -1000 } }], ['bounce-left-out', { ease: Elastic.easeIn.config(2.5, .8), from: { x: 0 }, to: { x: +1000 } }], ['scale-bounce-in-up', { duration: .5, ease: 'Bounce.easeOut', set: { transformOrigin: 'top center' }, from: { scaleY: 1, opacity: 1 }, to: { scaleY: 0, opacity: 0 } }], ['scale-bounce-out-down', { duration: .75, ease: 'Bounce.easeOut', set: { transformOrigin: 'center top' }, from: { scaleY: 0, opacity: 0 }, to: { scaleY: 1, opacity: 1 } }], ['shake-h', { ease: Elastic.easeOut.config(2.3, 0.4), effect: [{ duration: .01, to: { x: -10 } }, { duration: .7, to: { x: 0 } }] }], ['shake-v', { ease: Elastic.easeOut.config(2.3, 0.4), effect: [{ duration: .01, to: { y: -10 } }, { duration: .7, to: { y: 0 } }] }], ['wobble', { duration: 1, ease: Elastic.easeOut.config(2.0, 0.3), effect: [{ duration: .01, to: { rotation: -30 } }, { duration: 1, to: { rotation: 0 } }] }], ['rock', { repeat: -1, duration: 2.5, ease: Linear.easeNone, effect: [{ duration: .25, set: { transformOrigin: '50% 65% 0px' }, from: { rotationZ: 0 }, to: { rotationZ: 30 } }, { duration: .5, to: { rotationZ: -30 } }, { duration: .25, to: { rotationZ: 0 } }]
    }], ['flip-in-h', { ease: Power2.easeIn, duration: .4, from: { rotationY: -90, transformPerspective: 600 }, to: { rotationY: 0 } }], ['flip-in-v', { ease: Power2.easeIn, duration: .4, from: { rotationX: -90, transformPerspective: 600 }, to: { rotationX: 0 } }], ['flip-out-h', { ease: Power2.easeOut, duration: .4, from: { rotationY: 0, transformPerspective: 600 }, to: { rotationY: 90 } }], ['flip-out-v', { ease: Power2.easeOut, duration: .4, from: { rotationX: 0, transformPerspective: 600 }, to: { rotationX: 90 } }], ['tada', { effect: [{ duration: 0.16, to: { rotation: "-=5", opacity: 1 }, from: { transformOrigin: 'center center' } }, { duration: 0.08, to: { scale: .8 }, position: "-=0.16" }, { duration: 0.08, to: { scale: 1.3 }, position: "-=0.08" }, { duration: 0.08, to: { rotation: "+=10" } }, { duration: 0.08, to: { rotation: "-=10" } }, { duration: 0.08, to: { rotation: "+=10" } }, { duration: 0.08, to: { rotation: "-=10" } }, { duration: 0.08, to: { rotation: "+=10" } }, { duration: 0.08, to: { rotation: "-=10" } }, { duration: 0.16, to: { rotation: "+=5", scale: 1 } }] }], ['jump', { duration: .75, effect: [{ from: { y: 0 } }, { ease: Power3.easeOut, duration: .1, to: { y: -30 } }, { ease: Bounce.easeOut, duration: 1, to: { y: 0 } }] }], ['flash', { duration: .35, repeat: 3, yoyo: true, effect: { from: { opacity: 1 }, to: { opacity: 0 } } }], ['pulse', { repeat: 1, duration: .75, effect: [{ set: { scale: 1, opacity: 1 } }, { to: { scale: .9, opacity: .7 } }, { to: { scale: 1, opacity: 1 } }] }], ['jiggle', { duration: .6, effect: [{ to: { scaleX: 1.25, scaleY: .75 }, from: { scale: 1, scaleZ: 1 } }, { to: { scaleX: .75, scaleY: 1.25 } }, { to: { scaleX: 1.15, scaleY: .85 } }, { to: { scaleX: .95, scaleY: 1.05 } }, { to: { scaleX: 1.05, scaleY: .95 } }, { to: { scale: 1 } }]
    }], ['browse-in', [{ duration: .15, from: { scale: .8, opacity: 0 }, to: { opacity: .7 } }, { duration: .4, to: { scale: 1.2, opacity: 1 } }, { duration: .12, to: { scale: 1 } }]], ['browse-out-left', [{ duration: .5, from: { x: 0, rotationX: 0, rotationY: 0 }, to: { x: '-105%', rotationY: 35, rotationX: 10, z: -10 } }, { duration: .3, to: { opacity: 1 } }, { duration: .2, to: { opacity: 0, x: '0%', rotationY: 0, rotationX: 0, z: -10 } }]], ['browse-out-right', [{ duration: .5, from: { x: 0, rotationX: 0, rotationY: 0 }, to: { x: '105%', rotationY: 35, rotationX: -10, z: -10 } }, { duration: .3, to: { opacity: 1 } }, { duration: .2, to: { opacity: 0, x: '0%', rotationY: 0, rotationX: 0, z: -10 } }]], ['fly-in', [{ duration: .2, to: { scale: 1.1, scaleZ: 1.1 }, from: { opacity: 0, scale: .3, scaleZ: .3 } }, { duration: .2, to: { scale: .9, scaleZ: .9 } }, { duration: .4, to: { opacity: 1 }, position: "-=.4" }, { duration: .2, to: { scale: 1.03, scaleZ: 1.03 } }, { duration: .2, to: { scale: .97, scaleZ: .97 } }, { duration: .2, to: { scale: 1, scaleZ: 1 } }]], ['fly-in-up', [{ duration: .3, from: { opacity: 0, x: 0, y: 700, z: 0 }, to: { opacity: 1, y: -20 } }, { duration: .15, to: { y: 10 } }, { duration: .15, to: { y: -5 } }, { duration: .1, to: { y: 0 } }]], ['fly-in-down', [{ duration: .6, from: { opacity: 0, x: 0, y: -1500, z: 0 }, to: { opacity: 1, y: 25 } }, { duration: .15, to: { y: -10 } }, { duration: .15, to: { y: 5 } }, { duration: .1, to: { y: 0 } }]], ['fly-in-left', [{ duration: .6, from: { opacity: 0, x: 1500, y: 0, z: 0 }, to: { opacity: 1, x: -25 } }, { duration: .15, to: { x: 10 } }, { duration: .15, to: { x: -5 } }, { duration: .1, to: { x: 0 } }]], ['fly-in-right', [{ duration: .6, to: { opacity: 1, x: 25 }, from: { opacity: 0, x: -1500, y: 0, z: 0 } }, { duration: .15, to: { x: -10 } }, { duration: .15, to: { x: 5 } }, { duration: .1, to: { x: 0 } }]], ['fly-out-down', [{ duration: .2, to: { y: 10 }, from: { opacity: 1, y: 0 } }, { duration: .25, to: { opacity: 1, y: -20 } }, { duration: .2, to: { opacity: 0, y: 700 } }]], ['fly-out-up', [{ duration: .2, to: { y: -10 }, from: { y: 0, opacity: 1 } }, { duration: .25, to: { opacity: 1, y: 20 } }, { duration: .55, to: { opacity: 0, y: -1500 } }]], ['fly-out-left', [{ duration: .2, to: { x: -10 }, from: { x: 0, opacity: 1 } }, { duration: .25, to: { opacity: 1, x: 20 } }, { duration: .55, to: { opacity: 0, x: -1500 } }]], ['fly-out-right', [{ duration: .2, to: { x: 10 }, from: { x: 0, opacity: 1 } }, { duration: .25, to: { opacity: 1, x: -20 } }, { duration: .55, to: { opacity: 0, x: 1500 } }]], ['swing-in-v', [{ ease: Power4.easeInOut, duration: .8, to: { rotationX: -45 }, from: { rotationX: 90, transformPerspective: 600 } }, { duration: .3, to: { opacity: 1 }, from: { opacity: 0 }, position: 0 }, { duration: .3, to: { rotationX: 25 } }, { duration: .2, to: { rotationX: -17.5 } }, { duration: .2, to: { rotationX: 0 } }]], ['swing-in-h', [{ set: { transformPerspective: 600, ease: Linear.easeNone } }, { ease: Power4.easeInOut, duration: .8, to: { rotationY: 45 }, from: { rotationY: -90 } }, { duration: .3, to: { opacity: 1 }, from: { opacity: 0 }, position: 0 }, { duration: .3, to: { rotationY: -27.5 } }, { duration: .2, to: { rotationY: 17.5 } }, { duration: .2, to: { rotationY: 0 } }]], ['swing-out-v', [{ delay: .1, duration: .4, to: { rotationX: -12.5 }, from: { rotationY: 0, transformPerspective: 600 } }, { duration: .3, to: { rotationX: 18 } }, { duration: .3, to: { rotationX: -38, opacity: 1 } }, { duration: .6, to: { rotationX: 90, opacity: 0 } }]], ['swing-out-h', [{ set: { transformPerspective: 600 } }, { delay: .1, duration: .6, to: { rotationY: 12.5 }, from: { rotationY: 0 } }, { duration: .4, to: { rotationY: -18.5 } }, { duration: .3, to: { rotationY: 38, opacity: 1 } }, { duration: .6, to: { rotationY: -90, opacity: 0 } }]], ['swing-in-left', [{ set: { transformOrigin: 'center left' } }, { duration: 1.1, effect: 'swing-in-h' }]], ['swing-in-right', [{ set: { transformOrigin: 'center right' } }, { duration: 1.1, effect: 'swing-in-h' }]], ['swing-in-down', [{ set: { transformOrigin: 'top center' } }, { duration: .8, effect: 'swing-in-v' }]], ['swing-in-up', [{ set: { transformOrigin: 'bottom center' } }, { duration: .8, effect: 'swing-in-v' }]], ['swing-out-left', [{ set: { transformOrigin: 'center left' } }, { duration: .8, effect: 'swing-out-h' }]], ['swing-out-right', [{ set: { transformOrigin: 'center right' } }, { duration: .8, effect: 'swing-out-h' }]], ['swing-out-up', [{ set: { transformOrigin: 'top center' } }, { duration: .8, effect: 'swing-out-v' }]], ['swing-out-down', [{ set: { transformOrigin: 'bottom center' } }, { duration: .8, effect: 'swing-out-v' }]], ['swing-set', { stagger: 1, effect: ['swing-in-down', 'swing-out-right', 'swing-in-up', 'swing-out-left', 'swing-in-right', 'swing-out-up', 'swing-in-left', 'swing-out-down'] }]]);

    exports.extendedEffects = extendedEffects;

    var GreensockAnimator = (function () {
        function GreensockAnimator(container) {
            _classCallCheck(this, GreensockAnimator);

            this.defaults = {
                duration: 1,
                delay: 0,
                ease: 'Power2.easeOut',
                repeat: 0,
                repeatDelay: 0,
                paused: false,
                yoyo: false,
                stagger: 0
            };
            this.timelineDefaults = {
                yoyo: false,
                stagger: 0,
                delay: 0,
                repeat: 0,
                repeatDelay: 0
            };
            this.defaultStagger = 0.02;
            this.isAnimating = false;
            this.effects = new Map(extendedEffects);

            this.container = container || _aureliaPal.DOM;
            this.parser = new _aureliaBinding.Parser();

            this.registerEffect('enter', 'fade-in');
            this.registerEffect('leave', 'fade-out');
        }

        GreensockAnimator.prototype._triggerDOMEvent = function _triggerDOMEvent(eventType, element) {
            _aureliaPal.DOM.dispatchEvent(_aureliaPal.DOM.createCustomEvent(eventType, { bubbles: true, cancelable: true, detail: element }));
        };

        GreensockAnimator.prototype.animate = function animate(element, nameOrProps) {
            var _this = this;

            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var silent = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

            this.isAnimating = true;
            return new Promise(function (resolve, reject) {
                if (!element) {
                    reject(new Error('Invalid element'));return;
                }

                var _resolveEffectDeep = _this.resolveEffectDeep(nameOrProps);

                var effect = _resolveEffectDeep[0];
                var ops = _resolveEffectDeep[1];

                if (!effect) {
                    reject(new Error('Invalid effect.'));return;
                }
                var _options = Object.assign({}, ops, options);

                if (!silent) {
                    _this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateBegin, element);
                }

                _options.onCompleteParams = [element, silent, _options.onComplete, _options.onCompleteParams, _options.onCompleteScope, resolve];
                _options.onCompleteScope = _this;
                _options.onComplete = _this._animOnComplete;

                _options.onStartParams = [element, silent, _options.onStart, _options.onStartParams, _options.onStartScope];
                _options.onStartScope = _this;
                _options.onStart = _this._animOnStart;

                if (effect instanceof Array) {
                        var sequenceOptions = _this._filterSequenceOptions(_options);
                        _this.runSequence(effect, element, _options, sequenceOptions);
                    } else {
                    var tween = _this._makeTween(element, effect, _options);
                }
            });
        };

        GreensockAnimator.prototype._animOnStart = function _animOnStart(element, silent, onStart, onStartParams, onStartScope) {
            if (!silent) {
                this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateActive, element);
            }
            if (onStart) {
                onStart.apply(onStartScope, onStartParams || arguments);
            }
        };

        GreensockAnimator.prototype._animOnComplete = function _animOnComplete(element, silent, onComplete, onCompleteParams, onCompleteScope, resolve) {
            this.isAnimating = false;
            if (!silent) {
                this._triggerDOMEvent(_aureliaTemplating.animationEvent.animateDone, element);
            }
            if (typeof onComplete === 'function') {
                onComplete.apply(onCompleteScope || this, onCompleteParams || arguments);
            }

            resolve(element);
        };

        GreensockAnimator.prototype._filterSequenceOptions = function _filterSequenceOptions(options) {
            var sequenceOptions = Object.assign({}, this.timelineDefaults, options);
            delete sequenceOptions.ease;
            delete options.repeat;
            delete options.repeatDelay;
            delete options.yoyo;
            delete options.delay;
            delete options.duration;
            delete options.stagger;
            delete options.align;
            delete options.position;
            delete options.onComplete;delete options.onStart;

            return sequenceOptions;
        };

        GreensockAnimator.prototype._makeTween = function _makeTween(element, options, overrideOptions) {
            element = this._ensureList(element);
            var props = Object.assign({}, options, overrideOptions);

            var to = props.to,
                from = props.from ? Object.assign({}, this.defaults, props.from) : null,
                set = props.set;
            var duration = props.duration;
            var delay = props.delay || 0;

            delete props.to;
            delete props.from;
            delete props.set;
            delete props.duration;
            delete props.delay;

            var completeAll = props.onCompleteAll || props.onComplete;
            var completeAllParams = !!completeAll ? props.onCompleteAllParams || props.onCompleteParams : null;

            delete props.onComplete;
            delete props.onCompleteParams;

            if (to) {
                to = Object.assign({}, this.defaults, to, props);
                to.delay += delay;

                if (from) {
                    Object.assign(from, set);
                    return TweenMax.staggerFromTo(element, this._duration(duration, to.duration), from, to, props.stagger, completeAll, completeAllParams, this);
                }

                Object.assign(to, set);
                return TweenMax.staggerTo(element, this._duration(duration, to.duration), to, props.stagger, completeAll, completeAllParams, this);
            } else if (from) {
                from = Object.assign({}, this.defaults, from, props);
                from.delay += delay;
                return TweenMax.staggerFrom(element, this._duration(duration, from.duration), from, props.stagger, completeAll, completeAllParams, this);
            } else if (set) {
                return TweenMax.set(element, set);
            } else {
                props.delay = delay;
                props = Object.assign({}, this.defaults, props);
                return TweenMax.staggerFrom(element, this._duration(duration, this.defaults.duration), props, props.stagger, completeAll, completeAllParams, this);
            }
        };

        GreensockAnimator.prototype._duration = function _duration(a, b, c) {
            return isNaN(a) ? isNaN(b) ? this.defaults.duration : b : a;
        };

        GreensockAnimator.prototype.stop = function stop(element) {
            TweenMax.killTweensOf(element);
            this.isAnimating = false;
            return this;
        };

        GreensockAnimator.prototype.reverse = function reverse(element) {
            TweenMax.getTweensOf(element).forEach(function (t) {
                return t.reverse();
            });

            return this;
        };

        GreensockAnimator.prototype.rewind = function rewind(element) {
            TweenMax.getTweensOf(element).forEach(function (t) {
                return t.restart();
            });

            return this;
        };

        GreensockAnimator.prototype.registerEffect = function registerEffect(name, props) {
            this.effects.set(name, props);

            return this;
        };

        GreensockAnimator.prototype.unregisterEffect = function unregisterEffect(name) {
            this.effects['delete'](name);

            return this;
        };

        GreensockAnimator.prototype.getEffect = function getEffect(name) {
            return this.effects.get(name);
        };

        GreensockAnimator.prototype.resolveEffect = function resolveEffect(nameOrEffect) {
            var clone = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (!nameOrEffect) {
                return null;
            }

            var last = null;
            while (typeof nameOrEffect === 'string') {
                last = nameOrEffect;nameOrEffect = this.effects.get(nameOrEffect);
            }
            if (typeof nameOrEffect === 'function') {
                nameOrEffect = nameOrEffect();return this.resolveEffect(nameOrEffect, clone);
            }

            if (!nameOrEffect) {
                last = this._parseAttributeValue(last);
                if (typeof last === 'string') {
                    return null;
                }
                nameOrEffect = last;
            }
            return nameOrEffect instanceof Array ? nameOrEffect : clone ? Object.assign({}, nameOrEffect) : nameOrEffect;
        };

        GreensockAnimator.prototype.resolveEffectDeep = function resolveEffectDeep(effect) {
            var options = {};
            effect = this._modifiedEffect(this.resolveEffect(effect, true), options);

            return [effect, options];
        };

        GreensockAnimator.prototype._modifiedEffect = function _modifiedEffect(effect, options) {
            while (effect.effect) {
                Object.assign(options, effect);
                delete options.effect;

                effect = this.resolveEffect(effect.effect, true);
            }
            return effect;
        };

        GreensockAnimator.prototype.runSequence = function runSequence(sequence, element) {
            var _this2 = this,
                _arguments = arguments;

            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var sequenceOptions = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

            return new Promise(function (resolve, reject) {
                _this2.sequenceReject = reject;

                try {
                    if (!_arguments.length) {
                        throw new Error('Empty sequence arguments');
                    }

                    sequence = _this2.resolveEffect(sequence, true);
                    if (!sequence || !(sequence instanceof Array)) {
                        throw new Error('Invalid sequence');
                    }

                    var _options = Object.assign({}, options);

                    var _sequenceOptions = Object.assign({}, sequenceOptions, {
                        onStartParams: [element, sequenceOptions.onStart, sequenceOptions.onStartParams, sequenceOptions.onStartScope],
                        onStartScope: _this2,
                        onStart: _this2._sequenceOnStart,

                        onCompleteParams: [element, sequenceOptions.onComplete, sequenceOptions.onCompleteParams, sequenceOptions.onCompleteScope, resolve],
                        onCompleteScope: _this2,
                        onComplete: _this2._sequenceOnComplete
                    });

                    delete _options.onComplete;
                    delete _options.onStart;

                    _this2._makeTimeline(sequence, element, _options, _sequenceOptions);
                } catch (e) {
                    _this2.stopSequence(sequence);
                }
            });
        };

        GreensockAnimator.prototype._sequenceOnStart = function _sequenceOnStart(element, onStart, onStartParams, onStartScope) {
            this._triggerDOMEvent(_aureliaTemplating.animationEvent.sequenceBegin, element);
            if (typeof onStart === 'function') {
                onStart.apply(onStartScope || this, onStartParams);
            }
        };

        GreensockAnimator.prototype._sequenceOnComplete = function _sequenceOnComplete(element, onComplete, onCompleteParams, onCompleteScope, resolve) {
            this._triggerDOMEvent(_aureliaTemplating.animationEvent.sequenceDone, element);

            if (typeof onComplete === 'function') {
                onComplete.apply(onCompleteScope || this, onCompleteParams);
            }

            this.sequenceReject = null;
            resolve(true);
        };

        GreensockAnimator.prototype.makeTimeline = function makeTimeline(sequence, element, elementOptions, timelineOptions) {
            var _resolveEffectDeep2 = this.resolveEffectDeep(sequence);

            var effect = _resolveEffectDeep2[0];
            var options = _resolveEffectDeep2[1];

            var tlop = this._filterSequenceOptions(options);

            return this._makeTimeline(effect, element, Object.assign(options, elementOptions), Object.assign(tlop, timelineOptions));
        };

        GreensockAnimator.prototype._makeTimeline = function _makeTimeline(sequence, element) {
            var overrideOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var timelineOptions = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

            var requestedPause = timelineOptions.paused;
            timelineOptions.paused = true;
            if (timelineOptions.autoRemoveChildren === undefined) {
                timelineOptions.autoRemoveChildren = !timelineOptions.repeat;
            }
            var timeline = new TimelineMax(timelineOptions);

            sequence = this._ensureList(sequence);

            var tweens = [];
            var stagger = !!timelineOptions.stagger;

            for (var i = 0, len = sequence.length; i < len; i++) {
                var effect = sequence[i],
                    options = undefined;
                var el = effect.element || element;delete effect.element;

                var _resolveEffectDeep3 = this.resolveEffectDeep(effect);

                effect = _resolveEffectDeep3[0];
                options = _resolveEffectDeep3[1];

                Object.assign(options, overrideOptions);
                if (effect instanceof Array) {
                    var so = this._filterSequenceOptions(options);
                    if (stagger) {
                        tweens.push(this._makeTimeline(effect, el, options, so));
                    } else {
                        timeline.add(this._makeTimeline(effect, el, options, so), so.position, so.align);
                    }
                } else {
                    if (stagger) {
                        tweens.push(this._makeTween(el, effect, options));
                    } else {
                        var position = options.position || effect.position;delete options.position;delete effect.position;
                        timeline.add(this._makeTween(el, effect, options), position, options.align);
                    }
                }
            }

            if (tweens.length) {
                timeline.add(tweens, "+=0", timelineOptions.align, timelineOptions.stagger);
            }

            if (timelineOptions.scale) {
                timeline.timeScale(timelineOptions.scale);
            } else if (timelineOptions.duration) {
                timeline.duration(timelineOptions.duration);
            }

            timeline.paused(requestedPause);
            timelineOptions.paused = requestedPause;

            return timeline;
        };

        GreensockAnimator.prototype.stopSequence = function stopSequence(sequence) {
            var _this3 = this;

            sequence.forEach(function (item) {
                var el = item.e || item.element || item.elements;
                _this3.stop(el, true);
            });

            if (this.sequenceReject) {
                this.sequenceReject();
                this.sequenceReject = undefined;
            }

            this._triggerDOMEvent(_aureliaTemplating.animationEvent.sequenceDone);
            return this;
        };

        GreensockAnimator.prototype._modClass = function _modClass(element, className, mode, method) {
            var _this4 = this;

            this._triggerDOMEvent(_aureliaTemplating.animationEvent[mode + 'ClassBegin'], element);

            return new Promise(function (resolve) {
                TweenMax.to(element, .0001, {
                    className: method + className,
                    onStart: function onStart() {
                        _this4._triggerDOMEvent(_aureliaTemplating.animationEvent[mode + 'ClassActive'], element);
                    },
                    onComplete: function onComplete() {
                        _this4._triggerDOMEvent(_aureliaTemplating.animationEvent[mode + 'ClassDone'], element);
                        resolve(true);
                    }
                });
            });
        };

        GreensockAnimator.prototype.removeClass = function removeClass(element, className) {
            return this._modClass(element, className, 'remove', '-=');
        };

        GreensockAnimator.prototype.addClass = function addClass(element, className) {
            return this._modClass(element, className, 'add', '+=');
        };

        GreensockAnimator.prototype._getStagger = function _getStagger(element, options) {
            var action = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

            var parent = element.parentElement;

            if (parent && (parent.classList.contains('au-stagger') || parent.classList.contains('au-stagger-' + action))) {
                var delay = options.delay || 0;
                var elem_pos = Array.prototype.indexOf.call(parent.children, element);
                var stagger = parent.getAttribute('stagger-delay');
                if (stagger === null || stagger === '') {
                    stagger = this.defaultStagger;
                }

                options.delay = delay + stagger * elem_pos;

                this._triggerDOMEvent(_aureliaTemplating.animationEvent.staggerNext, element);
            }

            return options;
        };

        GreensockAnimator.prototype.enter = function enter(element) {
            var effectName = arguments.length <= 1 || arguments[1] === undefined ? 'enter' : arguments[1];
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            options = this._getStagger(element, options, 'enter');
            return this._runElementAnimation(element, effectName, options, 'enter');
        };

        GreensockAnimator.prototype.leave = function leave(element) {
            var effectName = arguments.length <= 1 || arguments[1] === undefined ? 'leave' : arguments[1];
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            options = this._getStagger(element, options, 'leave');
            return this._runElementAnimation(element, effectName, options, 'leave');
        };

        GreensockAnimator.prototype._reOnStart = function _reOnStart(element, eventName, onStart, onStartParams, onStartScope) {
            if (eventName) {
                this._triggerDOMEvent(_aureliaTemplating.animationEvent[eventName + 'Active'], element);
            }
            if (typeof onStart === 'function') {
                onStart.apply(onStartScope || this, onStartParams);
            }
        };

        GreensockAnimator.prototype._reOnComplete = function _reOnComplete(element, eventName, onComplete, onCompleteParams, onCompleteScope) {
            this.isAnimating = false;

            if (eventName) {
                this._triggerDOMEvent(_aureliaTemplating.animationEvent[eventName + 'Done'], element);
            }
            if (typeof onComplete === 'function') {
                onComplete.apply(onCompleteScope || this, onCompleteParams);
            }

            return true;
        };

        GreensockAnimator.prototype._runElementAnimation = function _runElementAnimation(element, name, options) {
            var eventName = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

            if (!element || element.length === 0) {
                return Promise.resolve(element);
            }

            this._parseAttributes(element, eventName);

            if (eventName) {
                this._triggerDOMEvent(_aureliaTemplating.animationEvent[eventName + 'Begin']);
            }

            var _options = Object.assign({}, options);

            _options.onStartParams = [element, eventName, _options.onStart, _options.onStartParams, _options.onStartScope];
            _options.onStartScope = this;
            _options.onStart = this._reOnStart;

            _options.onCompleteParams = [element, eventName, _options.onComplete, _options.onCompleteParams, _options.onCompleteScope];
            _options.onCompleteScope = this;
            _options.onComplete = this._reOnComplete;

            return this.animate(element, element.animations[eventName] || name, _options, true);
        };

        GreensockAnimator.prototype._parseAttributes = function _parseAttributes(element, eventName) {
            var el = undefined,
                i = undefined,
                l = undefined,
                eventAnim = undefined;

            element = this._ensureList(element);
            for (i = 0, l = element.length; i < l; i++) {
                el = element[i];
                eventAnim = el.getAttribute('anim-' + eventName);

                el.animations = el.animations || {};
                el.animstrings = el.animstrings || {};

                if (el.animstrings[eventName] !== eventAnim) {
                        el.animations[eventName] = this._parseAttributeValue(eventAnim) || eventName;
                        el.animstrings[eventName] = eventAnim;
                    }
            }
        };

        GreensockAnimator.prototype._parseAttributeValue = function _parseAttributeValue(value) {
            if (!value) {
                return null;
            }

            var p = value.split(';');
            var p_i = undefined,
                option = undefined;

            var sequence = [];
            for (var i = 0, len = p.length; i < len; i++) {
                option = null;
                p_i = p[i];

                if (p_i[0] === '{') {
                        option = this.parser.parse(p_i).evaluate();
                    } else {
                        option = p_i;
                    }

                if (option) {
                    sequence.push(option);
                }
            }

            if (!sequence.length) {
                return null;
            }
            if (sequence.length === 1) {
                return sequence[0];
            }

            return sequence;
        };

        GreensockAnimator.prototype._ensureList = function _ensureList(element) {
            return !(element instanceof Array) && !(element instanceof NodeList) ? [element] : element;
        };

        return GreensockAnimator;
    })();

    exports.GreensockAnimator = GreensockAnimator;
    exports.GreensockAnimator = GreensockAnimator;

    function configure(config, callback) {
        var animator = config.container.get(GreensockAnimator);

        config.container.get(_aureliaTemplating.TemplatingEngine).configureAnimator(animator);
        if (typeof callback === 'function') {
            callback(animator);
        }
    }
});