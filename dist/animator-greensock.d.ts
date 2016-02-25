declare module 'animator-greensock' {
  import 'greensock';
  import { animationEvent, TemplatingEngine }  from 'aurelia-templating';
  import { DOM }  from 'aurelia-pal';
  import { Parser }  from 'aurelia-binding';
  
  /**
   * An implementation of the Animator using Greensock.
   */
  export class GreensockAnimator {
    
    /**
         * Default options for greensock
         */
    defaults: any;
    timelineDefaults: any;
    defaultStagger: any;
    
    //  50ms
    isAnimating: any;
    effects: any;
    
    /**
         * Creates an instance of Animator.
         */
    constructor(container: any);
    
    /**
         * Run a animation by name or by manually specifying properties and options for it
         *
        * @param element Element or array of elements to animate
        * @param nameOrProps Name, properties or function.
        * @param options Animation options
        * @return resolved when animation is complete
        */
    animate(element: any, nameOrProps: any, options?: any, silent?: any): any;
    
    /**
         * Stop an animation
         * @param element Element to animate
         * @return this instance for chaining
         */
    stop(element: any): any;
    
    /**
         * Stop an animation
         * @param element Element to animate
         * @return this instance for chaining
         */
    reverse(element: any): any;
    
    /**
         * Bring animation back to the start state (this does not stop an animation)
         * @param element {HTMLElement}   Element to animate
         * @return this instance for chaining
         */
    rewind(element: any): any;
    
    /**
         * Register a new effect by name.
         * if second parameter is a string the effect will registered as an alias
         * @param name name for the effect
         * @param props properties for the effect
         * @return this instance for chaining
         */
    registerEffect(name: any, props: any): any;
    
    /**
         * Unregister an effect by name
         * @param name name of the effect
         * @return this instance for chaining
         */
    unregisterEffect(name: any): any;
    
    /**
         * Get an effect by name
         * @param name name of the effect
         * @return effect effect alias, object, sequence or undefined
         */
    getEffect(name: any): any;
    
    /**
         * Get the actual effect properties or sequence
         * @param nameOrEffect name, function or effect object.
         * @param clone true to clone the effect when it's an object (best to use true on stored effects).
         * @return effect the resolved effect properties
         */
    resolveEffect(nameOrEffect: any, clone?: any): any;
    
    /**
         * Resolves an effect to the final step (includes applying modifications and sub effects)
         * @param effect effect name, function, or object.
         * @return [effect,option] returns effect and options in an array.
         */
    resolveEffectDeep(effect: any): any;
    
    /**
         * Run a seqeunce of animations one after the other
         * @param sequence array of animations
         * @param element element to run this sequence on. If not provided the sequence information should have the elements per step.
         * @param options any override options to apply to each animation step
         * @param options options for the sequence as a whole (stagger, delay, callbacks)
         * @return A promise for sequence completion.
         */
    runSequence(sequence: any, element: any, options?: any, sequenceOptions?: any): any;
    
    /**
         * Like runSequence, but returns the GSAP timeline instead of a promise.
         */
    makeTimeline(sequence: any, element: any, elementOptions: any, timelineOptions: any): any;
    
    /**
         * Runs stop on all elements in a sequence
         * @param sequence array of animations
         * @return this instance for chaining
         */
    stopSequence(sequence: any): any;
    
    /**
         * Add a class to an element to trigger an animation.
         * @param element Element to animate
         * @param className Properties to animate or name of the effect to use
         * @returns Resolved when the animation is done
         */
    removeClass(element: any, className: any): any;
    
    /**
         * Add a class to an element to trigger an animation.
         * @param element Element to animate
         * @param className Properties to animate or name of the effect to use
         * @returns Resolved when the animation is done
         */
    addClass(element: any, className: any): any;
    
    /**
         * Run the enter animation on an element
         * @param element Element to animate
         * @return resolved when animation is complete
         */
    enter(element: any, effectName?: any, options?: any): any;
    
    /**
         * Run the leave animation on an element
         * @param element Element to animate
         * @returns resolved when animation is complete
         */
    leave(element: any, effectName?: any, options?: any): any;
  }
  
  /**
   * Configuires the GreensockAnimator as the default animator for Aurelia.
   * @param config The FrameworkConfiguration instance.
   * @param callback A configuration callback provided by the plugin consumer.
   */
  export function configure(config: any, callback: any): any;
}