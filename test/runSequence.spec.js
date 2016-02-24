import {GreensockAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-greensock', () => {
  let elem;
  let animator;
  let container;
  let seq;
  let testSequence;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);

    loadFixtures('animation.html');
    container = $('#animation').eq(0)[0];
    seq = container.querySelector('#test-sequence');

    testSequence = [
      {element: seq.children[0], duration: .1, from: {opacity: 1, y: 0}, to: { opacity: 0, y: 50 }},
      {element: seq.children[1], duration: .1, delay: .05, ease: 'Linear.easeIn', from: { opacity: 1 }, to: { opacity: 1 }},
      {element: seq.children[2], duration: .1, delay: 0, from: { opacity: 1, y: 0}, to: { opacity: 0, y: 50 }}
    ];

    animator = new GreensockAnimator(container);
  });

  describe('runSequence function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.runSequence(testSequence);
      expect(result.then).toBeDefined();
    });

    it('executes animations one after another', (done) => {
      animator.runSequence(testSequence).then(() => {
        expect(seq.children[0].style.opacity).toBe('0');
        expect(seq.children[1].style.opacity).toBe('1');
        expect(seq.children[2].style.opacity).toBe('0');
        done();
      });
    });

    it('publishes a sequenceBegin and sequenceDone event', (done) => {
      let sequenceBeginCalled = false;
      let sequenceDoneCalled = false;
      let l1 = document.addEventListener(animationEvent.sequenceBegin, (payload) => sequenceBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.sequenceDone, () => sequenceDoneCalled = true);

      animator.runSequence(testSequence, 'tada').then(() => {
        expect(sequenceDoneCalled).toBe(true);
        expect(sequenceBeginCalled).toBe(true);
        
        document.removeEventListener(animationEvent.sequenceDone, l2, false);
        document.removeEventListener(animationEvent.sequenceBegin, l1, false);
        
        done();
      });

    });

    //----- arguments

    it('rejects the promise when nothing is passed', (done) => {
      animator.runSequence().catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when null is passed', (done) => {
      animator.runSequence(null).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when an object s passed', (done) => {
      animator.runSequence({}).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when an HTMLElement is passed', (done) => {
      animator.runSequence(seq).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when a boolean is passed', (done) => {
      animator.runSequence(true).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when a number is passed', (done) => {
      animator.runSequence(5).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });
  });
});
