/* eslint-disable new-cap, no-unused-vars */

import * as Tone from 'tone';
import Nexus from 'nexusui';
import _ from 'lodash';

import Audio from './Audio';
import Controls from './Controls';

import { isMobile } from '../utils/isMobile';

const Sequencer = {
  elem: document.querySelector('.sequencer__notes__wrapper'),
  notesEl: document.querySelector('#notes'),
  sequencerWrapperEl: document.querySelector('.sequencer__wrapper'),
  notes: ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C'],
  octaves: 5,
  rows: null,
  isRunning: false,
  sequencer: null,
  columns: 8,
  interval: null,
  currentColumn: 0,

  parseMatrix(matrix) {
    Sequencer.sequencer.matrix.set.all(matrix);
  },

  renderNotes() {
    let octave;
    let notesItems = '';

    if (isMobile()) {
      const controlsWrapper = document.querySelector('.controls__wrapper');
      const slideUpTriggers = document.querySelector(
        '.slide-up-triggers__wrapper'
      );

      const takenRoom =
        controlsWrapper.offsetHeight + slideUpTriggers.offsetHeight;

      const freeRoom = window.screen.availHeight - takenRoom - 220;

      Controls.sequencer.style.height = `${freeRoom}px`;
    }

    const offsetHeight = Sequencer.elem.offsetHeight / 12;

    for (let i = Sequencer.octaves - 1; i >= 0; i--) {
      // for (let i = 0; i < Sequencer.octaves; i++) {
      octave = i;

      for (let ii = 0; ii < Sequencer.notes.length; ii++) {
        if (ii === 11) {
          notesItems += `<div class="notes__item" style='height: ${offsetHeight}px;'>${
            Sequencer.notes[ii]
          }${octave + 1}</div>
          <div class="notes__item__octave" style="width: ${
            Sequencer.sequencerWrapperEl.offsetWidth
          }px"></div>
          `;
        } else {
          notesItems += `<div class="notes__item" style='height: ${offsetHeight}px;'>${
            Sequencer.notes[ii]
          }${octave + 1}</div>`;
        }
      }
    }

    Sequencer.notesEl.insertAdjacentHTML('beforeend', notesItems);
  },

  render() {
    const offsetHeight = Sequencer.elem.offsetHeight / 12;

    Sequencer.rows = Sequencer.notes.length * Sequencer.octaves;

    Sequencer.sequencer = new Nexus.Sequencer('#sequencer', {
      size: [
        Sequencer.sequencerWrapperEl.offsetWidth,
        Sequencer.rows * offsetHeight
      ],
      mode: 'toggle',
      rows: Sequencer.rows,
      columns: Sequencer.columns,
      paddingRow: 0,
      paddingColumn: 0
    });

    Sequencer.sequencer.colorize('accent', '#505483');
    Sequencer.sequencer.colorize('fill', '#b5b7c9');
    Sequencer.sequencer.colorize('mediumLight', '#61669e');

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

          activeInStep.push(
            `${Sequencer.notes[key]}${Sequencer.octaves - (octave + 1)}`
          );
        }
      }

      if (activeInStep.length) Audio.play(activeInStep);
    };

    var myFunction = function() {
      if (!Sequencer.isRunning) {
        return window.setTimeout(myFunction, Audio.noteLength);
      }

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
        if (Sequencer.isRunning) Sequencer.sequencer.next();
      }, Audio.lookAhead * 1000 + Audio.noteLength);

      window.setTimeout(myFunction, Audio.noteLength);
    };

    window.setTimeout(myFunction, Audio.noteLength);

    // Sequencer.interval = new Nexus.Interval(Audio.noteLength, () => {
    //
    // });

    Sequencer.sequencer.next();
  }
};

export default Sequencer;

/* eslint-enable */
