/* eslint-disable new-cap, no-unused-vars */

import Nexus from 'nexusui';
import * as Tone from 'tone';
import _ from 'lodash';
import toWav from 'audiobuffer-to-wav';

import Controls from './Controls';
import Effects from './Effects';
import Signal from './Signal';

const Audio = {
  lookAhead: 0.5,
  instruments: {},
  effect: {},

  setContext() {
    const context = new Tone.Context({
      latencyHint: 'playback',
      lookAhead: Audio.lookAhead,
      sampleRate: 8000
    });

    Tone.setContext(context);
  },

  setInstruments() {
    let instrument;

    for (let i = 0; i < Signal.instrumentTypes.length; i++) {
      instrument = Signal.instrumentTypes[i];
      Audio.instruments[instrument] = Tone[instrument];
    }
  },

  setEffects() {
    let effects = [];
    let effectParams = {};
    let effect, param;

    // Creates all Tone Effects based on Effects.js data object
    for (let i = 0; i < Effects.data.length; i++) {
      effectParams = [];
      effect = Effects.data[i];

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        param = effect.paramaters[ii];
        effectParams[param.name] = param.value;
      }

      if (i === 0) {
        Audio.effect[effect.name] = new Tone[effect.name]({
          ...effectParams
        }).start();
      } else {
        Audio.effect[effect.name] = new Tone[effect.name]({
          ...effectParams
        });
      }
    }
  },

  play: async notes => {
    let effectParams = {};
    let effect, param;

    // Tweaks all Tone Effects based on Effects.js data object
    for (let i = 0; i < Effects.data.length; i++) {
      effectParams = [];
      effect = Effects.data[i];

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        param = effect.paramaters[ii];
        effectParams[param.name] = param.value;
      }

      Audio.effect[effect.name].set({ ...effectParams });
    }

    const recorder = new Tone.Recorder();

    // Play tone
    const synth = new Tone.PolySynth(
      Audio.instruments[Signal.currentInstrument]
    );

    const durationSecs = Controls.noteLength / 1000;
    const divideBy = (divide, by) => divide / by;
    const attackSecs = divideBy(Signal.envAttack, 1) * Signal.envHold;
    const holdSecs = Signal.envHold;
    const releaseSecs = divideBy(Signal.envRelease, 1) * Signal.envHold;
    const envelope = { attack: attackSecs, release: releaseSecs };
    const attackRelease = attackSecs + holdSecs + releaseSecs;

    synth.chain(..._.values(Audio.effect), Tone.getContext().destination);
    synth.set({ envelope });

    synth.connect(recorder);

    recorder.start();

    synth.triggerAttackRelease(notes, attackRelease);

    var convertBlobToAudioBuffer = myBlob => {
      return new Promise((resolve, reject) => {
        const audioContext = new AudioContext();
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          let myArrayBuffer = fileReader.result;

          audioContext.decodeAudioData(myArrayBuffer, audioBuffer => {
            resolve(audioBuffer);
          });
        };

        // Load blob
        fileReader.readAsArrayBuffer(myBlob);
      });
    };

    function make_download(abuffer, total_samples) {
      // get duration and sample rate
      var duration = abuffer.duration,
        rate = abuffer.sampleRate,
        offset = 0;

      var new_file = URL.createObjectURL(bufferToWave(abuffer, total_samples));

      var download_link = document.getElementById('download_link');
      download_link.href = new_file;
      var name = generateFileName();
      download_link.download = name;
    }

    function generateFileName() {
      var origin_name = fileInput.files[0].name;
      var pos = origin_name.lastIndexOf('.');
      var no_ext = origin_name.slice(0, pos);

      return no_ext + '.compressed.wav';
    }

    // Convert an AudioBuffer to a Blob using WAVE representation
    function bufferToWave(abuffer, len) {
      var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [],
        i,
        sample,
        offset = 0,
        pos = 0;

      // write WAVE header
      setUint32(0x46464952); // "RIFF"
      setUint32(length - 8); // file length - 8
      setUint32(0x45564157); // "WAVE"

      setUint32(0x20746d66); // "fmt " chunk
      setUint32(16); // length = 16
      setUint16(1); // PCM (uncompressed)
      setUint16(numOfChan);
      setUint32(abuffer.sampleRate);
      setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
      setUint16(numOfChan * 2); // block-align
      setUint16(16); // 16-bit (hardcoded in this demo)

      setUint32(0x61746164); // "data" - chunk
      setUint32(length - pos - 4); // chunk length

      // write interleaved data
      for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

      while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
          // interleave channels
          sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
          sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
          view.setInt16(pos, sample, true); // write 16-bit sample
          pos += 2;
        }
        offset++; // next source sample
      }

      // create Blob
      return new Blob([buffer], { type: 'audio/wav' });

      function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
      }

      function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
      }
    }

    // Returns Uint8Array of WAV bytes
    function getWavBytes(buffer, options) {
      const type = options.isFloat ? Float32Array : Uint16Array;
      const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

      const headerBytes = getWavHeader(
        Object.assign({}, options, { numFrames })
      );
      const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

      // prepend header, then add pcmBytes
      wavBytes.set(headerBytes, 0);
      wavBytes.set(new Uint8Array(buffer), headerBytes.length);

      return wavBytes;
    }

    // adapted from https://gist.github.com/also/900023
    // returns Uint8Array of WAV header bytes
    function getWavHeader(options) {
      const numFrames = options.numFrames;
      const numChannels = options.numChannels || 2;
      const sampleRate = options.sampleRate || 44100;
      const bytesPerSample = options.isFloat ? 4 : 2;
      const format = options.isFloat ? 3 : 1;

      const blockAlign = numChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = numFrames * blockAlign;

      const buffer = new ArrayBuffer(44);
      const dv = new DataView(buffer);

      let p = 0;

      function writeString(s) {
        for (let i = 0; i < s.length; i++) {
          dv.setUint8(p + i, s.charCodeAt(i));
        }
        p += s.length;
      }

      function writeUint32(d) {
        dv.setUint32(p, d, true);
        p += 4;
      }

      function writeUint16(d) {
        dv.setUint16(p, d, true);
        p += 2;
      }

      writeString('RIFF'); // ChunkID
      writeUint32(dataSize + 36); // ChunkSize
      writeString('WAVE'); // Format
      writeString('fmt '); // Subchunk1ID
      writeUint32(16); // Subchunk1Size
      writeUint16(format); // AudioFormat
      writeUint16(numChannels); // NumChannels
      writeUint32(sampleRate); // SampleRate
      writeUint32(byteRate); // ByteRate
      writeUint16(blockAlign); // BlockAlign
      writeUint16(bytesPerSample * 8); // BitsPerSample
      writeString('data'); // Subchunk2ID
      writeUint32(dataSize); // Subchunk2Size

      return new Uint8Array(buffer);
    }

    // wait for the notes to end and stop the recording
    setTimeout(async () => {
      const recording = await recorder.stop();
      const audioBuffer = await convertBlobToAudioBuffer(recording);
      // const wav = toWav(buffer);

      console.log('recording', recording);
      console.log('audioBuffer', audioBuffer);
      // console.log('wav', wav);

      // Float32Array samples
      const [left, right] = [
        audioBuffer.getChannelData(0),
        audioBuffer.getChannelData(1)
      ];

      // interleaved
      const interleaved = new Float32Array(left.length + right.length);
      for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
        interleaved[dst] = left[src];
        interleaved[dst + 1] = right[src];
      }

      // get WAV file bytes and audio params of your audio source
      const wavBytes = getWavBytes(interleaved.buffer, {
        isFloat: true, // floating point or 16-bit integer
        numChannels: 2,
        sampleRate: 48000
      });
      const wav = new Blob([wavBytes], { type: 'audio/wav' });

      console.log('URL.createObjectURL(wav);', URL.createObjectURL(wav));

      // create download link and append to Dom
      // const downloadLink = document.createElement('a');
      // downloadLink.href =
      // downloadLink.setAttribute('download', 'my-audio.wav'); // name file

      // // get duration and sample rate
      // var duration = buffer.duration,
      //   rate = buffer.sampleRate,
      //   offset = 0;
      //
      // var new_file = URL.createObjectURL(
      //   bufferToWave(buffer, buffer.sampleRate * buffer.length)
      // );
      //
      // var download_link = document.createElement('a');
      // download_link.href = new_file;
      // var name = generateFileName();
      // download_link.download = name;
      // download_link.click();

      const anchor = document.createElement('a');
      anchor.download = 'test.wav';
      anchor.href = URL.createObjectURL(wav);
      anchor.click();
    }, 4000);

    // Clean up
    setTimeout(() => {
      synth.disconnect();
      synth.dispose();
    }, (attackRelease + releaseSecs) * 1000 + Audio.lookAhead * 1000);
  }
};

export default Audio;

/* eslint-enable */
