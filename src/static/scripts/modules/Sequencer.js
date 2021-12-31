/* eslint-disable new-cap, no-unused-vars */

import * as Tone from 'tone';
import Nexus from 'nexusui';
import _ from 'lodash';

import Audio from './Audio';
import Controls from './Controls';

const Sequencer = {
  notesEl: document.querySelector('#notes'),
  sequencerWrapperEl: document.querySelector('.sequencer__wrapper'),
  notes: ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C'],
  octaves: 7,
  rows: null,
  isRunning: false,
  sequencer: null,
  columns: 8,
  interval: null,
  currentColumn: 0,

  renderNotes() {
    let octave;
    let notesItems = '';

    for (let i = 0; i < Sequencer.octaves; i++) {
      octave = i;

      for (let ii = 0; ii < Sequencer.notes.length; ii++) {
        if (ii === 11) {
          notesItems += `<div class="notes__item" style='height: 48px; border-bottom: 1px solid red;'>${
            Sequencer.notes[ii]
          }${octave + 1}</div>`;
        } else {
          notesItems += `<div class="notes__item" style='height: 48px;'>${
            Sequencer.notes[ii]
          }${octave + 1}</div>`;
        }
      }
    }

    Sequencer.notesEl.insertAdjacentHTML('beforeend', notesItems);
  },

  renderSequence() {
    Sequencer.rows = Sequencer.notes.length * Sequencer.octaves;

    Sequencer.sequencer = new Nexus.Sequencer('#sequencer', {
      size: [Sequencer.sequencerWrapperEl.offsetWidth, Sequencer.rows * 48],
      mode: 'toggle',
      rows: Sequencer.rows,
      columns: Sequencer.columns,
      paddingRow: 0,
      paddingColumn: 0
    });

    const handleStep = matrix => {
      if (!Sequencer.isRunning) {
        return;
      }

      const activeInStep = [];
      let octave;
      let key;
      let multitude;

      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i] === 1) {
          octave = Math.floor(i / 12);
          multitude = octave * 12;
          key = i - multitude;

          activeInStep.push(`${Sequencer.notes[key]}${octave + 1}`);
        }
      }

      if (activeInStep.length) Audio.play(activeInStep);
    };

    Sequencer.interval = new Nexus.Interval(Controls.noteLength, () => {
      const matrix = [];

      for (let i = 0; i < Sequencer.sequencer.matrix.pattern.length; i++) {
        const row = Sequencer.sequencer.matrix.pattern[i];
        const column = row[Sequencer.currentColumn];
        const item = column ? 1 : 0;

        matrix.push(item);
      }

      handleStep(matrix);

      if (Sequencer.currentColumn === Sequencer.columns - 1) {
        Sequencer.currentColumn = 0;
      } else {
        Sequencer.currentColumn = Sequencer.currentColumn + 1;
      }

      setTimeout(() => {
        Sequencer.sequencer.next();
      }, Audio.lookAhead * 1000);
    });
  }
};

export default Sequencer;

/* eslint-enable */
