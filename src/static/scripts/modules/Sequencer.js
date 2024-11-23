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
  currentColumn: 0,

  parseMatrix(matrix) {
    Sequencer.sequencer.matrix.set.all(matrix);
  },

  renderNotes() {
    let octave;
    let notesItems = '';

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

  setupTransport() {
    // Clear any existing transport events
    Tone.Transport.cancel();

    // Set transport tempo based on Audio settings
    Tone.Transport.bpm.value = Audio.tempo;

    // Create a repeating event every half note (2n)
    // This means each step is a quarter note, which at 120bpm = 500ms per step
    const repeat = time => {
      const matrix = [];

      // Get current column's notes
      for (let i = 0; i < Sequencer.sequencer.matrix.pattern.length; i++) {
        const row = Sequencer.sequencer.matrix.pattern[i];
        const column = row[Sequencer.currentColumn];
        matrix.push(column ? 1 : 0);
      }

      // Find active notes
      const activeNotes = [];
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i] === 1) {
          const octave = Math.floor(i / 12);
          const key = i - octave * 12;
          activeNotes.push(
            `${Sequencer.notes[key]}${Sequencer.octaves - (octave + 1)}`
          );
        }
      }

      // Play active notes
      if (activeNotes.length > 0) {
        Audio.play(activeNotes, time);
      }

      // Advance visual sequencer on the next frame
      Tone.Draw.schedule(() => {
        Sequencer.sequencer.next();
      }, time);

      // Update column counter
      Sequencer.currentColumn =
        (Sequencer.currentColumn + 1) % Sequencer.columns;
    };

    // Schedule the repeat function - '2n' means half note
    // Since we have 8 columns, each step should be a quarter note (half of a half note)
    // This gives us the standard timing where each step is a quarter note
    Tone.Transport.scheduleRepeat(repeat, '2n');
  },

  startTransport() {
    Sequencer.isRunning = true;
    // Reset column counter when starting
    Sequencer.currentColumn = 0;
    Tone.Transport.start();
  },

  stopTransport() {
    Sequencer.isRunning = false;
    Tone.Transport.stop();
    Sequencer.currentColumn = 0;

    // Reset visual sequencer position
    for (let i = 0; i < 10; i++) {
      if (Sequencer.sequencer.stepper.value !== 0) {
        Sequencer.sequencer.next();
      }
    }
  },

  render() {
    if (isMobile()) {
      const controlsWrapper = document.querySelector('.controls__wrapper');
      const slideUpTriggers = document.querySelector(
        '.slide-up-triggers__wrapper'
      );
      const takenRoom =
        controlsWrapper.offsetHeight + slideUpTriggers.offsetHeight;
      const freeRoom = window.screen.availHeight - takenRoom - 350;
      Controls.sequencer.style.height = `${freeRoom}px`;
    }

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

    Sequencer.sequencer.colorize('accent', '#990000');
    Sequencer.sequencer.colorize('fill', '#171717');
    Sequencer.sequencer.colorize('mediumLight', '#990000');

    // Initialize the transport timing
    Sequencer.setupTransport();

    // Sets initial scroll position
    Sequencer.elem.scrollTop += Sequencer.elem.offsetHeight * 2;
  }
};

export default Sequencer;
