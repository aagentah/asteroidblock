/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Audio from './Audio';

const Effects = {
  data: [
    {
      name: 'Chorus',
      paramaters: [
        {
          name: 'frequency',
          value: 2,
          range: [1, 3]
        },
        {
          name: 'delayTime',
          value: 8,
          range: [2, 10]
        },
        {
          name: 'depth',
          value: 0.25,
          range: [0, 0.5]
        },
        {
          name: 'wet',
          value: 0.5,
          range: [0, 1]
        }
      ]
    },
    {
      name: 'Reverb',
      paramaters: [
        {
          name: 'decay',
          value: 50,
          range: [20, 200]
        },
        {
          name: 'wet',
          value: 0,
          range: [0, 0.5]
        }
      ]
    },
    {
      name: 'BitCrusher',
      paramaters: [
        {
          name: 'bits',
          value: 8,
          range: [1, 8]
        },

        {
          name: 'wet',
          value: 0,
          range: [0, 1]
        }
      ]
    },
    {
      name: 'PingPongDelay',
      paramaters: [
        {
          name: 'delayTime',
          value: 500,
          range: [20, 1000]
        },
        {
          name: 'feedback',
          value: 0.5,
          range: [0, 1]
        },
        {
          name: 'wet',
          value: 0,
          range: [0, 1]
        }
      ]
    }
  ],

  percentageInRangeGivenValue(value, range) {
    // Calculates a given values' percentage within a relative range
    const min = range[0];
    const max = range[1];

    return ((value - min) * 100) / (max - min);
  },

  valueInRangeFromPercentage(percentage, range) {
    // Calculates the value within a range given the percentage
    const min = range[0];
    const max = range[1];

    return (percentage * (max - min)) / 100 + min;
  },

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  },

  calcDial(effect) {
    return (
      Effects.percentageInRangeGivenValue(effect.value, effect.range) / 100
    );
  },

  updateEffectVal(effectIt, paramIt, value) {
    const percentage = value * 100;
    const effect = Effects.data[effectIt].paramaters[paramIt];
    const val = Effects.valueInRangeFromPercentage(percentage, effect.range);

    Effects.data[effectIt].paramaters[paramIt].value = val;
  },

  init() {
    this.render();
  },

  render() {
    let nex, effect, params;

    for (let i = 0; i < Effects.data.length; i++) {
      effect = Effects.data[i];
      nex = new Nexus.Rack(`#effect-${effect.name}`);
      nex.colorize('accent', '#505483');
      nex.colorize('fill', '#fafafa');

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        params = effect.paramaters[ii];

        if (nex[params.name]) {
          // Set default values
          nex[params.name].resize(55, 55);
          nex[params.name].value = Effects.calcDial(params);

          // Set event listener to update object store
          nex[`${params.name}`].on('change', v => {
            Effects.updateEffectVal(i, ii, v);
          });
        }
      }
    }
  }
};

export default Effects;

/* eslint-enable */
