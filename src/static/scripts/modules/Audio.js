/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Controls from './Controls';
import Effects from './Effects';
import Signal from './Signal';

const Audio = {
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
    const envelope = { attack: 0.5, release: 0.5 };

    synth.chain(...effects, Tone.Destination);
    synth.set({ envelope: envelope });

    // note length = Controls.noteLength / 1000
    synth.triggerAttackRelease(notes, envelope.attack + envelope.release);

    // Clean up
    setTimeout(() => {
      for (let i = 0; i < effects.length; i++) {
        effects[i].disconnect();
        effects[i].dispose();
      }

      synth.disconnect();
      synth.dispose();
    }, 3000);
  }
};

export default Audio;

/* eslint-enable */
