/* eslint-disable new-cap, no-unused-vars */
import _ from 'lodash';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Effects from './Effects';
import Nexus from 'nexusui';

const Signal = {
  currentInstrument: 'AMSynth',
  instrumentTypes: ['AMSynth', 'FMSynth', 'DuoSynth'],
  envelopeWrapper: document.querySelector('.envelope__wrapper'),
  envelopeHoldLabel: document.querySelector('.envelope__hold__label'),
  envAttack: null,
  envRelease: null,
  envHold: null,

  init() {
    this.render();
  },

  renderInstrument() {
    const select = new Nexus.Select('#instrument', {
      size: [150, 30],
      options: Signal.instrumentTypes
    });

    select.on('change', e => {
      Signal.currentInstrument = e.value;
    });
  },

  renderEnvelope() {
    const attackDial = new Nexus.Dial('#envelopeAttack', {
      value: 0.25
    });

    const releaseDial = new Nexus.Dial('#envelopeRelease', {
      value: 0.75
    });

    const holdDial = new Nexus.Dial('#envelopeHold', {
      min: 0.3,
      max: 4,
      value: 1
    });

    const envelope = new Nexus.Envelope('#envelope', {
      size: [Signal.envelopeWrapper.offsetWidth, 125],
      noNewPoints: false,
      points: [
        { x: 0, y: 0 },
        { x: 0.25, y: 0.5 },
        { x: 0.75, y: 0.5 },
        { x: 1, y: 0 }
      ]
    });

    attackDial.colorize('accent', '#505483');
    attackDial.colorize('fill', '#fafafa');

    releaseDial.colorize('accent', '#505483');
    releaseDial.colorize('fill', '#fafafa');

    holdDial.colorize('accent', '#505483');
    holdDial.colorize('fill', '#fafafa');

    envelope.colorize('accent', '#505483');
    envelope.colorize('fill', '#fafafa');

    const setEnvelopeVals = e => {
      const attack = e[1].x;
      const release = e[2].x;
      const noteLengthSecs = Controls.noteLength / 1000;
      const attackVal = attack;
      const releaseVal = 1 - release;

      Signal.envAttack = attackVal;
      Signal.envRelease = releaseVal;
    };

    const attackChange = v => {
      const releaseVal = envelope.points[2].x;
      if (v >= releaseVal) attackDial.value = releaseVal;
      envelope.movePoint(1, v, 0.5);
    };

    const releaseChange = v => {
      const attackVal = envelope.points[1].x;
      if (v <= attackVal) releaseDial.value = attackVal;
      envelope.movePoint(2, v, 0.5);
    };

    const holdChange = v => {
      Signal.envelopeHoldLabel.innerHTML = `${v.toFixed(2)}s`;
      Signal.envHold = v;
    };

    const attackDialThrottle = _.throttle(attackChange, 10);
    const releaseDialThrottle = _.throttle(releaseChange, 10);
    const holdDialThrottle = _.throttle(holdChange, 10);

    attackDial.on('change', attackDialThrottle);
    releaseDial.on('change', releaseDialThrottle);
    holdDial.on('change', holdDialThrottle);
    envelope.on('change', setEnvelopeVals);

    Signal.envHold = holdDial.value;
    Signal.envelopeHoldLabel.innerHTML = `${Signal.envHold.toFixed(2)}s`;

    setEnvelopeVals(envelope.points);
  },

  render() {
    Signal.renderInstrument();
    Signal.renderEnvelope();
  }
};

export default Signal;

/* eslint-enable */
