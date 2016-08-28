'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GreensockAnimator = undefined;

var _aureliaTemplating = require('aurelia-templating');

var _aureliaPal = require('aurelia-pal');

var _aureliaBinding = require('aurelia-binding');

require('greensock');

var _effects = require('./effects');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GreensockAnimator = exports.GreensockAnimator = function () {
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
        this.defaultStagger = 0.05;
        this.isAnimating = false;
        this.effects = new Map(_effects.extendedEffects);

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
                _this._makeTween(element, effect, _options);
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
        var props = Object.assign({}, options, overrideOptions),
            to = props.to,
            from = props.from ? Object.assign({}, this.defaults, props.from) : null,
            set = props.set,
            duration = props.duration,
            delay = props.delay || 0;

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
        this.effects.delete(name);

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

        var timeline = new TimelineMax(timelineOptions),
            tweens = [],
            stagger = !!timelineOptions.stagger;

        sequence = this._ensureList(sequence);

        for (var i = 0, len = sequence.length; i < len; i++) {
            var effect = sequence[i],
                options = void 0;
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
        this._triggerDOMEvent(_aureliaTemplating.animationEvent[mode + 'ClassActive'], element);

        return new Promise(function (resolve) {
            TweenMax.to(element, 0, {
                className: method + className,

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

    GreensockAnimator.prototype.enter = function enter(element) {
        var effectName = arguments.length <= 1 || arguments[1] === undefined ? 'enter' : arguments[1];
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        return this._runElementAnimation(element, effectName, options, 'enter');
    };

    GreensockAnimator.prototype.leave = function leave(element) {
        var effectName = arguments.length <= 1 || arguments[1] === undefined ? 'leave' : arguments[1];
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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
        var _options = Object.assign({}, options);

        var parent = element.parentElement;
        if (parent && (parent.classList.contains('au-stagger') || parent.classList.contains('au-stagger-' + eventName))) {
            var delay = _options.delay || 0;
            var elem_pos = Array.prototype.indexOf.call(parent.children, element);
            var stagger = parent.getAttribute('au-stagger');
            if (stagger === null || stagger === '') {
                stagger = this.defaultStagger;
            }

            _options.delay = delay + +stagger * elem_pos;

            this._triggerDOMEvent(_aureliaTemplating.animationEvent.staggerNext, element);
        }

        this._parseAttributes(element, eventName);

        if (eventName) {
            this._triggerDOMEvent(_aureliaTemplating.animationEvent[eventName + 'Begin']);
        }

        _options.onStartParams = [element, eventName, _options.onStart, _options.onStartParams, _options.onStartScope];
        _options.onStartScope = this;
        _options.onStart = this._reOnStart;

        _options.onCompleteParams = [element, eventName, _options.onComplete, _options.onCompleteParams, _options.onCompleteScope];
        _options.onCompleteScope = this;
        _options.onComplete = this._reOnComplete;

        return this.animate(element, element.animations[eventName] || name, _options, true);
    };

    GreensockAnimator.prototype._parseAttributes = function _parseAttributes(element, eventName) {
        var el = void 0,
            i = void 0,
            l = void 0,
            eventAnim = void 0;

        element = this._ensureList(element);
        for (i = 0, l = element.length; i < l; i++) {
            el = element[i];
            eventAnim = el.getAttribute('au-' + eventName);

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
        var p_i = void 0,
            option = void 0;

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
}();