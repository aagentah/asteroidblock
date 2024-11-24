/* eslint-disable new-cap, no-unused-vars */
import Nexus from 'nexusui';
import { isMobile } from '../utils/isMobile';

const Instrument = {
  currentInstrument: 'AMSynth',
  instrumentSelect: null,
  instrumentTypes: [
    'AMSynth',
    'FMSynth',
    'MembraneSynth',
    'DuoSynth'
    // 'MetalSynth',
  ],

  init() {
    this.render();
  },

  render() {
    const selectHeight = isMobile() ? 20 : 30;

    Instrument.instrumentSelect = new Nexus.Select('#instrument', {
      size: [150, selectHeight],
      options: Instrument.instrumentTypes
    });

    Instrument.instrumentSelect.on('change', e => {
      Instrument.currentInstrument = e.value;
    });
  }
};

export default Instrument;

/* eslint-enable */
