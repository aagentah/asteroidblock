/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Audio from './Audio';
import Sequencer from './Sequencer';
import Record from './Record';

import { isMobile } from '../utils/isMobile';

const Controls = {
  startEl: document.querySelector('#play'),
  stopEl: document.querySelector('#stop'),
  recordEl: document.querySelector('#record'),
  resetEl: document.querySelector('#reset'),
  sequencer: document.querySelector('.sequencer__notes__wrapper'),
  effectsToggle: document.querySelectorAll('.effects-toggle'),
  effectsWrapper: document.querySelector('.effects__fx'),
  envelopeToggle: document.querySelectorAll('.envelope-toggle'),
  envelopeWrapper: document.querySelector('.effects__envelope'),

  playControls: async () => {
    if (Sequencer.isRunning) {
      return;
    }

    await Tone.start();
    Nexus.context.resume();
    Sequencer.isRunning = true;
    Sequencer.restartInterval();
    Controls.recordEl.classList.add('disabled');
    Controls.startEl.classList.add('disabled');
  },

  recordControls: async () => {
    if (Sequencer.isRunning) {
      return;
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
    Sequencer.destroyInterval();
    Controls.recordEl.classList.remove('disabled');
    Controls.startEl.classList.remove('disabled');

    for (let i = 0; i < 10; i++) {
      if (Sequencer.sequencer.stepper.value !== 0) Sequencer.sequencer.next();
    }

    Sequencer.currentColumn = 0;
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
    const tempoHeight = isMobile() ? 20 : 30;

    const number = new Nexus.Number('#tempo', {
      size: [120, tempoHeight],
      value: Audio.tempo,
      min: 30,
      max: 300,
      step: 1
    });

    number.colorize('accent', '#505483');
    number.colorize('fill', '#d8dada');

    number.on('change', v => {
      Audio.updateTempo(v);
    });

    Controls.startEl.addEventListener(
      'click',
      () => {
        if (Tone.context.state !== 'running') Tone.context.resume();
        Controls.playControls();
      },
      false
    );

    Controls.stopEl.addEventListener(
      'click',
      () => Controls.stopControls(),
      false
    );

    document.body.onkeyup = e => {
      if (e.keyCode == 32) {
        e.preventDefault();

        if (Sequencer.isRunning) {
          Controls.stopControls();
        } else {
          Controls.playControls();
        }
      }
    };

    Controls.resetEl.addEventListener(
      'click',
      () => Controls.resetControls(),
      false
    );

    Controls.recordEl.addEventListener(
      'click',
      () => {
        if (Tone.context.state !== 'running') Tone.context.resume();
        Controls.recordControls();
      },
      false
    );

    for (let i = 0; i < Controls.effectsToggle.length; i++) {
      Controls.effectsToggle[i].addEventListener(
        'click',
        () => {
          Controls.effectsWrapper.classList.toggle('active');
        },
        false
      );
    }

    for (let i = 0; i < Controls.envelopeToggle.length; i++) {
      Controls.envelopeToggle[i].addEventListener(
        'click',
        () => {
          Controls.envelopeWrapper.classList.toggle('active');
        },
        false
      );
    }
  }
};

export default Controls;

/* eslint-enable */
