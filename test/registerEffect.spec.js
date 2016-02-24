import {GreensockAnimator} from '../src/animator';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('GreensockAnimator', () => {
  let animator;
  let container;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element
    loadFixtures('register.html');
    container = $('div').eq(0)[0];
    animator = new GreensockAnimator(container);
  });

  describe('registerEffect function', () => {
    beforeEach(() => {
    });

    it('returns the animator instance for a fluent api', () => {
      let result = animator.registerEffect('some-effect', {left: 100});
      expect(result).toBe(animator);
    });

    it('registers a new effect that will be stored in the `effects` property', () => {
      let props = {left: 100};
      animator.registerEffect('newEffect', props);
      expect(animator.getEffect('newEffect') !== undefined).toBe(true);
    });

    it('registers effect alias', () => {
      animator.registerEffect('newEffect', 'fade-in');
      expect(animator.getEffect('newEffect') === 'fade-in').toBe(true);
    });

    it('resolves registered aliases', () => {
        let props = {left:100};
        animator.registerEffect('moveLeft', props);
        animator.registerEffect('alias', 'moveLeft');
        
        expect(animator.getEffect('moveLeft') !== undefined).toBe(true);
        expect(animator.resolveEffect('alias') === animator.resolveEffect('moveLeft')).toBe(true);
    });

    //------- arguments
    it('accepts strings with strange characters as a name', () => {
      let names = [
        'foo-bar',
        'foo_bar',
        'foo_bar!',
        'foo|bar',
        '!@#$%^&*()_+',
        '💩'
      ];
      for (let i = 0, l = names.length; i < l; i++) {
        let n = names[i];
        animator.registerEffect(n, {left: 100});
        expect(animator.getEffect(n) !== undefined).toBe(true);
      }
    });

    it('throws a TypeError when first aguments is not a string', () => {
      try { animator.registerEffect(null, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect(5, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect([1, 2], {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect({}, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect(true, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
    });
  });

  describe('unregisterEffect function', () => {
    beforeEach(() => {
    });

    it('returns the animator instance for a fluent api', () => {
      let result = animator.unregisterEffect('fade-out');
      expect(result).toBe(animator);
    });

    it('unregisters effects', () => {
      expect(animator.getEffect('fade-in') !== undefined).toBe(true);
      animator.unregisterEffect('fade-in');
      expect(animator.getEffect('fade-in') === undefined).toBe(true);
    });
  });
});
