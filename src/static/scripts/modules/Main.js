/* eslint-disable new-cap, no-unused-vars */
import Nexus from 'nexusui';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Signal from './Signal';
import Effects from './Effects';
import Audio from './Audio';

const Main = {
  openEl: document.querySelector('#open'),
  hasOpened: false,

  init() {
    this.render();
  },

  render() {
    Audio.setContext();
    Effects.render();
    Signal.render();
    Audio.setInstruments();
    Audio.setEffects();

    Main.openEl.addEventListener(
      'click',
      () => {
        if (Main.hasOpened) {
          return;
        }

        Sequencer.renderNotes();
        Sequencer.renderSequence();
        Controls.renderControls();

        Main.hasOpened = true;
      },
      false
    );
  }
};

export default Main;

/* eslint-enable */
