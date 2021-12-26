/* eslint-disable new-cap, no-unused-vars */

import Sequencer from './Sequencer';
import Controls from './Controls';

const Main = {
  openEl: document.querySelector('#open'),
  hasOpened: false,

  init() {
    this.render();
  },

  render() {
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
