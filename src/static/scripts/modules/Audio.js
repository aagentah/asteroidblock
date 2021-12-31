/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Controls from './Controls';
import Effects from './Effects';
import Signal from './Signal';

const Audio = {
  lookAhead: 0.5,

  setContext() {
    const context = new Tone.Context({
      latencyHint: 'playback',
      lookAhead: Audio.lookAhead,
      sampleRate: 8000
    });

    Tone.setContext(context);
  },

  play: async notes => {
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
        effects.push(new Tone[effect.name]({ ...effectParams }).start());
      } else {
        effects.push(new Tone[effect.name]({ ...effectParams }));
      }
    }

    // Play tone
    const synth = new Tone.PolySynth(Tone[Signal.instrument]);
    const durationSecs = Controls.noteLength / 1000;
    const divideBy = (divide, by) => divide / by;
    const attackSecs = divideBy(Signal.envAttack, 1) * Signal.envHold;
    const holdSecs = Signal.envHold;
    const releaseSecs = divideBy(Signal.envRelease, 1) * Signal.envHold;
    const envelope = { attack: attackSecs, release: releaseSecs };
    const attackRelease = attackSecs + holdSecs + releaseSecs;

    synth.chain(...effects, Tone.getContext().destination);
    synth.set({ envelope: envelope });
    synth.triggerAttackRelease(notes, attackRelease);

    // Clean up
    setTimeout(() => {
      for (let i = 0; i < effects.length; i++) {
        effects[i].disconnect();
        effects[i].dispose();
      }

      synth.disconnect();
      synth.dispose();
    }, (attackRelease + releaseSecs) * 1000 + Audio.lookAhead * 1000);
  }
};

export default Audio;

/* eslint-enable */
