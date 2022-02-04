/* eslint-disable new-cap, no-unused-vars */
import { detectAnyAdblocker } from 'just-detect-adblock';
import tippy from 'tippy.js';

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
  tippyShown: [],

  init() {
    this.render();
  },

  render() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const controlsWrapper = document.querySelector('.controls__wrapper');
      const slideUpTriggers = document.querySelector(
        '.slide-up-triggers__wrapper'
      );

      const takenRoom =
        controlsWrapper.offsetHeight + slideUpTriggers.offsetHeight;

      const freeRoom = window.screen.availHeight - takenRoom - 220;

      Controls.sequencer.style.height = `${freeRoom}px`;
    }

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

    window.addEventListener(
      'orientationchange',
      () => {
        window.location.reload();
      },
      false
    );

    tippy('#record', {
      content: 'Plays & records the sequence to wav file!',
      delay: [300],
      onShow(instance) {
        if (Main.tippyShown.includes(instance.id)) return false;
        Main.tippyShown.push(instance.id);
      }
    });

    tippy('#start', {
      content: 'You can use spacebar to start/stop',
      delay: [300],
      onShow(instance) {
        if (Main.tippyShown.includes(instance.id)) return false;
        Main.tippyShown.push(instance.id);
      }
    });
  }
};

export default Main;

/* eslint-enable */
