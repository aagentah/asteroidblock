/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Controls from './Controls';
import Effects from './Effects';

const Audio = {
  play: async notes => {
    const chorus = new Tone.Chorus(
      Effects.data.chorus.frequency.value,
      Effects.data.chorus.delayTime.value,
      Effects.data.chorus.depth.value
    );

    chorus.start();
    const reverb = new Tone.Reverb(0.8);
    // const filter = new Tone.AutoFilter(8).start();

    const synth = new Tone.PolySynth(Tone.Synth);
    synth.chain(chorus, reverb, Tone.Destination);
    // synth.chain(chorus, Tone.Destination);

    await Tone.start();
    Nexus.context.resume();

    // const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.triggerAttackRelease(notes, Controls.noteLength / 1000);
  }
};

export default Audio;

/* eslint-enable */
