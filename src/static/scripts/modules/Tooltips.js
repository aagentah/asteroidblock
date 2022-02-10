/* eslint-disable new-cap, no-unused-vars */
import tippy from 'tippy.js';

import { isMobile } from '../utils/isMobile';

const Tooltips = {
  tippyShown: [],

  render() {
    !isMobile() &&
      tippy('#record', {
        content: 'Plays & records the sequence to wav file!',
        delay: [300],
        onShow(instance) {
          if (Tooltips.tippyShown.includes(instance.id)) return false;
          Tooltips.tippyShown.push(instance.id);
        }
      });

    !isMobile() &&
      tippy('#start', {
        content: 'You can use spacebar to start/stop',
        delay: [300],
        onShow(instance) {
          if (Tooltips.tippyShown.includes(instance.id)) return false;
          Tooltips.tippyShown.push(instance.id);
        }
      });

    tippy('#asteroids-change', {
      content: 'This will override your FX configuration',
      delay: [300],
      onShow(instance) {
        if (Tooltips.tippyShown.includes(instance.id)) return false;
        Tooltips.tippyShown.push(instance.id);
      }
    });
  }
};

export default Tooltips;

/* eslint-enable */
