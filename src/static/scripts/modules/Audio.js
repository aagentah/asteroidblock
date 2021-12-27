/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Controls from './Controls';
import Effects from './Effects';

const Audio = {
  play: async notes => {
    let effects = [];
    let effectParams = [];
    let effect, toneEffect, param;

    // Creates all Tone Effects based on Effects.js data object
    for (let i = 0; i < Effects.data.length; i++) {
      effects = [];
      effectParams = [];
      effect = Effects.data[i];

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        param = effect.paramaters[ii];
        effectParams.push(param.value);
      }

      toneEffect = new Tone[effect.name](...effectParams);

      if (i === 0) toneEffect.start();
      effects.push(toneEffect);
    }

    // Play tone
    const synth = new Tone.PolySynth(Tone.Synth);
    synth.chain(...effects, Tone.Destination);
    await Tone.start();
    Nexus.context.resume();
    synth.triggerAttackRelease(notes, Controls.noteLength / 1000);

    // Clean up
    setTimeout(() => {
      for (let i = 0; i < effects.length; i++) {
        effects[i].disconnect();
        effects[i].dispose();
      }

      synth.disconnect();
      synth.dispose();
    }, 5000);
  }
};

export default Audio;

/* eslint-enable */
