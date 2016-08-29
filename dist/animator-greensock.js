import 'gsap';
import {animationEvent,TemplatingEngine} from 'aurelia-templating';
import {DOM} from 'aurelia-pal';
import {Parser} from 'aurelia-binding';

let extendedEffects = new Map([
                    ['reset-rot', { set: { transformOrigin: 'center center', rotationX: 0, rotationY: 0, rotationZ: 0 }}],
                    ['reset-pos', { set: { x: 0, y: 0, z: 0 }}],
                    ['reset-vis', { set: { opacity: 1 }}],
                    ['reset-all', { set: { x: 0, y: 0, z: 0, rotation: 0, rotationZ: 0, rotationX: 0, rotationY: 0, scale: 1, scaleZ: 1, transformOrigin: 'center center', opacity: 1 } }],
                    ['show', { set: { opacity: 1 }}],
                    ['hide', { set: { opacity: 0 }}],
                    ['puff-out', { from: { opacity: 1, scale: 1, scaleZ: 1}, to: { opacity: 0, scale: 1.8, scaleZ: 1.2 }}],
                    ['puff-in',  { to: { opacity: 1, scale: 1, scaleZ: 1}, from: { opacity: 0, scale: .6, scaleZ: .8 }}],
                    ['fade-in',  { duration: .5, from: { opacity: 0 }, to: { opacity: 1 }}],
                    ['fade-out', { duration: .5, to: { opacity: 0 }}],
                    ['scale-in-up', { duration: .5, set: { transformOrigin: 'top center' }, from: { scaleY: 1, opacity: 1 }, to: { scaleY: 0, opacity: 0 }}],
                    ['scale-out-down', { duration: .5, set: { transformOrigin: 'center top' }, from: { scaleY: 0, opacity: 0 }, to: { scaleY: 1, opacity: 1 }}],

                    ['bounce-up-in',    { ease: Bounce.easeOut, from: { y: +1000 }}],
                    ['bounce-down-in',  { ease: Bounce.easeOut, from: { y: -1000 }}],
                    ['bounce-right-in', { ease: Bounce.easeOut, from: { x: -1000 }}],
                    ['bounce-left-in',  { ease: Bounce.easeOut, from: { x: +1000 }}],
                    
                    ['bounce-up-out',   { ease: Elastic.easeIn.config(2.5,.8), from: { y: 0 }, to: { y: -1000 }}],
                    ['bounce-down-out', { ease: Elastic.easeIn.config(2.5,.8), from: { y: 0 }, to: { y: +1000 }}],
                    ['bounce-right-out',{ ease: Elastic.easeIn.config(2.5,.8), from: { x: 0 }, to: { x: -1000 }}],
                    ['bounce-left-out', { ease: Elastic.easeIn.config(2.5,.8), from: { x: 0 }, to: { x: +1000 }}],
                    
                    ['scale-bounce-in-up', { duration: .5, ease: 'Bounce.easeOut', set: { transformOrigin: 'top center' }, from: { scaleY: 1, opacity: 1 }, to: { scaleY: 0, opacity: 0 }}],
                    ['scale-bounce-out-down', { duration: .75, ease: 'Bounce.easeOut', set: { transformOrigin: 'center top' }, from: { scaleY: 0, opacity: 0 }, to: { scaleY: 1, opacity: 1 }}],
                    
                    ['shake-h',{ ease: Elastic.easeOut.config(2.3,0.4), effect: [{ duration: .01, to: { x: -10}}, { duration: .7, to: { x: 0}}] }],
                    ['shake-v',{ ease: Elastic.easeOut.config(2.3,0.4), effect: [{ duration: .01, to: { y: -10}}, { duration: .7, to: { y: 0}}] }],
                    
                    ['wobble', { duration: 1, ease: Elastic.easeOut.config(2.0,0.3), effect: [{duration: .01, to: { rotation: -30 }}, { duration: 1, to: { rotation: 0 }}]}],
                    ['rock', { repeat: -1, duration: 2.5, ease: Linear.easeNone, effect: [
                                {duration: .25, set: { transformOrigin: '50% 65% 0px' }, from: { rotationZ: 0 }, to: { rotationZ: 30 }},
                                {duration: .5, to: { rotationZ: -30 }},
                                {duration: .25, to: { rotationZ: 0 }}
                            ]
                    }],
                    
                    ['flip-in-h',  
                        { ease: Power2.easeIn, duration: .4, from: { rotationY: -90, transformPerspective: 600 }, to: { rotationY: 0  }}
                    ],
                    ['flip-in-v',  
                        { ease: Power2.easeIn, duration: .4, from: { rotationX: -90, transformPerspective: 600 },  to: { rotationX: 0  }}
                    ],
                    ['flip-out-h', 
                        { ease: Power2.easeOut, duration: .4, from: { rotationY: 0, transformPerspective: 600 }, to: { rotationY: 90 }}
                    ],
                    ['flip-out-v', 
                        { ease: Power2.easeOut, duration: .4, from: { rotationX: 0, transformPerspective: 600 }, to: { rotationX: 90 }}
                    ],
                    
                    ['tada', { effect: [
                                //{set: { transformOrigin: 'center center' }},
                                {duration: 0.16, to: { rotation: "-=5", opacity: 1 }, from: { transformOrigin: 'center center' } },
                                {duration: 0.08, to: { scale: .8 },  position: "-=0.16" },
                                {duration: 0.08, to: { scale: 1.3 }, position: "-=0.08" },
                                {duration: 0.08, to: { rotation: "+=10" }},
                                {duration: 0.08, to: { rotation: "-=10" }},
                                {duration: 0.08, to: { rotation: "+=10" }},
                                {duration: 0.08, to: { rotation: "-=10" }},
                                {duration: 0.08, to: { rotation: "+=10" }},
                                {duration: 0.08, to: { rotation: "-=10" }},
                                {duration: 0.16, to: { rotation: "+=5", scale: 1 }}
                                ]}],
                                
                    ['jump',   { duration: .75, effect: [{from: {y:0}}, { ease: Power3.easeOut, duration: .1, to: { y:-30 }}, { ease: Bounce.easeOut, duration: 1, to: { y: 0 }}]}],
                    ['flash',  { duration: .35, repeat: 3, yoyo: true, effect: { from: { opacity: 1 }, to: { opacity: 0 } } }],
                    ['pulse',  { repeat: 1, duration: .75, effect: [{set: { scale: 1, opacity: 1 }}, { to: { scale: .9, opacity: .7 }}, { to: { scale: 1, opacity: 1 }}]} ],
                    ['jiggle', { duration: .6, effect: 
                        [
                            //{set: {scale:  1,    scaleZ: 1    }}, 
                            {to:  {scaleX: 1.25, scaleY: .75  }, from: { scale: 1, scaleZ: 1 }}, 
                            {to:  {scaleX: .75,  scaleY: 1.25 }}, 
                            {to:  {scaleX: 1.15, scaleY: .85  }}, 
                            {to:  {scaleX: .95,  scaleY: 1.05 }}, 
                            {to:  {scaleX: 1.05, scaleY: .95  }},
                            {to:  {scale:  1 }}
                        ]
                    }],
                    
                    ['browse-in', [
                        {duration: .15, from: { scale: .8, opacity: 0 }, to: { opacity: .7}}, 
                        {duration: .4,  to: { scale: 1.2, opacity: 1 }}, 
                        {duration: .12, to: { scale: 1  }}
                    ]],
                    ['browse-out-left' , [
                        {duration: .5,  from: { x: 0, rotationX: 0, rotationY: 0 }, to: { x: '-105%', rotationY: 35, rotationX: 10, z: -10 }}, 
                        {duration: .3,  to: { opacity: 1 }}, 
                        {duration: .2,  to: { opacity: 0, x: '0%', rotationY: 0, rotationX: 0, z: -10 }}
                    ]],
                    ['browse-out-right', [
                        {duration: .5,  from: { x: 0, rotationX: 0, rotationY: 0 }, to: { x: '105%',  rotationY: 35, rotationX: -10, z: -10}}, 
                        {duration: .3,  to: {opacity: 1}}, 
                        {duration: .2,  to: { opacity: 0, x: '0%', rotationY: 0, rotationX: 0, z: -10}}
                    ]],
                    
                    
                    ['fly-in', [
                        //{set: { opacity: 0, scale: .3, scaleZ: .3 }},
                        {duration: .2,to: { scale: 1.1, scaleZ: 1.1 }, from: { opacity: 0, scale: .3, scaleZ: .3 }},
                        {duration: .2,to: { scale: .9, scaleZ: .9 }},
                        {duration: .4,to: { opacity: 1 }, position: "-=.4"},
                        {duration: .2,to: { scale: 1.03, scaleZ: 1.03 }},
                        {duration: .2,to: { scale: .97, scaleZ: .97}},
                        {duration: .2,to: { scale: 1, scaleZ: 1 }}
                    ]],
                    
                    ['fly-in-up', [
                        //{set: { opacity: 0, x: 0, y: 1500, z: 0}},
                        {duration: .3, from: { opacity: 0, x: 0, y: 700, z: 0 }, to: { opacity: 1, y: -20 }},
                        {duration: .15,to: { y: 10 }},
                        {duration: .15,to: { y: -5 }},
                        {duration: .1, to: { y: 0 }}
                    ]], 
                    
                    ['fly-in-down', [
                        //{set: { opacity: 0, x: 0, y: -1500, z: 0}},
                        {duration: .6, from: {opacity: 0, x: 0, y: -1500, z: 0}, to: { opacity: 1, y: 25 }},
                        {duration: .15,to: { y: -10 }},
                        {duration: .15,to: { y: 5 }},
                        {duration: .1, to: { y: 0 }}
                    ]],
                    
                    ['fly-in-left', [
                        //{set: { opacity: 0, x: 1500, y: 0, z: 0}},
                        {duration: .6, from: { opacity: 0, x: 1500, y: 0, z: 0 }, to: { opacity: 1, x: -25 }},
                        {duration: .15,to: { x: 10 }},
                        {duration: .15,to: { x: -5 }},
                        {duration: .1, to: { x: 0 }}
                    ]],
                    
                    ['fly-in-right', [
                        //{set: { opacity: 0, x: -1500, y: 0, z: 0}},
                        {duration: .6, to: { opacity: 1, x: 25 }, from: { opacity: 0, x: -1500, y: 0, z: 0 }},
                        {duration: .15,to: { x: -10 }},
                        {duration: .15,to: { x: 5 }},
                        {duration: .1, to: { x: 0 }}
                    ]],

                    ['fly-out-down', [
                        {duration: .2,  to: { y: 10 }, from: { opacity: 1, y: 0 }},
                        {duration: .25, to: { opacity: 1, y: -20 }},
                        {duration: .2,  to: { opacity: 0, y: 700 }}
                    ]],
                    ['fly-out-up', [
                        {duration: .2, to: { y: -10 }, from: { y: 0, opacity: 1 }},
                        {duration: .25, to: { opacity: 1, y: 20 }},
                        {duration: .55, to: { opacity: 0, y: -1500 }}
                    ]],
                    ['fly-out-left', [
                        {duration: .2,  to: { x: -10 }, from: { x: 0, opacity: 1 }},
                        {duration: .25, to: { opacity: 1, x: 20 }},
                        {duration: .55, to: { opacity: 0, x: -1500 }}
                    ]],
                    ['fly-out-right', [
                        {duration: .2,  to: { x: 10 }, from: { x: 0, opacity: 1 }},
                        {duration: .25, to: { opacity: 1, x: -20 }},
                        {duration: .55, to: { opacity: 0, x: 1500 }}
                    ]],
                    ['swing-in-v', [
                        //{set: { transformPerspective: 600 } }, //, rotationX: 90, opacity: 0 }},
                        {ease: Power4.easeInOut, duration: .8, to: { rotationX: -45 }, from: { rotationX: 90, transformPerspective: 600 }},
                        {duration: .3, to: { opacity: 1 }, from: { opacity: 0 }, position: 0},  // test: be sure position is applied properly
                        {duration: .3, to: { rotationX: 25 }},
                        {duration: .2, to: { rotationX: -17.5 }},
                        {duration: .2, to: { rotationX: 0 }}
                    ]],
                    ['swing-in-h', [
                        {set: { transformPerspective: 600, ease: Linear.easeNone }},
                        {ease: Power4.easeInOut, duration: .8, to: { rotationY: 45 }, from: { rotationY: -90 }},
                        {duration: .3, to: { opacity: 1 }, from: { opacity: 0 }, position: 0},  // test: be sure position is applied properly
                        {duration: .3, to: { rotationY: -27.5 }},
                        {duration: .2, to: { rotationY: 17.5 }},
                        {duration: .2, to: { rotationY: 0 }}
                    ]],
                    ['swing-out-v', [
                        //{set: { transformPerspective: 600 }},// rotationX: 0 }},
                        {delay: .1, duration: .4, to: { rotationX: -12.5 }, from: { rotationY: 0, transformPerspective: 600 }},
                        {duration: .3, to: { rotationX: 18 }},
                        {duration: .3, to: { rotationX: -38, opacity: 1 }},
                        {duration: .6, to: { rotationX: 90, opacity: 0 }}
                    ]],
                    ['swing-out-h', [
                        {set: { transformPerspective: 600}}, // rotationY: 0 }},
                        {delay: .1, duration: .6, to: { rotationY: 12.5 }, from: { rotationY: 0 }},
                        {duration: .4, to: { rotationY: -18.5 }},
                        {duration: .3, to: { rotationY: 38, opacity: 1 }},
                        {duration: .6, to: { rotationY: -90, opacity: 0 }}
                    ]],
                    ['swing-in-left',  [{set: { transformOrigin: 'center left'  }}, { duration: 1.1, effect: 'swing-in-h' }]],
                    ['swing-in-right', [{set: { transformOrigin: 'center right' }}, { duration: 1.1, effect: 'swing-in-h' }]],
                    ['swing-in-down',  [{set: { transformOrigin: 'top center'   }}, { duration: .8,  effect: 'swing-in-v' }]],
                    ['swing-in-up',    [{set: { transformOrigin: 'bottom center'}}, { duration: .8,  effect: 'swing-in-v' }]],
                    
                    ['swing-out-left', [{set: { transformOrigin: 'center left'  }}, { duration: .8, effect: 'swing-out-h' }]],
                    ['swing-out-right',[{set: { transformOrigin: 'center right' }}, { duration: .8, effect: 'swing-out-h' }]],
                    ['swing-out-up',   [{set: { transformOrigin: 'top center'   }}, { duration: .8, effect: 'swing-out-v' }]],
                    ['swing-out-down', [{set: { transformOrigin: 'bottom center'}}, { duration: .8, effect: 'swing-out-v' }]],
                    
                        // testing: stagger, chaining.
                    ['swing-set', { stagger: 1, effect: ['swing-in-down','swing-out-right','swing-in-up','swing-out-left','swing-in-right','swing-out-up','swing-in-left','swing-out-down']}]
]);


export {extendedEffects};
/**
 * An implementation of the Animator using Greensock.
 */
export class GreensockAnimator
{
    /**
     * Default options for greensock
     */
    defaults = {
        duration: 1,
        delay: 0,
        ease: 'Power2.easeOut',
        repeat: 0,
        repeatDelay: 0,
        paused: false,
        yoyo: false,
        stagger: 0
    };

    timelineDefaults = {
        yoyo: false,
        stagger: 0,
        delay: 0,
        repeat: 0,
        repeatDelay: 0
    }

    defaultStagger = 0.05;  // 50ms
    isAnimating = false;

    effects = new Map(extendedEffects);

    /**
     * Creates an instance of Animator.
     */
    constructor( container )
    {
        this.container = container || DOM;
        this.parser = new Parser();

        this.registerEffect('enter', 'fade-in');
        this.registerEffect('leave', 'fade-out');
    }

    _triggerDOMEvent(eventType, element)
    {
        DOM.dispatchEvent( DOM.createCustomEvent(eventType, {bubbles: true, cancelable: true, detail: element}) );
    }

    /**
     * Run a animation by name or by manually specifying properties and options for it
     *
    * @param element Element or array of elements to animate
    * @param nameOrProps Name, properties or function.
    * @param options Animation options
    * @return resolved when animation is complete
    */
    animate( element, nameOrProps, options = {}, silent = false )
    {
        this.isAnimating = true;
        return new Promise( (resolve, reject) => {
            if ( !element )
            {
                reject(new Error('Invalid element')); return;
            }

            let [effect, ops] = this.resolveEffectDeep(nameOrProps);
            if ( !effect ) { reject(new Error('Invalid effect.')); return; }
            let _options = Object.assign({}, ops, options);

            if ( !silent )
            {
                this._triggerDOMEvent(animationEvent.animateBegin, element);
            }

            _options.onCompleteParams = [element, silent, _options.onComplete, _options.onCompleteParams, _options.onCompleteScope, resolve];
            _options.onCompleteScope = this;
            _options.onComplete = this._animOnComplete;

            _options.onStartParams = [element, silent, _options.onStart, _options.onStartParams, _options.onStartScope];
            _options.onStartScope = this;
            _options.onStart = this._animOnStart;

            if ( effect instanceof Array ) /* effect is a sequence */
            {
                let sequenceOptions = this._filterSequenceOptions(_options);
                this.runSequence(effect, element, _options, sequenceOptions);
            }
            else {
                this._makeTween(element, effect, _options );
            }
        });
    }
    _animOnStart(element, silent, onStart, onStartParams, onStartScope)
    {
        if ( !silent ) { this._triggerDOMEvent(animationEvent.animateActive, element); }
        if ( onStart ) { onStart.apply(onStartScope, onStartParams || arguments); }
    }
    _animOnComplete(element, silent, onComplete, onCompleteParams, onCompleteScope, resolve)
    {
        this.isAnimating = false;
        if ( !silent )
        {
            this._triggerDOMEvent(animationEvent.animateDone, element);
        }
        if ( typeof onComplete === 'function' ) { onComplete.apply(onCompleteScope || this, onCompleteParams || arguments); }

        resolve(element);
    }

    /**
     * Make a guess at which options are meant for the sequence as a whole & separate them.
     * @param options options to filter [WILL BE MODIFIED]
     * @return sequenceOptions only the options needed for a sequence (repeat/delay,etc)
     */
    _filterSequenceOptions( options )
    {
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
        delete options.onComplete; delete options.onStart;

        return sequenceOptions;
    }

    /**
     * Creates the best fit tween based on the properties and options given. Falls back to default
     * @param element the element(s)/selector for the tween
     * @param callbacks onComplete/onStart callbacks. [optional, set to null]
     * @param options the tween properties, usually from a registered effect
     * @param overrideOptions options given as an override to the base values
     */
    _makeTween(element, options, overrideOptions)
    {
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
        
        if ( to )
        {
            to = Object.assign({}, this.defaults, to, props);
            to.delay += delay;  /* stagger */

            if ( from )
            {
                Object.assign(from, set);   /* if set is present it overrides everything. */
                return TweenMax.staggerFromTo(element, this._duration(duration, to.duration), from, to, props.stagger, completeAll, completeAllParams, this);
            }

            Object.assign(to, set);
            return TweenMax.staggerTo(element, this._duration(duration, to.duration), to, props.stagger, completeAll, completeAllParams, this);
        }
        else
        if ( from )
        {
            from = Object.assign({}, this.defaults, from, props);
            from.delay += delay; /* stagger */
            return TweenMax.staggerFrom(element, this._duration(duration, from.duration), from, props.stagger, completeAll, completeAllParams, this);
        }
        else
        if ( set )
        {
            return TweenMax.set(element, set );
        }
        else {
            props.delay = delay;
            props = Object.assign({}, this.defaults, props); 
            return TweenMax.staggerFrom(element, this._duration(duration, this.defaults.duration), props, props.stagger, completeAll, completeAllParams, this);
        }
    }
    _duration( a, b, c ) { return (isNaN(a) ? isNaN(b) ? this.defaults.duration : b : a); }

    /**
     * Stop an animation
     * @param element Element to animate
     * @return this instance for chaining
     */
    stop( element ) 
    {
        TweenMax.killTweensOf(element);
        this.isAnimating = false;
        return this;
    }

    /**
     * Stop an animation
     * @param element Element to animate
     * @return this instance for chaining
     */
    reverse( element )
    {
        TweenMax.getTweensOf(element).forEach( t => t.reverse() );

        return this;
    }

    /**
     * Bring animation back to the start state (this does not stop an animation)
     * @param element {HTMLElement}   Element to animate
     * @return this instance for chaining
     */
    rewind( element )
    {
        TweenMax.getTweensOf(element).forEach( t => t.restart() );

        return this;
    }

    /**
     * Register a new effect by name.
     * if second parameter is a string the effect will registered as an alias
     * @param name name for the effect
     * @param props properties for the effect
     * @return this instance for chaining
     */
    registerEffect( name, props )
    {
        this.effects.set(name, props);

        return this;
    }

    /**
     * Unregister an effect by name
     * @param name name of the effect
     * @return this instance for chaining
     */
    unregisterEffect( name )
    {
        this.effects.delete(name);

        return this;
    }

    /**
     * Get an effect by name
     * @param name name of the effect
     * @return effect effect alias, object, sequence or undefined
     */
    getEffect( name )
    {
        return this.effects.get(name);
    }
    
    /**
     * Get the actual effect properties or sequence
     * @param nameOrEffect name, function or effect object.
     * @param clone true to clone the effect when it's an object (best to use true on stored effects).
     * @return effect the resolved effect properties
     */
    resolveEffect( nameOrEffect, clone = false )
    {
        if ( !nameOrEffect ) { return null; }
        
        let last = null;
        while( typeof nameOrEffect === 'string' ) { last = nameOrEffect; nameOrEffect = this.effects.get(nameOrEffect); }
        if ( typeof nameOrEffect === 'function' ) { nameOrEffect = nameOrEffect(); return this.resolveEffect( nameOrEffect, clone); }

        if ( !nameOrEffect )
        {
            last = this._parseAttributeValue(last); /* if the string was a parsable effect, not a name. */
            if ( typeof last === 'string' ) { return null; } /* not a valid parsable effect, not a name/alias. */
            nameOrEffect = last;
        }
        return nameOrEffect instanceof Array ? nameOrEffect : (clone ? Object.assign({}, nameOrEffect) : nameOrEffect);
    }

    /**
     * Resolves an effect to the final step (includes applying modifications and sub effects)
     * @param effect effect name, function, or object.
     * @return [effect,option] returns effect and options in an array.
     */
    resolveEffectDeep( effect )
    {
        let options = {};
        effect = this._modifiedEffect( this.resolveEffect( effect, true), options );

        return [effect, options];
    }

    /**
     * Copies properties into options if there is a 'sub effect'
     * @param effect the effect object to check for sub effect
     * @param options [warn] will be modified with the properties of effect
     * @return effect modified or unmodified. 
     */
    _modifiedEffect( effect, options )
    {
        while( effect.effect )
        {   
            Object.assign(options, effect);
            delete options.effect;

            effect = this.resolveEffect(effect.effect, true);
        }
        return effect;
    }

    /**
     * Run a seqeunce of animations one after the other
     * @param sequence array of animations
     * @param element element to run this sequence on. If not provided the sequence information should have the elements per step.
     * @param options any override options to apply to each animation step
     * @param options options for the sequence as a whole (stagger, delay, callbacks)
     * @return A promise for sequence completion.
     */
    runSequence( sequence, element, options = {}, sequenceOptions = {} )
    {
        return new Promise( (resolve, reject) => {
            this.sequenceReject = reject;

            try
            {
                if ( !arguments.length ) { throw new Error('Empty sequence arguments'); }

                sequence = this.resolveEffect(sequence, true);
                if ( !sequence || !(sequence instanceof Array) ) { throw new Error('Invalid sequence'); }
                
                let _options = Object.assign({}, options);
                
                let _sequenceOptions = Object.assign({}, sequenceOptions,
                {
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
            } 
            catch (e)
            {
                this.stopSequence(sequence);
            }
        });
    }

    _sequenceOnStart( element, onStart, onStartParams, onStartScope )
    {
        this._triggerDOMEvent(animationEvent.sequenceBegin, element);
        if ( typeof onStart === 'function' ) { onStart.apply( onStartScope || this, onStartParams); }
    }

    _sequenceOnComplete( element, onComplete, onCompleteParams, onCompleteScope, resolve)
    {
        this._triggerDOMEvent(animationEvent.sequenceDone, element);

        if ( typeof onComplete === 'function' ) { onComplete.apply(onCompleteScope || this, onCompleteParams); }

        this.sequenceReject = null;
        resolve(true);
    }

    /**
     * Like runSequence, but returns the GSAP timeline instead of a promise.
     */
    makeTimeline( sequence, element, elementOptions, timelineOptions )
    {
        let [effect, options] = this.resolveEffectDeep(sequence);
        let tlop = this._filterSequenceOptions(options);

        return this._makeTimeline( effect, element, Object.assign(options, elementOptions), Object.assign(tlop, timelineOptions) );
    }

    /**
     * builds a GSAP timeline
     */
    _makeTimeline( sequence, element, overrideOptions = {}, timelineOptions = {} )
    {
        let requestedPause = timelineOptions.paused;    /* save desired pause state. */
        timelineOptions.paused = true;
        if ( timelineOptions.autoRemoveChildren === undefined ) { timelineOptions.autoRemoveChildren = !timelineOptions.repeat; }

        let timeline = new TimelineMax(timelineOptions),
            tweens = [],
            stagger = !!timelineOptions.stagger;

        sequence = this._ensureList(sequence);

        for( let i = 0, len = sequence.length; i < len; i++ )
        {
            let effect = sequence[i], options;
            let el = effect.element || element; delete effect.element;

            [effect, options] = this.resolveEffectDeep( effect );

            Object.assign(options, overrideOptions);
            if ( effect instanceof Array )
            {
                let so = this._filterSequenceOptions(options);
                if ( stagger )
                {
                    tweens.push(this._makeTimeline( effect, el, options, so));
                }
                else {
                    timeline.add(this._makeTimeline(effect, el, options, so), so.position, so.align);
                }
            }
            else {
                if ( stagger )
                {
                    tweens.push(this._makeTween( el, effect, options ));
                }
                else {
                    let position = options.position || effect.position; delete options.position; delete effect.position;
                    timeline.add( this._makeTween(el, effect, options), position, options.align );
                }
            }
        }

        if ( tweens.length )
        {
            timeline.add( tweens, "+=0", timelineOptions.align, timelineOptions.stagger );
        }

        if ( timelineOptions.scale )
        {
            timeline.timeScale(timelineOptions.scale);
        }
        else
        if ( timelineOptions.duration )
        {
            timeline.duration( timelineOptions.duration );
        }

        timeline.paused(requestedPause);
        timelineOptions.paused = requestedPause;    /* restore paused state. */

        return timeline;
    }

    /**
     * Runs stop on all elements in a sequence
     * @param sequence array of animations
     * @return this instance for chaining
     */
    stopSequence( sequence )
    {
        sequence.forEach( item => { 
            let el = item.e || item.element || item.elements;
            this.stop(el, true);
        });
        
        if ( this.sequenceReject ) 
        {
            this.sequenceReject();
            this.sequenceReject = undefined;
        }

        this._triggerDOMEvent( animationEvent.sequenceDone );
        return this;
    }

    /**
     * Util for adding/removing classes
     */
    _modClass( element, className, mode, method )
    {
        this._triggerDOMEvent( animationEvent[mode + 'ClassBegin'], element );
        this._triggerDOMEvent( animationEvent[mode + 'ClassActive'], element );

        return new Promise( (resolve) => {
            TweenMax.to(element, 0, // to trigger onStart duration needs to be > 0
                {
                    className: method+className,
                    //onStart: () => { this._triggerDOMEvent(animationEvent[mode + 'ClassActive'], element); }, 
                    onComplete: () => {
                        this._triggerDOMEvent( animationEvent[mode + 'ClassDone'], element );
                        resolve(true);
                    }
                });
        });
    }
    
    /**
     * Add a class to an element to trigger an animation.
     * @param element Element to animate
     * @param className Properties to animate or name of the effect to use
     * @returns Resolved when the animation is done
     */
    removeClass( element, className )
    {
        return this._modClass( element, className, 'remove','-=' );
    }

    /**
     * Add a class to an element to trigger an animation.
     * @param element Element to animate
     * @param className Properties to animate or name of the effect to use
     * @returns Resolved when the animation is done
     */
    addClass( element, className )
    {
        return this._modClass(element, className, 'add', '+=');
    }

    /**
     * Run the enter animation on an element
     * @param element Element to animate
     * @return resolved when animation is complete
     */
    enter( element, effectName = 'enter', options = {} )
    {
        return this._runElementAnimation(element, effectName, options, 'enter');
    }

    /**
     * Run the leave animation on an element
     * @param element Element to animate
     * @returns resolved when animation is complete
     */
    leave( element, effectName = 'leave', options = {} )
    {
        return this._runElementAnimation(element, effectName, options, 'leave');
    }

    /**
     * execute an animation that is coupled to an HTMLElement
     *
    * The html element can optionally override the animation options through it's attributes
    *
    * @param element {HTMLElement}   Element to animate
    * @param name {String}           Name of the effect to execute
    * @param options                 animation options
    * @param eventName               name of the event to dispatch
    *
    * @returns {Promise} resolved when animation is complete
    */
    _reOnStart( element, eventName, onStart, onStartParams, onStartScope )
    {
        if ( eventName ) { this._triggerDOMEvent(animationEvent[eventName + 'Active'], element); }
        if ( typeof onStart === 'function' ) { onStart.apply(onStartScope || this, onStartParams); }
    }
    
    _reOnComplete( element, eventName, onComplete, onCompleteParams, onCompleteScope )
    {
        this.isAnimating = false;

        if ( eventName ) { this._triggerDOMEvent(animationEvent[eventName + 'Done'], element); }
        if ( typeof onComplete === 'function' ) { onComplete.apply(onCompleteScope || this, onCompleteParams); }
        return true;
    }
    _runElementAnimation (element, name, options, eventName = '' )
    {
        if (!element || element.length === 0) { return Promise.resolve(element); }
        let _options = Object.assign({}, options);

        let parent = element.parentElement;
        if ( parent && (parent.classList.contains('au-stagger') || parent.classList.contains(`au-stagger-${eventName}`)) )
        {
            let delay = _options.delay || 0;
            let elem_pos = Array.prototype.indexOf.call(parent.children, element);
            let stagger = parent.getAttribute('au-stagger');
            if ( stagger === null || stagger === '' ) { stagger = this.defaultStagger; }

            _options.delay = delay + (+stagger * elem_pos);

            this._triggerDOMEvent(animationEvent.staggerNext, element);
        }

        /* parse animation properties */
        this._parseAttributes(element, eventName);

        if (eventName) { this._triggerDOMEvent(animationEvent[eventName + 'Begin']); }

        _options.onStartParams = [element, eventName, _options.onStart, _options.onStartParams, _options.onStartScope];
        _options.onStartScope = this;
        _options.onStart = this._reOnStart;

        _options.onCompleteParams = [element, eventName, _options.onComplete, _options.onCompleteParams, _options.onCompleteScope];
        _options.onCompleteScope = this;
        _options.onComplete = this._reOnComplete;

        return this.animate(element, element.animations[eventName] || name, _options, true );
    }

    /**
     * Parse animations specified in the elements attributes.
     * The parsed attributes will be stored in the animations property for the element.
     *
    * @param element {HTMLElement|Array<HTMLElement>}   Element(s) to parse
    */
    _parseAttributes( element, eventName )
    {
        let el, i, l, eventAnim;

        element = this._ensureList(element);
        for (i = 0, l = element.length; i < l; i++) 
        {
            el = element[i];
            eventAnim = el.getAttribute('au-' + eventName );

            el.animations = el.animations || {};
            el.animstrings = el.animstrings || {};

            if ( el.animstrings[eventName] !== eventAnim )   /* only update if attribute has changed.. */
            {            
                el.animations[eventName] = this._parseAttributeValue(eventAnim) || eventName;
                el.animstrings[eventName] = eventAnim;
            }
        }
    }

    /**
     * Parse an attribute value as an animation definition
     *
    * syntax with effectname:     effectName;{prop1:value, prop2:value}
    * syntax with properties:     {prop1:value, prop2:value};{prop1:value, prop2:value}
    *
    * @param value           Attribute value
    * @returns {Object}      Object with the effectName/properties and options that have been extracted
    */
    _parseAttributeValue( value ) 
    {
        if (!value) 
        {
            return null;
        }

        /**
         *  expected formats:
         *           [effect]:  {..properties..}
         *           [sequence] effect-name;effect-name2;{};{..., effect: }
         * 
         *           [modified effect]: { ... properties ..., effect: 'name' } 
         */
        
        let p = value.split(';');
        let p_i, option;

        let sequence = [];
        for( let i = 0, len = p.length; i < len; i++ )
        {
            option = null;
            p_i = p[i];
            
            if (p_i[0] === '{' ) /* object parameter */ 
            {
                option = this.parser.parse(p_i).evaluate(); /* unnamed/custom animation */
            }
            else {  /* effect/sequence name */
                option = p_i; /* save name, resolve later. */
            }

            if ( option ) { sequence.push(option); }
        }

        if ( !sequence.length ) { return null; }
        if ( sequence.length === 1 ) { return sequence[0]; } /* single animation */

        return sequence;
    }

    /**
     * Turn an element into an array of elements if it's not an array yet or a Nodelist
     */
    _ensureList( element )
    {
        return  (!(element instanceof Array) && !(element instanceof NodeList)) ? [element] : element;
    }
}
export {GreensockAnimator};

/**
 * Configuires the GreensockAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export function configure(config, callback) 
{
  let animator = config.container.get(GreensockAnimator);
  
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') { callback(animator); }
}
