/* eslint-disable new-cap, no-unused-vars */
import Nexus from 'nexusui';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Signal from './Signal';
import Effects from './Effects';
import Audio from './Audio';
import Asteroid from './Asteroid';

const Main = {
  main: document.querySelector('main'),
  wrapper: document.querySelector('.wrapper'),

  init() {
    this.render();
  },

  render() {
    Asteroid.render();
    Audio.setContext();
    Effects.render();
    Signal.render();
    Audio.setInstruments();
    Audio.setEffects();

    setTimeout(() => {
      Main.main.classList.add('active');
    }, 300);
  }
};

export default Main;

/* eslint-enable */
