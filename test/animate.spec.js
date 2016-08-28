import {GreensockAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

function getElement( qry )
{
  return document.querySelector(qry);
}

describe('GreensockAnimator::animate', () => {
  let elem;
  let animator;
  let container;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element

    loadFixtures('animate.html');
    elem = getElement('#test-animate');
    elem.style.opacity = 1;
    container = getElement('#animation');
    animator = new GreensockAnimator(container);
  });

  it('returns a promise', () => {
    let result = animator.animate(elem, 'fade-in');
    expect(result.then).toBeDefined();
  });

  it('sets isAnimating to true when the animation starts and sets it to false when the animation is done', (done) => {
    expect(animator.isAnimating).toBe(false);
    animator.animate(elem, 'fade-in').then(()=> {
      expect(animator.isAnimating).toBe(false);
      done();
    });
    setTimeout( () => {
        expect(animator.isAnimating).toBe(true);
    }, 0);
  });

  it('works with a custom complete function', (done) => {
    let called = null;
    let complete = function(element) { called = element; };

    animator.animate(elem, 'fade-in', {onComplete: complete}).then(()=> {
      expect(called).toBe(elem);
      done();
    });
  });
  
  it('overrides effect with custom options', (done) => {
      elem.style.opacity = 0;
      expect(+elem.style.opacity).toBe(0);
      
      animator.animate(elem, 'fade-in', { to: { opacity: 0.5 }}).then( () => {
          expect(+elem.style.opacity).toBe(0.5);
          done();
      });
  })

  it('animates an element', (done) => {
    expect(+elem.style.opacity).toBe(1);

    animator.animate(elem, 'fade-out').then(()=> {
      expect(+elem.style.opacity).toBe(0);
      done();
    });

    //check the properties halfway through
    setTimeout(()=> {
      //get current opacity value
      let opacity = elem.style.opacity;
      //check if opacity was being animated
      expect(opacity > 0, opacity < 1).toBe(true);
    }, 100);
  });

  it('animates multiple elements in parallel', (done) => {
    let elems = container.querySelectorAll('.animate-selector');

      for( let i = 0, l = elems.length; i < l; i++ )
      {
        expect(+elems[i].style.opacity).toBe(0);
      }

    animator.animate(elems, 'fade-in').then(()=> {
      for( let i = 0, l = elems.length; i < l; i++ )
      {
        expect(+elems[i].style.opacity).toBe(1);
      }
      done();
    });

    //check the properties halfway through
    setTimeout(()=> {
      for (let i = 0, l = elems.length; i < l; i++) {
        //get current opacity value
        let opacity = elems[i].style.opacity;
        //check if opacity was being animated
        expect(opacity > 0, opacity < 1).toBe(true);
      }
    }, 100);
  });

  it('animates selectors', (done) => {
      let elems = container.querySelectorAll('.animate-selector');
      expect(+elems[0].style.opacity).toBe(0);
      
      animator.animate('.animate-selector', 'fade-in').then( () => {
          for( let i = 0, len = elems.length; i < len; i++ )
          {
              expect(+elems[i].style.opacity).toBe(1);
          }
          done();
      });
  });

  it('applies override options without overwriting', (done) => {
     
     let fade_in = animator.getEffect('fade-in');
     let opacity = fade_in.from.opacity;
      
      animator.animate(elem, 'fade-in', { from: { opacity: 0.5 }, to: { opacity: 0.9}}).then( () => {
          fade_in = animator.getEffect('fade-in');
          expect(fade_in.from.opacity).toBe(opacity);
          expect(+elem.style.opacity).toBe(0.9);
          
          done();
      });
      
      setTimeout( () => {
        expect(elem.style.opacity >= 0.5, elem.style.opacity < 1).toBe(true);
      }, 100);
  });

  it('publishes animateBegin|Active|Done events', (done) => {
    let animateBeginCalled = false;
    let animateActiveCalled = false;
    let animateDoneCalled = false;
    
    let l1 = document.addEventListener(animationEvent.animateBegin,  () => animateBeginCalled  = true );
    let l2 = document.addEventListener(animationEvent.animateActive, () => animateActiveCalled = true );
    let l3 = document.addEventListener(animationEvent.animateDone,   () => animateDoneCalled   = true );

    animator.animate(elem, 'fade-in').then(() => {
      expect(animateDoneCalled).toBe(true);
      expect(animateBeginCalled).toBe(true);
      expect(animateActiveCalled).toBe(true);

      document.removeEventListener(animationEvent.animateBegin, l1, false);
      document.removeEventListener(animationEvent.animateActive, l2, false);
      document.removeEventListener(animationEvent.animateDone, l3, false);
      done();
    });
  });

  //------------------- Test Various Arguments

  it('rejects the promise when nothing is passed', (done) => {
    animator.animate().catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  // first argument
  it('rejects the promise with an Error when first argument is undefined', (done) => {
    animator.animate(undefined, 'fade-in').catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is null', (done) => {
    animator.animate(null, 'fade-in').catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('resolves the promise with an Array when first argument is an Array', (done) => {
    let elems = container.querySelectorAll('.animate-selector');
    let els = [];
    for (let i = 0; i < elems.length; i++) {
      els.push(elems[i]);
    }
    animator.animate(els, 'fade-in').then(result=> {
      expect(Array.isArray(result)).toBe(true);
      done();
    });
  });

  // second argument
  it('rejects the promise with an Error when second argument is an effect name that has not been registered', (done) => {
    animator.animate(elem, 'wrongEffectName').catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is omitted', (done) => {
    animator.animate(elem).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is undefined', (done) => {
    animator.animate(elem, undefined).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is null', (done) => {
    animator.animate(elem, null).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });
});
