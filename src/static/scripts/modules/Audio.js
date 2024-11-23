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
  noteLength: 4000, // 120 BPM
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
    const tempo = v;
    Audio.tempo = tempo;
    // Calculate quarter note length in milliseconds
    Audio.noteLength = (60 / tempo) * 1000;
    // Update Transport tempo
    Tone.Transport.bpm.value = tempo;
  },

  createSynth() {
    // Dispose of the old synth if it exists
    if (Audio.synth) {
      Audio.synth.dispose();
    }

    // Create new synth with current instrument type
    Audio.synth = new Tone.PolySynth(Tone[Instrument.currentInstrument], {
      envelope: {
        attack: 2.0, // 2 second attack
        decay: 1.5, // 1.5 second decay
        sustain: 0.8, // 80% sustain level
        release: 3.0 // 3 second release
      }
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

    // Calculate envelope timings based on tempo
    const quarterNote = 60 / Audio.tempo; // Duration of quarter note in seconds
    const attackSecs = 2.0; // Fixed 2 second attack
    const decaySecs = 1.5; // Fixed 1.5 second decay
    const releaseSecs = 3.0; // Fixed 3 second release

    // Calculate total note duration (much longer than step duration)
    const totalNoteDuration = attackSecs + decaySecs + releaseSecs;

    // Update synth envelope
    Audio.synth.set({
      envelope: {
        attack: attackSecs,
        decay: decaySecs,
        sustain: 0.8,
        release: releaseSecs
      }
    });

    // Get current time from Tone.js
    const now = Tone.now();

    // Release notes that are no longer in the current step
    const currentNotes = new Set(notes);
    Audio.activeNotes.forEach((releaseTime, note) => {
      if (!currentNotes.has(note)) {
        Audio.synth.triggerRelease(note, time);
        Audio.activeNotes.delete(note);
      }
    });

    // Play new notes with extended duration
    notes.forEach(note => {
      // Only trigger if note isn't already playing
      if (!Audio.activeNotes.has(note)) {
        // Calculate when this note should finish (well after the step duration)
        const releaseTime = time + totalNoteDuration;

        // Start the note
        Audio.synth.triggerAttack(note, time);
        Audio.activeNotes.set(note, releaseTime);

        // Schedule the release
        Tone.Transport.schedule(t => {
          // Only release if the note isn't being held by a subsequent step
          if (Audio.activeNotes.get(note) === releaseTime) {
            Audio.synth.triggerRelease(note, t);
            Audio.activeNotes.delete(note);
          }
        }, releaseTime);
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
