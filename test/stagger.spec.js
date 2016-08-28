import {GreensockAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

function getElement( qry )
{
  return document.querySelector(qry);
}

describe('animator-greensock', () => {
  let animator;
  let container;
  let elem;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);

    loadFixtures('animation.html');
    container = getElement('#animation');

    animator = new GreensockAnimator(container);
  });

  describe('staggering', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = getElement('#test-simple');
      animator.stop(elem, true);
    });

    it('should trigger stagger event', (done) => {
      let proms = []
        , eventCalled = false;

      elem = container.querySelectorAll('#test-stagger > .au-animate');

      var listener = document.addEventListener(animationEvent.staggerNext, () => eventCalled = true);

        for (let i = 0, l = elem.length; i < l; i++) {
            proms.push(animator.enter(elem[i]));
        }

      Promise.all(proms).then( () => {
        expect(eventCalled).toBe(true);

        document.removeEventListener(animationEvent.staggerNext, listener);
        done();
      });
    });

    it('should animate enter elements staggered', (done) => {
      var proms = [];
      elem = container.querySelectorAll('#test-stagger-enter > .au-animate');
      
        for (let i = 0, l = elem.length; i < l; i++) {
            proms.push(animator.enter(elem[i]));
        }

      var time = Date.now(); 
      Promise.all(proms).then( () => {
        let complete = (Date.now() - time) <= 500+100*elem.length;
        expect(complete).toBe(true);
        
        for (let i = 0, l = elem.length; i < l; i++) {
          expect(elem[i].style.opacity).toBe('1');
        }
        done();
      });
    });
    
    it('should animate leave elements staggered', (done) => {
      var proms = [];
      elem = Array.from(container.querySelectorAll('#test-stagger-leave > .au-animate'));
        for (let i = 0, l = elem.length; i < l; i++) {
            proms.push(animator.leave(elem[i]));
        }

    var time = Date.now(); 
      Promise.all(proms).then( () => {
        let complete = (Date.now() - time) <= 500+100*elem.length;
        expect(complete).toBe(true);
        for (let i = 0, l = elem.length; i < l; i++) {
          expect(elem[i].style.opacity).toBe('0');
        }
        done();
      })
    });

    it('publishes an animationEnd event when all elements are done animating', (done) => {
      let eventCalled = false;

      let listener = document.addEventListener(animationEvent.animateDone, () => eventCalled = true);
      elem = getElement('#test-stagger').children;

      animator.animate(elem, 'fade-in', {stagger: .05}).then(() => {
        expect(eventCalled).toBe(true);
        for (let i = 0, l = elem.length; i < l; i++) {
          expect(elem[i].style.opacity).toBe('1');
        }
        document.removeEventListener(animationEvent.staggerNext, listener);
        done();
      });
    });
  });
});
