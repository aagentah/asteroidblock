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

    for (let i = 0; i < Sequencer.rows; i++) {
      emptyRow = [];

      for (let ii = 0; ii < Sequencer.columns; ii++) {
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
  }
};

export default Controls;

/* eslint-enable */
