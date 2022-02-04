/* eslint-disable new-cap, no-unused-vars */
import Nexus from 'nexusui';

const Instrument = {
  currentInstrument: 'AMSynth',
  instrumentSelect: null,
  instrumentTypes: [
    'AMSynth',
    'FMSynth',
    'DuoSynth',
    'MetalSynth',
    'MembraneSynth'
  ],

  init() {
    this.render();
  },

  render() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const selectHeight = isMobile ? 20 : 30;

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
