/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';

import Sequencer from './Sequencer';

const Audio = {
  play(notes) {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.triggerAttackRelease(notes, Sequencer.noteLength / 1000);
  }
};

export default Audio;

/* eslint-enable */
