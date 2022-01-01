/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Controls from './Controls';
import Effects from './Effects';
import Signal from './Signal';

const Audio = {
  lookAhead: 0.5,
  instruments: {},
  effect: {},

  setContext() {
    const context = new Tone.Context({
      latencyHint: 'playback',
      lookAhead: Audio.lookAhead,
      sampleRate: 8000
    });

    Tone.setContext(context);
  },

  setInstruments() {
    let instrument;

    for (let i = 0; i < Signal.instrumentTypes.length; i++) {
      instrument = Signal.instrumentTypes[i];
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

  play: async notes => {
    let effectParams = {};
    let effect, param;

    // Tweaks all Tone Effects based on Effects.js data object
    for (let i = 0; i < Effects.data.length; i++) {
      effectParams = [];
      effect = Effects.data[i];

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        param = effect.paramaters[ii];
        effectParams[param.name] = param.value;
      }

      console.log('effectParams', effectParams);

      Audio.effect[effect.name].set({ ...effectParams });
    }

    // Play tone
    const synth = new Tone.PolySynth(
      Audio.instruments[Signal.currentInstrument]
    );
    const durationSecs = Controls.noteLength / 1000;
    const divideBy = (divide, by) => divide / by;
    const attackSecs = divideBy(Signal.envAttack, 1) * Signal.envHold;
    const holdSecs = Signal.envHold;
    const releaseSecs = divideBy(Signal.envRelease, 1) * Signal.envHold;
    const envelope = { attack: attackSecs, release: releaseSecs };
    const attackRelease = attackSecs + holdSecs + releaseSecs;

    synth.chain(..._.values(Audio.effect), Tone.getContext().destination);
    synth.set({ envelope });
    synth.triggerAttackRelease(notes, attackRelease);

    // Clean up
    setTimeout(() => {
      synth.disconnect();
      synth.dispose();
    }, (attackRelease + releaseSecs) * 1000 + Audio.lookAhead * 1000);
  }
};

export default Audio;

/* eslint-enable */
