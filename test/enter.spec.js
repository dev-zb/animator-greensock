import {GreensockAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

function getElement( qry )
{
  return document.querySelector(qry);
}


describe('animator-greensock', () => {
  let elem;
  let animator;
  let container;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);

    loadFixtures('animation.html');
    container = getElement('#animation');
    animator = new GreensockAnimator(container);
  });

  describe('enter function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = getElement('#test-simple');
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.enter(elem);
      expect(result.then).toBeDefined();
    });

    it('sets isAnimating to true when the animation starts and sets it to false when the animation is done', (done) => {
      expect(animator.isAnimating).toBe(false);
      animator.enter(elem).then(()=> {
        expect(animator.isAnimating).toBe(false);
        done();
      });
      expect(animator.isAnimating).toBe(true);
    });

    it('can use aliases', (done) => {
      animator.enter(elem, 'fade-in').then(()=> {
        expect(+elem.style.opacity).toBe(1);
        done();
      });
    });

    it('publishes enterBegin|Active|Done events', (done) => {
      let enterBeginCalled = false;
      let enterDoneCalled = false;
      let enterActiveCalled = false;
      
      let l3 = document.addEventListener(animationEvent.enterDone,   () => enterDoneCalled = true);
      let l1 = document.addEventListener(animationEvent.enterBegin,  () => enterBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.enterActive, () => enterActiveCalled = true );

      animator.enter(elem).then(() => {
        expect(enterDoneCalled).toBe(true);
        expect(enterBeginCalled).toBe(true);
        expect(enterActiveCalled).toBe(true);
          
        document.removeEventListener(animationEvent.enterDone, l3, false);
        document.removeEventListener(animationEvent.enterBegin, l1, false);
        document.removeEventListener(animationEvent.enterActive, l2, false);
        
        done();
      });

    });
  });
});
