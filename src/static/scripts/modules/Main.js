/* eslint-disable new-cap, no-unused-vars */

import Sequencer from './Sequencer';
import Controls from './Controls';
import Signal from './Signal';
import Effects from './Effects';

const Main = {
  openEl: document.querySelector('#open'),
  hasOpened: false,

  init() {
    this.render();
  },

  render() {
    Effects.render();
    Signal.render();

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
