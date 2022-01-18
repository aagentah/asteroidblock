/* eslint-disable new-cap, no-unused-vars */
import { detectAnyAdblocker } from 'just-detect-adblock';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Signal from './Signal';
import Effects from './Effects';
import Audio from './Audio';
import Asteroid from './Asteroid';

const Main = {
  main: document.querySelector('main'),
  wrapper: document.querySelector('.wrapper'),
  blockWarning: document.querySelector('.blockWarning'),

  init() {
    this.render();
  },

  render() {
    Audio.setContext();
    Effects.render();
    Signal.render();
    Audio.setInstruments();
    Audio.setEffects();
    Asteroid.render();
    Sequencer.renderSequence();

    detectAnyAdblocker().then(detected => {
      if (detected) {
        Main.blockWarning.classList.remove('dn');
        Main.blockWarning.classList.add('flex');
      }
    });

    const checkBrave = async () => {
      if ((navigator.brave && (await navigator.brave.isBrave())) || false) {
        Main.blockWarning.classList.remove('dn');
        Main.blockWarning.classList.add('flex');
      }
    };

    checkBrave();

    setTimeout(() => {
      Main.main.classList.add('active');
    }, 300);
  }
};

export default Main;

/* eslint-enable */
