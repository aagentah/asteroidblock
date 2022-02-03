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
          influencedBy: 'diameter'
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
          range: [0, 0.75],
          instance: null,
          influencedBy: 'velocity'
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
          range: [0, 0.75],
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
          value: 250,
          range: [20, 500],
          instance: null,
          influencedBy: 'diameter'
        },
        {
          name: 'feedback',
          value: 0.25,
          range: [0, 0.5],
          instance: null,
          influencedBy: 'miss_distance'
        },
        {
          name: 'wet',
          value: 0,
          range: [0, 0.5],
          instance: null,
          influencedBy: 'velocity'
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

  updateEffectVal(effectIt, paramIt, value) {
    const effect = Effects.data[effectIt].paramaters[paramIt];
    const percentage = (value * 100) / effect.range[1];
    const val = Effects.valueInRangeFromPercentage(percentage, effect.range);

    // console.log('effect', effect);
    // console.log('effect.name', effect.name);
    // console.log('value', value);
    // console.log('result', result);
    // console.log('percentage', percentage);
    // console.log('effect.range', effect.range);
    // console.log('valueInRangeFromPercentage', val);
    // console.log('---');

    Effects.data[effectIt].paramaters[paramIt].value = val;
  },

  updateEffectValFromAsteroid(effectIt, paramIt, value) {
    Effects.data[effectIt].paramaters[paramIt].instance.value = value;
  },

  init() {
    this.render();
  },

  render() {
    let rackEl, effect, dialEl, dial, effectParams;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const dialSize = isMobile ? 22 : 43;

    for (let i = 0; i < Effects.data.length; i++) {
      effect = Effects.data[i];
      rackEl = document.querySelector(`#effect-${effect.name}`);

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        effectParams = effect.paramaters[ii];
        dialEl = rackEl.querySelector(`#${effectParams.name}`);

        if (dialEl) {
          dial = new Nexus.Dial(dialEl, {
            size: [dialSize, dialSize],
            min: effectParams.range[0],
            max: effectParams.range[1],
            value: effectParams.value,
            interaction: 'vertical'
          });

          dial.colorize('accent', '#505483');
          dial.colorize('fill', '#fafafa');

          // Set event listener to update object store
          dial.on('change', v => {
            Effects.updateEffectVal(i, ii, v);
          });

          Effects.data[i].paramaters[ii].instance = dial;
        }
      }
    }
  }
};

export default Effects;

/* eslint-enable */
