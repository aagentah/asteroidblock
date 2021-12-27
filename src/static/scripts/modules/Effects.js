/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Audio from './Audio';

const Effects = {
  data: {
    chorus: {
      frequency: {
        value: 2,
        range: [1, 3]
      },
      delayTime: {
        value: 8,
        range: [2, 10]
      },
      depth: {
        value: 0,
        range: [0, 0.5]
      }
    }
  },

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

  updateEffectVal(effectName, paramaterName, value) {
    const percentage = value * 100;
    const effect = Effects.data[effectName][paramaterName];

    const val = Effects.valueInRangeFromPercentage(percentage, effect.range);
    Effects.data[effectName][paramaterName].value = val;
  },

  init() {
    this.render();
  },

  chorus() {
    const chorus = new Nexus.Rack('#effect-chorus');

    // Set default values
    chorus.frequency.value = Effects.calcDial(Effects.data.chorus.frequency);
    chorus.delayTime.value = Effects.calcDial(Effects.data.chorus.delayTime);
    chorus.depth.value = Effects.calcDial(Effects.data.chorus.depth);

    chorus.frequency.on('change', v => {
      Effects.updateEffectVal('chorus', 'frequency', v);
    });

    chorus.delayTime.on('change', v => {
      Effects.updateEffectVal('chorus', 'delayTime', v);
    });

    chorus.depth.on('change', v => {
      Effects.updateEffectVal('chorus', 'depth', v);
    });
  },

  render() {
    Effects.chorus();
  }
};

export default Effects;

/* eslint-enable */
