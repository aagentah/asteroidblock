/* eslint-disable new-cap, no-unused-vars */
import _ from 'lodash';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Effects from './Effects';
import Nexus from 'nexusui';

const Signal = {
  instrument: 'AM',
  envelopeWrapper: document.querySelector('.envelope__wrapper'),
  envAttack: null,
  envRelease: null,
  envSustain: null,

  init() {
    this.render();
  },

  renderInstrument() {
    const options = ['AMSynth', 'FMSynth', 'DuoSynth'];

    const select = new Nexus.Select('#instrument', {
      size: [150, 30],
      options: options
    });

    select.on('change', e => {
      Signal.instrument = e.value;
    });
  },

  renderEnvelope() {
    const attackDial = new Nexus.Dial('#envelopeAttack', {
      size: [50, 50],
      interaction: 'radial', // "radial", "vertical", or "horizontal"
      mode: 'relative', // "absolute" or "relative"
      // min: 0,
      // max: 1,
      // step: 0,
      value: 0.25
    });

    const releaseDial = new Nexus.Dial('#envelopeRelease', {
      size: [50, 50],
      interaction: 'radial', // "radial", "vertical", or "horizontal"
      mode: 'relative', // "absolute" or "relative"
      // min: 0,
      // max: 1,
      // step: 0,
      value: 0.75
    });

    const envelope = new Nexus.Envelope('#envelope', {
      size: [Signal.envelopeWrapper.offsetWidth, 170],
      noNewPoints: false,
      points: [
        { x: 0.0, y: 0 },
        { x: 0.25, y: 0.75 },
        { x: 0.75, y: 0.75 },
        { x: 1, y: 0 }
      ]
    });

    const setEnvelopeVals = e => {
      const attack = e[1].x;
      const release = e[2].x;
      const noteLengthSecs = Controls.noteLength / 1000;

      const attackVal = attack;
      const releaseVal = 1 - release;
      const sustainVal = 1 - (attackVal + releaseVal);

      Signal.envAttack = attackVal;
      Signal.envRelease = releaseVal;
      Signal.envSustain = sustainVal;
    };

    const attackChange = v => {
      const releaseVal = envelope.points[2].x;
      if (v >= releaseVal) attackDial.value = releaseVal;
      envelope.movePoint(1, v, 0.75);
    };

    const releaseChange = v => {
      const attackVal = envelope.points[1].x;
      if (v <= attackVal) releaseDial.value = attackVal;
      envelope.movePoint(2, v, 0.75);
    };

    const attackDialThrottle = _.throttle(attackChange, 10);
    const releaseDialThrottle = _.throttle(releaseChange, 10);

    attackDial.on('change', attackDialThrottle);
    releaseDial.on('change', releaseDialThrottle);
    envelope.on('change', setEnvelopeVals);

    setEnvelopeVals(envelope.points);
  },

  render() {
    Signal.renderInstrument();
    Signal.renderEnvelope();
  }
};

export default Signal;

/* eslint-enable */
