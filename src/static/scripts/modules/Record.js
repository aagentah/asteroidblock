/* eslint-disable new-cap, no-unused-vars */

import Controls from './Controls';

const Record = {
  // adapted from https://gist.github.com/also/900023
  // returns Uint8Array of WAV header bytes
  getWavHeader(options) {
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
  },

  // Returns Uint8Array of WAV bytes
  getWavBytes(buffer, options) {
    const type = options.isFloat ? Float32Array : Uint16Array;
    const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

    const headerBytes = Record.getWavHeader(
      Object.assign({}, options, { numFrames })
    );
    const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

    // prepend header, then add pcmBytes
    wavBytes.set(headerBytes, 0);
    wavBytes.set(new Uint8Array(buffer), headerBytes.length);

    return wavBytes;
  },

  convertBlobToAudioBuffer(myBlob) {
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
  },

  animateProgress() {
    const fulltime = Controls.noteLength * 8;

    const increaseVal = progressBar => {
      if (progressBar.value < 100) {
        progressBar.value = progressBar.value + 1;
      } else {
        progressBar.value = 0;
        clearInterval(progressBar.interval);
      }
    };

    const progressBars = document.getElementsByClassName('progress');
    for (let i = 0; i < progressBars.length; i++) {
      //call increaseVal function and wait 50ms before each call
      //the third argument is the argument that i want to pass to the increaseVal function
      //read https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
      progressBars[i].interval = setInterval(
        increaseVal,
        fulltime / 100,
        progressBars[i]
      );
    }
  },

  init(recorder) {
    Record.animateProgress();

    // wait for the notes to end and stop the recording
    setTimeout(async () => {
      Controls.stopControls();

      const recording = await recorder.stop();
      const audioBuffer = await Record.convertBlobToAudioBuffer(recording);

      // Float32Array samples
      const [left, right] = [
        audioBuffer.getChannelData(0),
        audioBuffer.getChannelData(1)
      ];

      console.log('audioBuffer', audioBuffer);

      // interleaved
      const interleaved = new Float32Array(left.length + right.length);
      for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
        interleaved[dst] = left[src];
        interleaved[dst + 1] = right[src];
      }

      // get WAV file bytes and audio params of your audio source
      const wavBytes = Record.getWavBytes(interleaved.buffer, {
        isFloat: true, // floating point or 16-bit integer
        numChannels: 2,
        sampleRate: 48000
      });

      console.log('wavBytes', wavBytes);

      const wav = new Blob([wavBytes], { type: 'audio/wav' });

      console.log('wav', wav);

      const anchor = document.createElement('a');
      anchor.download = 'asteroidblock.wav';
      anchor.href = URL.createObjectURL(wav);
      anchor.click();
    }, Controls.noteLength * 8);
  }
};

export default Record;

/* eslint-enable */
