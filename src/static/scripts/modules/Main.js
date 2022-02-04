/* eslint-disable new-cap, no-unused-vars */
import { detectAnyAdblocker } from 'just-detect-adblock';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Instrument from './Instrument';
import Envelope from './Envelope';
import Effects from './Effects';
import Audio from './Audio';
import Asteroid from './Asteroid';
import Tooltips from './Tooltips';

const Main = {
  main: document.querySelector('main'),
  wrapper: document.querySelector('.wrapper'),
  blockWarning: document.querySelector('.blockWarning'),

  init() {
    this.render();
  },

  handleAdBlock: async () => {
    detectAnyAdblocker().then(detected => {
      if (detected) {
        Main.blockWarning.classList.remove('dn');
        Main.blockWarning.classList.add('flex');
      }
    });

    if ((navigator.brave && (await navigator.brave.isBrave())) || false) {
      Main.blockWarning.classList.remove('dn');
      Main.blockWarning.classList.add('flex');
    }
  },

  render() {
    Audio.setContext();
    Effects.render();
    Instrument.render();
    Envelope.render();
    Audio.setInstruments();
    Audio.setEffects();
    Asteroid.render();
    Sequencer.render();
    Tooltips.render();
    Main.handleAdBlock();

    setTimeout(() => {
      Main.main.classList.add('active');
    }, 300);
  }
};

export default Main;

/* eslint-enable */
