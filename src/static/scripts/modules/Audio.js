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
  tempo: 60,
  audioCtx: null,
  synth: null,
  activeVoices: new Set(), // Track currently playing notes
  activeNotes: new Map(), // Track notes and their scheduled release times

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
    Audio.tempo = v;
    Tone.Transport.bpm.value = v;
  },

  createSynth() {
    // Dispose of the old synth if it exists
    if (Audio.synth) {
      Audio.synth.dispose();
    }

    // Create new synth with current instrument type
    Audio.synth = new Tone.PolySynth(Tone[Instrument.currentInstrument], {
      envelope: {
        attack: '2n',
        decay: '2n',
        sustain: 0.5,
        release: '2n'
      },
      // Add these specific settings for DuoSynth
      ...(Instrument.currentInstrument === 'DuoSynth'
        ? {
            volume: -8,
            voice0: { volume: -8 },
            voice1: { volume: -8 }
          }
        : {})
    });

    // Connect to effects chain
    Audio.synth.chain(..._.values(Audio.effect), Tone.getContext().destination);

    return Audio.synth;
  },

  play(notes, time) {
    // Create or recreate synth if instrument type changed
    if (
      !Audio.synth ||
      Audio.synth.name !== `poly${Instrument.currentInstrument}`
    ) {
      Audio.createSynth();
    }

    // Update effect parameters
    _.forEach(Effects.data, (effect, i) => {
      const effectParams = {};
      effect.paramaters.forEach(param => {
        effectParams[param.name] = param.value;
      });
      Audio.effect[effect.name].set(effectParams);
    });

    // Calculate envelope times based on current tempo
    // '8n' = eighth note duration at current tempo
    const attackTime = '2n'; // Very short attack
    const decayTime = '2n'; // Short decay
    const releaseTime = '2n'; // Moderate release

    // Update synth envelope using musical timing values
    Audio.synth.set({
      envelope: {
        attack: Tone.Time(attackTime).toSeconds(),
        decay: Tone.Time(decayTime).toSeconds(),
        sustain: 0.5,
        release: Tone.Time(releaseTime).toSeconds()
      }
    });

    // Release notes that are no longer in the current step
    const currentNotes = new Set(notes);
    Audio.activeNotes.forEach((releaseTime, note) => {
      if (!currentNotes.has(note)) {
        Audio.synth.triggerRelease(note, time);
        Audio.activeNotes.delete(note);
      }
    });

    // Play new notes
    notes.forEach(note => {
      // Only trigger if note isn't already playing
      if (!Audio.activeNotes.has(note)) {
        // Calculate step end time based on transport timing
        // '4n' = one quarter note duration
        const stepEndTime = time + Tone.Time('1n').toSeconds();

        // Start the note
        Audio.synth.triggerAttack(note, time);
        Audio.activeNotes.set(note, stepEndTime);

        // Schedule note release at end of step
        Tone.Transport.schedule(t => {
          if (Audio.activeNotes.get(note) === stepEndTime) {
            Audio.synth.triggerRelease(note, t);
            Audio.activeNotes.delete(note);
          }
        }, stepEndTime);
      }
    });
  },

  releaseAllVoices() {
    if (Audio.synth) {
      const now = Tone.now();
      Audio.synth.releaseAll(now);
      Audio.activeNotes.clear();
    }
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
