/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Audio from './Audio';
import Sequencer from './Sequencer';
import Record from './Record';

const Controls = {
  startEl: document.querySelector('#start'),
  stopEl: document.querySelector('#stop'),
  recordEl: document.querySelector('#record'),
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
    Sequencer.interval.ms(Controls.noteLength);
  },

  playControls: async () => {
    if (Sequencer.isRunning) {
      return;
    }

    await Tone.start();
    Nexus.context.resume();
    Sequencer.isRunning = true;
    Sequencer.interval.start();
  },

  recordControls: async () => {
    if (Sequencer.isRunning) {
      return;
    }

    const fulltime = Controls.noteLength * 8;

    const increaseVal = progressBar => {
      if (progressBar.value < 100) {
        progressBar.value = progressBar.value + 1;
      } else {
        progressBar.value = 0;
        clearInterval(progressBar.interval);
      }
    };

    const progressBars = document.getElementsByClassName('progress');
    for (let i = 0; i < progressBars.length; i++) {
      //call increaseVal function and wait 50ms before each call
      //the third argument is the argument that i want to pass to the increaseVal function
      //read https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
      progressBars[i].interval = setInterval(
        increaseVal,
        fulltime / 100,
        progressBars[i]
      );
    }

    const recorder = new Tone.Recorder();
    Tone.getContext().destination.connect(recorder);
    recorder.start();
    Controls.playControls();
    Record.init(recorder);
  },

  stopControls() {
    if (!Sequencer.isRunning) {
      return;
    }

    Sequencer.isRunning = false;
    Sequencer.interval.stop();

    for (let i = 0; i < 10; i++) {
      if (Sequencer.sequencer.stepper.value !== 0) Sequencer.sequencer.next();
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
      size: [120, 30],
      value: Controls.tempo,
      min: 30,
      max: 1000,
      step: 1
    });

    number.colorize('accent', '#505483');
    number.colorize('fill', '#d8dada');

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

    Controls.recordEl.addEventListener(
      'click',
      () => Controls.recordControls(),
      false
    );
  }
};

export default Controls;

/* eslint-enable */
