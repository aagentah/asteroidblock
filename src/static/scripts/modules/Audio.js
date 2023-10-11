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
      latencyHint: 'playback',
      lookAhead: Audio.lookAhead,
      sampleRate: 8000
    });

    Tone.setContext(context);
  },

  updateTempo(v) {
    const minute = 60000;
    const tempo = v;
    const quarterNote = minute / tempo;
    const fullNote = quarterNote * 4;

    Audio.tempo = tempo;
    Audio.noteLength = fullNote;
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
  },

  play: async notes => {
    if (!Audio.audioCtx) {
      Audio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      Audio.unlockAudioContext(Audio.audioCtx);
    }

    if (!Audio.synth) {
      Audio.synth = new Tone.PolySynth();
    }

    let effectParams = {};
    let effect, param;

    for (let i = 0; i < Effects.data.length; i++) {
      effectParams = [];
      effect = Effects.data[i];

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        param = effect.paramaters[ii];
        effectParams[param.name] = param.value;
      }

      Audio.effect[effect.name].set({ ...effectParams });
    }

    const durationSecs = Audio.noteLength / 1000;
    const attackSecs = (Envelope.envAttack / 1) * Envelope.envHold;
    const holdSecs = Envelope.envHold;
    const releaseSecs = (Envelope.envRelease / 1) * Envelope.envHold;
    const envelope = { attack: attackSecs, release: releaseSecs };
    const attackRelease = attackSecs + holdSecs + releaseSecs;

    if (!Audio.synth.isConnected) {
      Audio.synth.chain(
        ..._.values(Audio.effect),
        Tone.getContext().destination
      );
    }

    Audio.synth.set({ envelope });
    Audio.synth.triggerAttackRelease(notes, attackRelease);
  }
};

export default Audio;

/* eslint-enable */
