import {TemplatingEngine} from 'aurelia-templating';
import {GreensockAnimator} from './animator';

export {GreensockAnimator};

/**
 * Configuires the GreensockAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export function configure(config, callback) 
{
  let animator = config.container.get(GreensockAnimator);
  
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') { callback(animator); }
}
