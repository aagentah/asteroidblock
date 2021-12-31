/* eslint-disable new-cap, no-unused-vars */

import Sequencer from './Sequencer';
import Controls from './Controls';
import Effects from './Effects';
import Nexus from 'nexusui';

const Signal = {
  instrument: 'AM',

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
    const envelope = new Nexus.Envelope('#envelope', {
      size: [300, 150],
      noNewPoints: false,
      points: [
        {
          x: 0.0,
          y: 0
        },
        {
          x: 0.25,
          y: 0.5
        },
        {
          x: 0.5,
          y: 0.5
        },
        {
          x: 1,
          y: 0
        }
      ]
    });

    envelope.on('change', e => {
      // Signal.instrument = e.value;
    });

    setTimeout(() => {
      envelope.movePoint(1, 0.1, 0.5);
      envelope.movePoint(2, 0.7, 0.5);
    }, 1000);
  },

  render() {
    Signal.renderInstrument();
    Signal.renderEnvelope();
  }
};

export default Signal;

/* eslint-enable */
