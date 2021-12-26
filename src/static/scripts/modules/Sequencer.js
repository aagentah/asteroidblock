/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Audio from './Audio';

const Sequencer = {
  openEl: document.querySelector('#open'),
  startEl: document.querySelector('#start'),
  stopEl: document.querySelector('#stop'),
  resetEl: document.querySelector('#reset'),
  notesEl: document.querySelector('#notes'),
  controlsEl: document.querySelector('#controls'),
  sequencerWrapperEl: document.querySelector('.sequencer__wrapper'),
  notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  hasOpened: false,
  isRunning: false,
  sequencer: null,
  columns: 8,
  rows: 8,
  tempo: 120,
  noteLength: 2000, // 120 BPM

  updateTempo(v) {
    const minute = 60000;
    const tempo = v;
    const quarterNote = minute / tempo;
    const fullNote = quarterNote * 4;

    Sequencer.tempo = tempo;
    Sequencer.noteLength = fullNote;

    if (Sequencer.isRunning) {
      Sequencer.sequencer.start(Sequencer.noteLength);
    }
  },

  playSequencer: async () => {
    if (Sequencer.isRunning) {
      return;
    }

    await Tone.start();
    Nexus.context.resume();
    Sequencer.isRunning = true;
    Sequencer.sequencer.start(Sequencer.noteLength);
  },

  stopSequencer() {
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

  resetSequencer() {
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
      value: Sequencer.tempo,
      min: 30,
      max: 200,
      step: 1
    });

    number.on('change', v => {
      Sequencer.updateTempo(v);
    });

    Sequencer.startEl.addEventListener(
      'click',
      () => Sequencer.playSequencer(),
      false
    );
    Sequencer.stopEl.addEventListener(
      'click',
      () => Sequencer.stopSequencer(),
      false
    );
    Sequencer.resetEl.addEventListener(
      'click',
      () => Sequencer.resetSequencer(),
      false
    );
  },

  renderNotes() {
    let notesItems = '';

    for (let i = 0; i < Sequencer.notes.length; i++) {
      notesItems += `<div style='height: 50px;'>${Sequencer.notes[i]}</div>`;
    }

    Sequencer.notesEl.insertAdjacentHTML('beforeend', notesItems);
  },

  renderSequence() {
    Sequencer.sequencer = new Nexus.Sequencer('#sequencer', {
      size: [Sequencer.sequencerWrapperEl.offsetWidth, 400],
      mode: 'toggle',
      rows: Sequencer.rows,
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

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 1) activeInStep.push(Sequencer.notes[i]);
      }

      if (activeInStep.length) Audio.play(activeInStep);
    });
  },

  render() {
    Sequencer.openEl.addEventListener(
      'click',
      () => {
        if (Sequencer.hasOpened) {
          return;
        }

        Sequencer.renderNotes();
        Sequencer.renderSequence();
        Sequencer.renderControls();

        Sequencer.hasOpened = true;
      },
      false
    );
  }
};

export default Sequencer;

/* eslint-enable */
