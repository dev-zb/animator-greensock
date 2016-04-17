import { TemplatingEngine } from 'aurelia-templating';
import { GreensockAnimator } from './animator';

export { GreensockAnimator };

export function configure(config, callback) {
  let animator = config.container.get(GreensockAnimator);

  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') {
    callback(animator);
  }
}