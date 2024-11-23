/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Controls from './Controls';
import Effects from './Effects';
import Instrument from './Instrument';
import Envelope from './Envelope';

const Audio = {
  lookAhead: 0.5,
  instruments: {},
  effect: {},
  noteLength: 2000, // 120 BPM
  tempo: 120,
  audioCtx: null, // Initialized to null
  synth: null, // Initialized to null

  setContext() {
    const context = new Tone.Context({
      latencyHint: 'interactive',
      lookAhead: Audio.lookAhead,
      updateInterval: 1 / 60
    });

    Tone.setContext(context);
    // Set initial Transport tempo
    Tone.Transport.bpm.value = Audio.tempo;
  },

  updateTempo(v) {
    const tempo = v;
    Audio.tempo = tempo;
    // Calculate quarter note length in milliseconds
    Audio.noteLength = (60 / tempo) * 1000;
    // Update Transport tempo
    Tone.Transport.bpm.value = tempo;
  },

  play(notes, time) {
    if (!Audio.synth) {
      Audio.synth = new Tone.PolySynth(Tone[Instrument.currentInstrument]);
      Audio.synth.chain(
        ..._.values(Audio.effect),
        Tone.getContext().destination
      );
    }

    // Update effect parameters
    _.forEach(Effects.data, (effect, i) => {
      const effectParams = {};
      effect.paramaters.forEach(param => {
        effectParams[param.name] = param.value;
      });
      Audio.effect[effect.name].set(effectParams);
    });

    // Calculate envelope timings based on tempo
    const quarterNote = 60 / Audio.tempo; // Duration of quarter note in seconds
    const attackSecs =
      (Envelope.envAttack / 1) * Envelope.envHold * quarterNote;
    const holdSecs = Envelope.envHold * quarterNote;
    const releaseSecs =
      (Envelope.envRelease / 1) * Envelope.envHold * quarterNote;

    // Update synth envelope
    Audio.synth.set({
      envelope: {
        attack: attackSecs,
        release: releaseSecs
      }
    });

    // Play the notes for one quarter note duration
    Audio.synth.triggerAttackRelease(notes, quarterNote, time);
  },

  setInstruments() {
    let instrument;

    for (let i = 0; i < Instrument.instrumentTypes.length; i++) {
      instrument = Instrument.instrumentTypes[i];
      Audio.instruments[instrument] = Tone[instrument];
    }
  },

  setEffects() {
    let effects = [];
    let effectParams = {};
    let effect, param;

    // Creates all Tone Effects based on Effects.js data object
    for (let i = 0; i < Effects.data.length; i++) {
      effectParams = [];
      effect = Effects.data[i];

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        param = effect.paramaters[ii];
        effectParams[param.name] = param.value;
      }

      if (i === 0) {
        Audio.effect[effect.name] = new Tone[effect.name]({
          ...effectParams
        }).start();
      } else {
        Audio.effect[effect.name] = new Tone[effect.name]({
          ...effectParams
        });
      }
    }
  },

  unlockAudioContext(audioCtx) {
    if (audioCtx.state !== 'suspended') return;
    const b = document.body;
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    events.forEach(e => b.addEventListener(e, unlock, false));
    function unlock() {
      audioCtx.resume().then(clean);
    }
    function clean() {
      events.forEach(e => b.removeEventListener(e, unlock));
    }
  }
};

export default Audio;

/* eslint-enable */
