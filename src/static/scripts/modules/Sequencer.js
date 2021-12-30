/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import _ from 'lodash';

import Audio from './Audio';
import Controls from './Controls';

const Sequencer = {
  notesEl: document.querySelector('#notes'),
  sequencerWrapperEl: document.querySelector('.sequencer__wrapper'),
  notes: ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C'],
  octaves: 7,
  isRunning: false,
  sequencer: null,
  columns: 8,
  interval: null,

  renderNotes() {
    let octave;
    let notesItems = '';

    for (let i = 0; i < Sequencer.octaves; i++) {
      octave = i;

      for (let ii = 0; ii < Sequencer.notes.length; ii++) {
        notesItems += `<div class="notes__item" style='height: 48px;'>${
          Sequencer.notes[ii]
        }${octave + 1}</div>`;
      }
    }

    Sequencer.notesEl.insertAdjacentHTML('beforeend', notesItems);
  },

  renderSequence() {
    const notesInt = Sequencer.notes.length * Sequencer.octaves;

    Sequencer.sequencer = new Nexus.Sequencer('#sequencer', {
      size: [Sequencer.sequencerWrapperEl.offsetWidth, notesInt * 48],
      mode: 'toggle',
      rows: notesInt,
      columns: Sequencer.columns,
      paddingRow: 0,
      paddingColumn: 0
    });

    Sequencer.interval = new Nexus.Interval(Controls.noteLength, () => {
      Sequencer.sequencer.next();
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
