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

    try {
      // Start audio context
      await Tone.start();
      Nexus.context.resume();

      // Start transport-based sequencer
      Sequencer.startTransport();

      // Update UI
      Controls.recordEl.classList.add('disabled');
      Controls.startEl.classList.add('disabled');
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  },

  recordControls: async () => {
    if (Sequencer.isRunning) {
      return;
    }

    try {
      const recorder = new Tone.Recorder();

      // Connect recorder to main output
      Tone.getContext().destination.connect(recorder);
      recorder.start();

      // Start playback with transport
      await Controls.playControls();
      Record.init(recorder);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  },

  stopControls() {
    if (!Sequencer.isRunning) {
      return;
    }

    // Stop transport-based sequencer
    Sequencer.stopTransport();

    // Update UI
    Controls.recordEl.classList.remove('disabled');
    Controls.startEl.classList.remove('disabled');
  },

  resetControls() {
    const emptySequence = [];
    let emptyRow = [];

    // Create empty sequence matrix
    for (let i = 0; i < Sequencer.rows; i++) {
      emptyRow = [];
      for (let ii = 0; ii < Sequencer.columns; ii++) {
        emptyRow.push(0);
      }
      emptySequence.push(emptyRow);
    }

    // Reset sequencer state
    Sequencer.sequencer.matrix.set.all(emptySequence);

    // Ensure transport is stopped and reset
    if (Sequencer.isRunning) {
      Controls.stopControls();
    }
    Tone.Transport.position = 0;
  },

  renderControls() {
    const tempoHeight = isMobile() ? 20 : 30;

    // Create tempo control
    const number = new Nexus.Number('#tempo', {
      size: [120, tempoHeight],
      value: Audio.tempo,
      min: 30,
      max: 300,
      step: 1
    });

    number.colorize('accent', '#505483');
    number.colorize('fill', '#d8dada');

    // Handle tempo changes
    number.on('change', v => {
      Audio.updateTempo(v);
    });

    // Play button handler
    Controls.startEl.addEventListener(
      'click',
      () => {
        if (Tone.context.state !== 'running') {
          Tone.context.resume();
        }
        Controls.playControls();
      },
      false
    );

    // Stop button handler
    Controls.stopEl.addEventListener(
      'click',
      () => Controls.stopControls(),
      false
    );

    // Spacebar handler
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

    // Reset button handler
    Controls.resetEl.addEventListener(
      'click',
      () => Controls.resetControls(),
      false
    );

    // Record button handler
    Controls.recordEl.addEventListener(
      'click',
      () => {
        if (Tone.context.state !== 'running') {
          Tone.context.resume();
        }
        Controls.recordControls();
      },
      false
    );

    // Effects toggle handlers
    for (let i = 0; i < Controls.effectsToggle.length; i++) {
      Controls.effectsToggle[i].addEventListener(
        'click',
        () => {
          Controls.effectsWrapper.classList.toggle('active');
        },
        false
      );
    }

    // Envelope toggle handlers
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
