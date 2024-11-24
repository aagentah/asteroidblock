/* eslint-disable new-cap, no-unused-vars */

import * as Tone from 'tone';
import Controls from './Controls';
import Audio from './Audio';
import Sequencer from './Sequencer';

const Record = {
  recorder: null,
  isRecording: false,

  /**
   * Initialize and start recording session
   * @param {Tone.Recorder} recorder - Tone.js recorder instance
   */
  async init(recorder) {
    try {
      Record.recorder = recorder;
      Record.isRecording = true;

      // Start progress animation
      Record.animateProgress();

      // Disable controls during recording
      Record.toggleControls(true);

      // Start recording
      await recorder.start();

      // Reset sequencer position
      Sequencer.currentColumn = 0;

      // Start transport-based sequencer
      await Sequencer.startTransport();
    } catch (error) {
      console.error('Error starting recording:', error);
      Record.toggleControls(false);
      Record.isRecording = false;
    }
  },

  /**
   * Stop recording and trigger download
   */
  async stopAndDownload() {
    if (!Record.isRecording || !Record.recorder) {
      return;
    }

    try {
      // Re-enable controls
      Record.toggleControls(false);

      // Stop recorder and get blob
      const recordingBlob = await Record.recorder.stop();

      // Create download link
      const url = URL.createObjectURL(recordingBlob);
      const anchor = document.createElement('a');
      anchor.download = 'asteroidblock.wav';
      anchor.href = url;

      // Trigger download
      anchor.click();

      // Cleanup
      URL.revokeObjectURL(url);
      Record.recorder = null;
      Record.isRecording = false;
    } catch (error) {
      console.error('Error stopping recording:', error);
      Record.toggleControls(false);
      Record.isRecording = false;
    }
  },

  /**
   * Toggle control buttons enabled state
   * @param {boolean} disabled - Whether to disable controls
   */
  toggleControls(disabled) {
    const controls = [Controls.startEl, Controls.stopEl, Controls.resetEl];

    controls.forEach(control => {
      if (disabled) {
        control.classList.add('disabled');
      } else {
        control.classList.remove('disabled');
      }
    });
  },

  /**
   * Animate progress bar during recording
   */
  animateProgress() {
    const fulltime = Audio.noteLength * 8;

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
      progressBars[i].interval = setInterval(
        increaseVal,
        fulltime / 100,
        progressBars[i]
      );
    }
  }
};

export default Record;

/* eslint-enable */
