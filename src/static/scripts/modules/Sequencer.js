/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import _ from 'lodash';

import Audio from './Audio';
import Controls from './Controls';

const Sequencer = {
  notesEl: document.querySelector('#notes'),
  sequencerWrapperEl: document.querySelector('.sequencer__wrapper'),
  notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  isRunning: false,
  sequencer: null,
  columns: 8,
  rows: 8,

  renderNotes() {
    let notesItems = '';

    for (let i = 0; i < Sequencer.notes.length; i++) {
      notesItems += `<div style='height: 50px;'>${Sequencer.notes[i]}</div>`;
    }

    Sequencer.notesEl.insertAdjacentHTML('beforeend', notesItems);
  },

  renderSequence() {
    Sequencer.sequencer = new Nexus.Sequencer('#sequencer', {
      size: [Sequencer.sequencerWrapperEl.offsetWidth, 400],
      mode: 'toggle',
      rows: Sequencer.rows,
      columns: Sequencer.columns,
      paddingRow: 0,
      paddingColumn: 0
    });

    Sequencer.sequencer.on('step', v => {
      if (!Sequencer.isRunning) {
        return;
      }

      const arr = _.reverse(v);
      const activeInStep = [];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 1) activeInStep.push(Sequencer.notes[i]);
      }

      if (activeInStep.length) Audio.play(activeInStep);
    });
  }
};

export default Sequencer;

/* eslint-enable */
