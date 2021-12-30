/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import _ from 'lodash';

import Audio from './Audio';
import Controls from './Controls';

const Sequencer = {
  notesEl: document.querySelector('#notes'),
  sequencerWrapperEl: document.querySelector('.sequencer__wrapper'),
  notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  octaves: 7,
  isRunning: false,
  sequencer: null,
  columns: 8,

  renderNotes() {
    let octave;
    let notesItems = '';

    for (let i = 0; i < Sequencer.octaves; i++) {
      octave = i;

      for (let ii = 0; ii < Sequencer.notes.length; ii++) {
        notesItems += `<div style='height: 50px;'>${
          Sequencer.notes[ii]
        }${octave + 1}</div>`;
      }
    }

    Sequencer.notesEl.insertAdjacentHTML('beforeend', notesItems);
  },

  renderSequence() {
    Sequencer.sequencer = new Nexus.Sequencer('#sequencer', {
      size: [Sequencer.sequencerWrapperEl.offsetWidth, 4200],
      mode: 'toggle',
      rows: Sequencer.notes.length * Sequencer.octaves,
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
      let octave;
      let key;
      let multitude;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 1) {
          octave = Math.floor(i / 12);
          multitude = octave * 12;
          key = i - multitude;

          activeInStep.push(`${Sequencer.notes[key]}${octave + 1}`);
        }
      }

      if (activeInStep.length) Audio.play(activeInStep);
    });
  }
};

export default Sequencer;

/* eslint-enable */
