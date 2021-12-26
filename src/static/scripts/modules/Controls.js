/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Audio from './Audio';
import Sequencer from './Sequencer';

const Controls = {
  startEl: document.querySelector('#start'),
  stopEl: document.querySelector('#stop'),
  resetEl: document.querySelector('#reset'),
  tempo: 120,
  noteLength: 2000, // 120 BPM

  updateTempo(v) {
    const minute = 60000;
    const tempo = v;
    const quarterNote = minute / tempo;
    const fullNote = quarterNote * 4;

    Controls.tempo = tempo;
    Controls.noteLength = fullNote;

    if (Sequencer.isRunning) {
      Sequencer.sequencer.start(Controls.noteLength);
    }
  },

  playControls: async () => {
    if (Sequencer.isRunning) {
      return;
    }

    await Tone.start();
    Nexus.context.resume();
    Sequencer.isRunning = true;
    Sequencer.sequencer.start(Controls.noteLength);
  },

  stopControls() {
    if (!Sequencer.isRunning) {
      return;
    }

    Sequencer.isRunning = false;
    Sequencer.sequencer.stop();

    for (let i = 0; i < 10; i++) {
      if (Sequencer.sequencer.stepper.value !== 0) {
        Sequencer.sequencer.next();
      }
    }
  },

  resetControls() {
    const emptySequence = [];
    let emptyRow = [];

    for (let i = 0; i < Controls.rows; i++) {
      emptyRow = [];

      for (let ii = 0; ii < Controls.columns; ii++) {
        emptyRow.push(0);
      }

      emptySequence.push(emptyRow);
    }

    Sequencer.sequencer.matrix.set.all(emptySequence);
  },

  renderControls() {
    const number = new Nexus.Number('#tempo', {
      size: [60, 30],
      value: Controls.tempo,
      min: 30,
      max: 200,
      step: 1
    });

    number.on('change', v => {
      Controls.updateTempo(v);
    });

    Controls.startEl.addEventListener(
      'click',
      () => Controls.playControls(),
      false
    );
    Controls.stopEl.addEventListener(
      'click',
      () => Controls.stopControls(),
      false
    );
    Controls.resetEl.addEventListener(
      'click',
      () => Controls.resetControls(),
      false
    );
  },

  renderNotes() {
    let notesItems = '';

    for (let i = 0; i < Controls.notes.length; i++) {
      notesItems += `<div style='height: 50px;'>${Controls.notes[i]}</div>`;
    }

    Controls.notesEl.insertAdjacentHTML('beforeend', notesItems);
  },

  renderSequence() {
    Sequencer.sequencer = new Nexus.Controls('#sequencer', {
      size: [Sequencer.sequencerWrapperEl.offsetWidth, 400],
      mode: 'toggle',
      rows: Controls.rows,
      columns: Controls.columns,
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
        if (arr[i] === 1) activeInStep.push(Controls.notes[i]);
      }

      if (activeInStep.length) Audio.play(activeInStep);
    });
  },

  render() {
    Controls.openEl.addEventListener(
      'click',
      () => {
        if (Controls.hasOpened) {
          return;
        }

        Controls.renderNotes();
        Controls.renderSequence();
        Controls.renderControls();

        Controls.hasOpened = true;
      },
      false
    );
  }
};

export default Controls;

/* eslint-enable */
