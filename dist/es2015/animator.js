import { animationEvent } from 'aurelia-templating';
import { DOM } from 'aurelia-pal';
import { Parser } from 'aurelia-binding';

import 'greensock';
import { extendedEffects } from './effects';

export let GreensockAnimator = class GreensockAnimator {
    constructor(container) {
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
        this.effects = new Map(extendedEffects);

        this.container = container || DOM;
        this.parser = new Parser();

        this.registerEffect('enter', 'fade-in');
        this.registerEffect('leave', 'fade-out');
    }

    _triggerDOMEvent(eventType, element) {
        DOM.dispatchEvent(DOM.createCustomEvent(eventType, { bubbles: true, cancelable: true, detail: element }));
    }

    animate(element, nameOrProps, options = {}, silent = false) {
        this.isAnimating = true;
        return new Promise((resolve, reject) => {
            if (!element) {
                reject(new Error('Invalid element'));return;
            }

            let [effect, ops] = this.resolveEffectDeep(nameOrProps);
            if (!effect) {
                reject(new Error('Invalid effect.'));return;
            }
            let _options = Object.assign({}, ops, options);

            if (!silent) {
                this._triggerDOMEvent(animationEvent.animateBegin, element);
            }

            _options.onCompleteParams = [element, silent, _options.onComplete, _options.onCompleteParams, _options.onCompleteScope, resolve];
            _options.onCompleteScope = this;
            _options.onComplete = this._animOnComplete;

            _options.onStartParams = [element, silent, _options.onStart, _options.onStartParams, _options.onStartScope];
            _options.onStartScope = this;
            _options.onStart = this._animOnStart;

            if (effect instanceof Array) {
                    let sequenceOptions = this._filterSequenceOptions(_options);
                    this.runSequence(effect, element, _options, sequenceOptions);
                } else {
                this._makeTween(element, effect, _options);
            }
        });
    }
    _animOnStart(element, silent, onStart, onStartParams, onStartScope) {
        if (!silent) {
            this._triggerDOMEvent(animationEvent.animateActive, element);
        }
        if (onStart) {
            onStart.apply(onStartScope, onStartParams || arguments);
        }
    }
    _animOnComplete(element, silent, onComplete, onCompleteParams, onCompleteScope, resolve) {
        this.isAnimating = false;
        if (!silent) {
            this._triggerDOMEvent(animationEvent.animateDone, element);
        }
        if (typeof onComplete === 'function') {
            onComplete.apply(onCompleteScope || this, onCompleteParams || arguments);
        }

        resolve(element);
    }

    _filterSequenceOptions(options) {
        let sequenceOptions = Object.assign({}, this.timelineDefaults, options);
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
    }

    _makeTween(element, options, overrideOptions) {
        element = this._ensureList(element);
        let props = Object.assign({}, options, overrideOptions),
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

        let completeAll = props.onCompleteAll || props.onComplete;
        let completeAllParams = !!completeAll ? props.onCompleteAllParams || props.onCompleteParams : null;

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
    }
    _duration(a, b, c) {
        return isNaN(a) ? isNaN(b) ? this.defaults.duration : b : a;
    }

    stop(element) {
        TweenMax.killTweensOf(element);
        this.isAnimating = false;
        return this;
    }

    reverse(element) {
        TweenMax.getTweensOf(element).forEach(t => t.reverse());

        return this;
    }

    rewind(element) {
        TweenMax.getTweensOf(element).forEach(t => t.restart());

        return this;
    }

    registerEffect(name, props) {
        this.effects.set(name, props);

        return this;
    }

    unregisterEffect(name) {
        this.effects.delete(name);

        return this;
    }

    getEffect(name) {
        return this.effects.get(name);
    }

    resolveEffect(nameOrEffect, clone = false) {
        if (!nameOrEffect) {
            return null;
        }

        let last = null;
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
    }

    resolveEffectDeep(effect) {
        let options = {};
        effect = this._modifiedEffect(this.resolveEffect(effect, true), options);

        return [effect, options];
    }

    _modifiedEffect(effect, options) {
        while (effect.effect) {
            Object.assign(options, effect);
            delete options.effect;

            effect = this.resolveEffect(effect.effect, true);
        }
        return effect;
    }

    runSequence(sequence, element, options = {}, sequenceOptions = {}) {
        return new Promise((resolve, reject) => {
            this.sequenceReject = reject;

            try {
                if (!arguments.length) {
                    throw new Error('Empty sequence arguments');
                }

                sequence = this.resolveEffect(sequence, true);
                if (!sequence || !(sequence instanceof Array)) {
                    throw new Error('Invalid sequence');
                }

                let _options = Object.assign({}, options);

                let _sequenceOptions = Object.assign({}, sequenceOptions, {
                    onStartParams: [element, sequenceOptions.onStart, sequenceOptions.onStartParams, sequenceOptions.onStartScope],
                    onStartScope: this,
                    onStart: this._sequenceOnStart,

                    onCompleteParams: [element, sequenceOptions.onComplete, sequenceOptions.onCompleteParams, sequenceOptions.onCompleteScope, resolve],
                    onCompleteScope: this,
                    onComplete: this._sequenceOnComplete
                });

                delete _options.onComplete;
                delete _options.onStart;

                this._makeTimeline(sequence, element, _options, _sequenceOptions);
            } catch (e) {
                this.stopSequence(sequence);
            }
        });
    }

    _sequenceOnStart(element, onStart, onStartParams, onStartScope) {
        this._triggerDOMEvent(animationEvent.sequenceBegin, element);
        if (typeof onStart === 'function') {
            onStart.apply(onStartScope || this, onStartParams);
        }
    }

    _sequenceOnComplete(element, onComplete, onCompleteParams, onCompleteScope, resolve) {
        this._triggerDOMEvent(animationEvent.sequenceDone, element);

        if (typeof onComplete === 'function') {
            onComplete.apply(onCompleteScope || this, onCompleteParams);
        }

        this.sequenceReject = null;
        resolve(true);
    }

    makeTimeline(sequence, element, elementOptions, timelineOptions) {
        let [effect, options] = this.resolveEffectDeep(sequence);
        let tlop = this._filterSequenceOptions(options);

        return this._makeTimeline(effect, element, Object.assign(options, elementOptions), Object.assign(tlop, timelineOptions));
    }

    _makeTimeline(sequence, element, overrideOptions = {}, timelineOptions = {}) {
        let requestedPause = timelineOptions.paused;
        timelineOptions.paused = true;
        if (timelineOptions.autoRemoveChildren === undefined) {
            timelineOptions.autoRemoveChildren = !timelineOptions.repeat;
        }

        let timeline = new TimelineMax(timelineOptions),
            tweens = [],
            stagger = !!timelineOptions.stagger;

        sequence = this._ensureList(sequence);

        for (let i = 0, len = sequence.length; i < len; i++) {
            let effect = sequence[i],
                options;
            let el = effect.element || element;delete effect.element;

            [effect, options] = this.resolveEffectDeep(effect);

            Object.assign(options, overrideOptions);
            if (effect instanceof Array) {
                let so = this._filterSequenceOptions(options);
                if (stagger) {
                    tweens.push(this._makeTimeline(effect, el, options, so));
                } else {
                    timeline.add(this._makeTimeline(effect, el, options, so), so.position, so.align);
                }
            } else {
                if (stagger) {
                    tweens.push(this._makeTween(el, effect, options));
                } else {
                    let position = options.position || effect.position;delete options.position;delete effect.position;
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
    }

    stopSequence(sequence) {
        sequence.forEach(item => {
            let el = item.e || item.element || item.elements;
            this.stop(el, true);
        });

        if (this.sequenceReject) {
            this.sequenceReject();
            this.sequenceReject = undefined;
        }

        this._triggerDOMEvent(animationEvent.sequenceDone);
        return this;
    }

    _modClass(element, className, mode, method) {
        this._triggerDOMEvent(animationEvent[mode + 'ClassBegin'], element);
        this._triggerDOMEvent(animationEvent[mode + 'ClassActive'], element);

        return new Promise(resolve => {
            TweenMax.to(element, 0, {
                className: method + className,

                onComplete: () => {
                    this._triggerDOMEvent(animationEvent[mode + 'ClassDone'], element);
                    resolve(true);
                }
            });
        });
    }

    removeClass(element, className) {
        return this._modClass(element, className, 'remove', '-=');
    }

    addClass(element, className) {
        return this._modClass(element, className, 'add', '+=');
    }

    enter(element, effectName = 'enter', options = {}) {
        return this._runElementAnimation(element, effectName, options, 'enter');
    }

    leave(element, effectName = 'leave', options = {}) {
        return this._runElementAnimation(element, effectName, options, 'leave');
    }

    _reOnStart(element, eventName, onStart, onStartParams, onStartScope) {
        if (eventName) {
            this._triggerDOMEvent(animationEvent[eventName + 'Active'], element);
        }
        if (typeof onStart === 'function') {
            onStart.apply(onStartScope || this, onStartParams);
        }
    }

    _reOnComplete(element, eventName, onComplete, onCompleteParams, onCompleteScope) {
        this.isAnimating = false;

        if (eventName) {
            this._triggerDOMEvent(animationEvent[eventName + 'Done'], element);
        }
        if (typeof onComplete === 'function') {
            onComplete.apply(onCompleteScope || this, onCompleteParams);
        }
        return true;
    }
    _runElementAnimation(element, name, options, eventName = '') {
        if (!element || element.length === 0) {
            return Promise.resolve(element);
        }
        let _options = Object.assign({}, options);

        let parent = element.parentElement;
        if (parent && (parent.classList.contains('au-stagger') || parent.classList.contains(`au-stagger-${ eventName }`))) {
            let delay = _options.delay || 0;
            let elem_pos = Array.prototype.indexOf.call(parent.children, element);
            let stagger = parent.getAttribute('au-stagger');
            if (stagger === null || stagger === '') {
                stagger = this.defaultStagger;
            }

            _options.delay = delay + +stagger * elem_pos;

            this._triggerDOMEvent(animationEvent.staggerNext, element);
        }

        this._parseAttributes(element, eventName);

        if (eventName) {
            this._triggerDOMEvent(animationEvent[eventName + 'Begin']);
        }

        _options.onStartParams = [element, eventName, _options.onStart, _options.onStartParams, _options.onStartScope];
        _options.onStartScope = this;
        _options.onStart = this._reOnStart;

        _options.onCompleteParams = [element, eventName, _options.onComplete, _options.onCompleteParams, _options.onCompleteScope];
        _options.onCompleteScope = this;
        _options.onComplete = this._reOnComplete;

        return this.animate(element, element.animations[eventName] || name, _options, true);
    }

    _parseAttributes(element, eventName) {
        let el, i, l, eventAnim;

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
    }

    _parseAttributeValue(value) {
        if (!value) {
            return null;
        }

        let p = value.split(';');
        let p_i, option;

        let sequence = [];
        for (let i = 0, len = p.length; i < len; i++) {
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
    }

    _ensureList(element) {
        return !(element instanceof Array) && !(element instanceof NodeList) ? [element] : element;
    }
};