import {GreensockAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-greensock', () => {
  let elem;
  let animator;
  let container;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);
    container = $('#animation').eq(0)[0];
    animator = new GreensockAnimator(container);
  });

  describe('addClass function', () => {
    beforeEach(() => {
      loadFixtures('class.html');
      elem = $('.remove-class').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.addClass(elem, 'promise');
      expect(result.then).toBeDefined();
    });

    it('adds class to element class list', (done) => {
        animator.addClass(elem, 'add-class')
        .then( () => {
            expect(elem.classList.contains('add-class')).toBe(true);
            done();
        });
    });

    it('publishes addClassBegin|Active|Done events', (done) => {
      let addBeginCalled = false;
      let addDoneCalled = false;
      let addActiveCalled = false;
      
      let l1 = document.addEventListener(animationEvent.addClassBegin,  () => addBeginCalled  = true);
      let l2 = document.addEventListener(animationEvent.addClassActive, () => addActiveCalled = true );
      let l3 = document.addEventListener(animationEvent.addClassDone,   () => addDoneCalled   = true);

      animator.addClass(elem, 'add-class').then(() => {
        expect(addActiveCalled).toBe(true);
        expect(addBeginCalled).toBe(true);
        expect(addDoneCalled).toBe(true);
          
        document.removeEventListener(animationEvent.addClassBegin,  l1, false);
        document.removeEventListener(animationEvent.addClassActive, l2, false);
        document.removeEventListener(animationEvent.addClassDone,   l3, false);
        
        done();
      });

    });
  });
  
  //= = =\\
  //     \\
  //= = =\\
  
  describe('removeClass function', () => {
    beforeEach(() => {
      loadFixtures('class.html');
      elem = $('.remove-class').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.removeClass(elem, 'promise');
      expect(result.then).toBeDefined();
    });

    it('removes class from element class list', (done) => {
        animator.removeClass(elem, 'remove-class')
        .then( () => {
            expect(elem.classList.contains('remove-class')).toBe(false);
            done();
        });
    });

    it('publishes removeClassBegin|Active|Done events', (done) => {
      let removeBeginCalled = false;
      let removeDoneCalled = false;
      let removeActiveCalled = false;
      
      let l1 = document.addEventListener(animationEvent.removeClassBegin,  () => removeBeginCalled  = true );
      let l2 = document.addEventListener(animationEvent.removeClassActive, () => removeActiveCalled = true );
      let l3 = document.addEventListener(animationEvent.removeClassDone,   () => removeDoneCalled   = true );

      animator.removeClass(elem, 'remove-class').then(() => {
        expect(removeActiveCalled).toBe(true);
        expect(removeBeginCalled).toBe(true);
        expect(removeDoneCalled).toBe(true);
          
        document.removeEventListener(animationEvent.removeClassBegin,  l1, false);
        document.removeEventListener(animationEvent.removeClassActive, l2, false);
        document.removeEventListener(animationEvent.removeClassDone,   l3, false);

        done();
      });

    });
  });
  
});
