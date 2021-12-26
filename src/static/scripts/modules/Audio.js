/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Controls from './Controls';

const Audio = {
  chorus: {
    frequency: null,
    delay: null,
    depth: null
  },
  reverb: {
    decay: null
  },

  play(notes) {
    const chorus = new Tone.Chorus(4, 2.5, 0.5);
    chorus.start();
    const reverb = new Tone.JCReverb(0.8);
    // const filter = new Tone.AutoFilter(8).start();

    const synth = new Tone.PolySynth(Tone.Synth);
    synth.chain(chorus, reverb, Tone.Destination);

    // const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.triggerAttackRelease(notes, Controls.noteLength / 1000);
  }
};

export default Audio;

/* eslint-enable */
