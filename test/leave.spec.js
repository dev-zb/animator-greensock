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

  describe('leave function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = getElement('#test-simple');
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.leave(elem);
      expect(result.then).toBeDefined();
    });

    it('sets isAnimating to true when the animation starts and sets it to false when the animation is done', (done) => {
      expect(animator.isAnimating).toBe(false);
      animator.leave(elem).then(()=> {
        expect(animator.isAnimating).toBe(false);
        done();
      });
      expect(animator.isAnimating).toBe(true);
    });

    it('can use aliases', (done) => {
      animator.leave(elem, 'fade-out').then(()=> {
        expect(+elem.style.opacity).toBe(0);
        done();
      });
    });

    it('publishes an leaveBegin|Active|Done events', (done) => {
      let leaveDoneCalled = false;
      let leaveBeginCalled = false;
      let leaveActiveCalled = false;
      
      let l3 = document.addEventListener(animationEvent.leaveDone, () => leaveDoneCalled = true);
      let l1 = document.addEventListener(animationEvent.leaveBegin, () => leaveBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.leaveActive, () => leaveActiveCalled = true );

      animator.leave(elem).then(() => {
        expect(leaveDoneCalled).toBe(true);
        expect(leaveBeginCalled).toBe(true);
        expect(leaveActiveCalled).toBe(true);
        
        document.removeEventListener(animationEvent.leaveDone, l3, false);
        document.removeEventListener(animationEvent.leaveBegin, l1, false);
        document.removeEventListener(animationEvent.leaveActive, l2, false);
        done();
      });

    });
  });
});
