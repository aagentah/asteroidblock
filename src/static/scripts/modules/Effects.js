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
          range: [1, 3],
          instance: null,
          influencedBy: 'estimated_diameter'
        },
        {
          name: 'delayTime',
          value: 8,
          range: [2, 10],
          instance: null,
          influencedBy: null
        },
        {
          name: 'depth',
          value: 0.25,
          range: [0, 0.5],
          instance: null,
          influencedBy: 'miss_distance'
        },
        {
          name: 'wet',
          value: 0.5,
          range: [0, 1],
          instance: null,
          influencedBy: 'relative_velocity'
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
          range: [0, 0.5],
          instance: null,
          influencedBy: 'miss_distance'
        }
      ]
    },
    {
      name: 'BitCrusher',
      paramaters: [
        {
          name: 'bits',
          value: 8,
          range: [1, 8],
          instance: null,
          influencedBy: null
        },

        {
          name: 'wet',
          value: 0,
          range: [0, 1],
          instance: null,
          influencedBy: null
        }
      ]
    },
    {
      name: 'PingPongDelay',
      paramaters: [
        {
          name: 'delayTime',
          value: 500,
          range: [20, 1000],
          instance: null,
          influencedBy: null
        },
        {
          name: 'feedback',
          value: 0.5,
          range: [0, 1],
          instance: null,
          influencedBy: null
        },
        {
          name: 'wet',
          value: 0,
          range: [0, 1],
          instance: null,
          influencedBy: 'relative_velocity'
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

  updateEffectVal(effectIt, paramIt, value, source) {
    const percentage = value * 100;
    const effect = Effects.data[effectIt].paramaters[paramIt];
    const val = Effects.valueInRangeFromPercentage(percentage, effect.range);

    const instance = Effects.data[effectIt].paramaters[paramIt].instance;

    if (source === 'asteroid') {
      instance.value = value;
    }

    Effects.data[effectIt].paramaters[paramIt].value = val;
  },

  init() {
    this.render();
  },

  render() {
    let nex, effect, params, element;

    for (let i = 0; i < Effects.data.length; i++) {
      effect = Effects.data[i];
      nex = new Nexus.Rack(`#effect-${effect.name}`);
      nex.colorize('accent', '#505483');
      nex.colorize('fill', '#fafafa');

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        params = effect.paramaters[ii];
        Effects.data[i].paramaters[ii].instance = nex[params.name];

        if (Effects.data[i].paramaters[ii].instance) {
          // Set default values
          Effects.data[i].paramaters[ii].instance.resize(55, 55);
          Effects.data[i].paramaters[ii].instance.value = Effects.calcDial(
            params
          );

          // Set event listener to update object store
          Effects.data[i].paramaters[ii].instance.on('change', v => {
            Effects.updateEffectVal(i, ii, v, 'effects');
          });
        }
      }
    }
  }
};

export default Effects;

/* eslint-enable */
