# Getting Started

## Setup

In your main config function for Aurelia use the plugin and change any defaults.
```javascript
aurelia.use.plugin('animator-greensock', instance => {
        
        // change defaults and register effects.
        instance.defaultStagger = 0.1; // 100ms. GSAP durations are in seconds
        instance.defaults = {
                ease: 'Power4.easeOut',
                duration: 1 // 1s
        };
        
        // change default enter or leave effect
        instance.registerEffect('enter', 'bounce-in'); // overwrites default enter animation
});
```

## (Un)Registering Effects

Register effects for use anywhere in the app. Effects can be completely new effects, modified existing effects, aliases and even functions that return an effect.

```javascript
// register
animator.registerEffect('my-new-effect', /* properties or alias */ );
// unregister
animator.unregisterEffect('my-new-effect'); 
```

```javascript
animator.registerEffect('fade-in', { duration: 0.5, from: { opacity: 0 } );

// Alias an existing effect
animator.registerEffect('enter','fade-in');
```

```javascript
    // register an effect function
animator.registerEffect( 'random-effect', () => {
        // return an effect alias/name, or object.
});
```

## Setting effects per element

Each element can override the default _enter_ and _leave_ animations.

```html
<div class="au-animate" anim-enter="some-enter-effect" anim-leave="some-leave-effect">Customized</div>
```

# Create an effect on the element 
```html
<!-- make a custom fade animation for this element -->
<div class="au-animate" anim-enter="{ duration: 1.5, from: { opacity: 0 }, to: { opacity: .6 } }">Faded</div>
```

# Modify registered effects for an element
```html
<!-- modified effects: extend duration to 5 seconds -->
<div class="au-animate" anim-enter="{ duration: 5, effect: 'fade-in' }">Modified</div>
```

# Chain effects into a sequence of animations.
_These will be executed sequentially_
```html
<!-- sequence of effects -->
<div class="au-animate" anim-enter="fade-in;wobble">Sequence</div>
```

All of these methods of customizing effects can be combined.
```html
<!-- chain registered, modified registered and local custom animations !-->
<div class="au-animate" anim-enter="fade-in;{ duration: 3, effect: 'wobble' };{ duration: 1, to: { x: '+=20' } }">Mix</div>

<!-- create a sequence of animations and set the total duration -->
<div class="au-animate" anim-enter="{ duration: 3, effect: ['fade-in','wobble'] }">3 seconds-ish</div>  
```

# Staggered animations

In [Aurelia](http://aurelia.io) a group of animated elements can be staggered by adding _au-stagger_ to the parent element. The default stagger delay can be set as shown in the config section, or modified as needed with the `stagger-delay` attribute.

```html
<!-- stagger the elements by 1 second -->
<div class="au-stagger" stagger-delay="1">
    <div class="au-animate">X</div>
    <div class="au-animate">X</div>
    <div class="au-animate">X</div>
</div>
```

## GSAP Comparison

As an example on how the animator syntax relates to the GSAP library. Below is a **fade in** animation with both using the same values (duration, opacity).

```javascript
TweenMax.fromTo( element, 1, { opacity: 0 }, { opacity: 1 } );
```

```javascript
animator.animate( element, { duration: 1, from: { opacity: 0 }, to: { opacity: 1 } } );
```

The animator takes an object and determines the best type of _tween_ to use. If only a `to` or `from` property is given the animator will use the `.to` or `.from` tweens from GSAP. 

GSAP provides a `set` method to just set values on an element and that is available as well.
```javascript
animator.animate( element, {set: { opacity: 1 }} );
```

The default tween when no `from`,`to` or `set` property is provided is `TweenMax.from`. These effects are the same.
```javascript
animator.animate( element, { duration: 1, opacity: 0 } );
animator.animate( element, { duration: 1, from: { opacity: 0 }} );
```  

The outter most properties take precedent when modifying registered effects, so if a property is modified mulitple times only the final value is used.

`{ duration: .5, effect: { duration: 3, effect: 'fade-in' }}`

The animation will have a duration of 0.5 seconds as that's the outter most override.


## GSAP

[Greensock](http://greensock.com/docs/#/HTML5/) documentation. 

## Pre-packaged Effects

Some [effects](src/effects.js) are provided.
