/* eslint-disable new-cap, no-unused-vars */
import _ from 'lodash';
import Nexus from 'nexusui';

import Controls from './Controls';

const Envelope = {
  envelopeWrapper: document.querySelector('.envelope__wrapper'),
  envelopeHoldLabel: document.querySelector('.envelope__hold__label'),
  envAttack: null,
  envRelease: null,
  envHold: null,

  init() {
    this.render();
  },

  render() {
    const attackDial = new Nexus.Multislider('#envelopeAttack', {
      values: [0.5],
      numberOfSliders: 1,
      size: [28, 48],
      min: 0,
      max: 1
    });

    const releaseDial = new Nexus.Multislider('#envelopeRelease', {
      values: [0.5],
      numberOfSliders: 1,
      size: [28, 48],
      min: 0,
      max: 1
    });

    const holdDial = new Nexus.Multislider('#envelopeHold', {
      values: [2],
      numberOfSliders: 1,
      size: [28, 48],
      min: 0.3,
      max: 4,
      mode: 'line'
    });

    const envelope = new Nexus.Envelope('#envelope', {
      size: [100, 125],
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
      const noteLengthSecs = Audio.noteLength / 1000;
      const attackVal = attack;
      const releaseVal = 1 - release;

      Envelope.envAttack = attackVal;
      Envelope.envRelease = releaseVal;
    };

    const attackChange = v => {
      const value = v[0];
      const releaseVal = envelope.points[2].x;
      if (value >= releaseVal) attackDial.values[0] = releaseVal;
      envelope.movePoint(1, value, 0.5);
    };

    const releaseChange = v => {
      const value = v[0];
      const attackVal = envelope.points[1].x;
      if (value <= attackVal) releaseDial.values[0] = attackVal;
      envelope.movePoint(2, value, 0.5);
    };

    const holdChange = v => {
      const value = v[0];
      Envelope.envelopeHoldLabel.innerHTML = `${value.toFixed(2)}s`;
      Envelope.envHold = value;
    };

    const attackDialThrottle = _.throttle(attackChange, 10);
    const releaseDialThrottle = _.throttle(releaseChange, 10);
    const holdDialThrottle = _.throttle(holdChange, 10);

    attackDial.on('change', attackDialThrottle);
    releaseDial.on('change', releaseDialThrottle);
    holdDial.on('change', holdDialThrottle);
    envelope.on('change', setEnvelopeVals);

    Envelope.envHold = holdDial.values[0];
    Envelope.envelopeHoldLabel.innerHTML = `${Envelope.envHold.toFixed(2)}s`;

    setEnvelopeVals(envelope.points);
  }
};

export default Envelope;

/* eslint-enable */
