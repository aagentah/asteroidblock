/* eslint-disable new-cap, no-unused-vars */
import Nexus from 'nexusui';
import Cookies from 'js-cookie';

import Main from './Main';
import Sequencer from './Sequencer';
import Controls from './Controls';
import Signal from './Signal';
import Effects from './Effects';
import Audio from './Audio';

import * as backup from '../data/backup.json';

import { fetchAsync } from '../utils/fetchAsync';

const Asteroid = {
  elem: document.querySelector('.intro__wrapper'),
  asteroidBeginElem: document.querySelector('#asteroid-begin'),
  asteroidSelectsElem: document.querySelector('#asteroid-selects'),
  asteroidDataElem: document.querySelector('#asteroid-data'),
  asteroids: [],
  midiSequences: [
    {
      name: 'None',
      matrix: []
    },
    {
      name: 'test',
      matrix: [
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, true, false, true, false, false, false],
        [false, false, false, false, false, false, true, false],
        [true, false, false, false, false, false, false, true],
        [false, true, false, false, false, true, false, false],
        [false, false, false, true, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false]
      ]
    }
  ],
  selectedAsteroid: {},
  hasOpened: false,
  isLoading: true,

  init() {
    this.render();
  },

  fetchData: async () => {
    let asteroids = [];
    let data;
    const asteroidCookie = Cookies.get('asteroids');

    if (asteroidCookie) {
      asteroids = JSON.parse(asteroidCookie);
    } else {
      const today = new Date().toISOString().split('T')[0];

      data = await fetchAsync(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=MKsFWtbcBefGIcipiyBf36RE9qX31mrNnwQGoges`
      );

      if (!data || !data.near_earth_objects) {
        data = backup;
      }

      if (!data.near_earth_objects[today]) {
        data = backup;
      }

      if (data.near_earth_objects[today]) {
        if (data.near_earth_objects[today].length < 3) {
          data = backup;
        }
      }

      const r = (value, decimals) => {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
      };

      asteroids = [];
      let a, closeApproach;

      for (
        let i = 0;
        i <
        data.near_earth_objects[Object.keys(data.near_earth_objects)[0]].length;
        i++
      ) {
        a = data.near_earth_objects[Object.keys(data.near_earth_objects)[0]][i];
        closeApproach = a.close_approach_data[0];

        const asteroidInstance = {
          name: a.name,
          hazardous: a.is_potentially_hazardous_asteroid.toString(),
          close_approach_date: closeApproach.close_approach_date,
          orbiting_body: closeApproach.orbiting_body,
          diameter: r(
            a.estimated_diameter.kilometers.estimated_diameter_max,
            3
          ),
          miss_distance: r(closeApproach.miss_distance.kilometers, 3),
          velocity: r(closeApproach.relative_velocity.miles_per_hour, 3)
        };

        asteroids.push(asteroidInstance);
      }

      Cookies.set('asteroids', asteroids, { expires: 1 });
    }

    Asteroid.asteroids = asteroids;
    Asteroid.selected = Asteroid.asteroids[0];
    Asteroid.renderInfo(0);
    Asteroid.eventListener();
  },

  renderInfo(i) {
    let html = `
          <div class="flex  flex-wrap  pb3  mb3  bb  bc-black">
            Asteroid's Data:
          </div>
          <div class="flex  flex-wrap">
            <div class="w-100">
              <div class="flex  flex-wrap  pb0  pb2-md">
                <div class="col-12">
                  <span class="f7  f6-md  fw7">Name:</span>
                </div>
                <div class="col-12  intro__statistic">
                  ${Asteroid.selected.name}
                </div>
              </div>

              <div class="flex  flex-wrap  pb0  pb2-md">
                <div class="col-12">
                  <span class="f7  f6-md  fw7">Potentially Dangerous:</span>
                </div>
                <div class="col-12  intro__statistic">
                  ${Asteroid.selected.hazardous}
                </div>
              </div>

              <div class="flex  flex-wrap  pb0  pb2-md">
                <div class="col-12">
                  <span class="f7  f6-md  fw7">Close Approach Date:</span>
                </div>
                <div class="col-12  intro__statistic">
                  ${Asteroid.selected.close_approach_date}
                </div>
              </div>

              <div class="flex  flex-wrap  pb0  pb2-md">
                <div class="col-12">
                  <span class="f7  f6-md  fw7">Orbiting Body:</span>
                </div>
                <div class="col-12  intro__statistic">
                  ${Asteroid.selected.orbiting_body}
                </div>
              </div>

              <div class="flex  flex-wrap  pb0  pb2-md">
                <div class="col-12">
                  <span class="f7  f6-md  fw7">Est. Diamater (km):</span>
                </div>
                <div class="col-12  intro__statistic">
                  ${Asteroid.selected.diameter}
                </div>
              </div>

              <div class="flex  flex-wrap  pb0  pb2-md">
                <div class="col-12">
                  <span class="f7  f6-md  fw7">Miss Distance (km):</span>
                </div>
                <div class="col-12  intro__statistic">
                  ${Asteroid.selected.miss_distance}
                </div>
              </div>

              <div class="flex  flex-wrap  pb0  pb2-md">
                <div class="col-12">
                  <span class="f7  f6-md  fw7">Relatice Velocity (mph):</span>
                </div>
                <div class="col-12  intro__statistic">
                ${Asteroid.selected.velocity}
                </div>
              </div>
            </div>
          </div>
      `;

    Asteroid.asteroidDataElem.innerHTML = '';
    Asteroid.asteroidDataElem.insertAdjacentHTML('beforeend', html);

    const macro = (effect, effectParams) => {
      const influencedBy =
        Effects.data[effect].paramaters[effectParams].influencedBy;

      if (!influencedBy) {
        return;
      }

      const currInfluencedVal = Asteroid.selected[influencedBy];
      const diamaters = [];
      let curr;

      for (let i = 0; i < Asteroid.asteroids.length; i++) {
        curr = Asteroid.asteroids[i];
        diamaters.push(curr[influencedBy]);
      }

      // Chorus controlled by Est. Diamater
      const influencedByRange = [_.min(diamaters), _.max(diamaters)];

      const currInfluencePercentage = Effects.percentageInRangeGivenValue(
        currInfluencedVal,
        influencedByRange
      );

      const effectRange = Effects.data[effect].paramaters[effectParams].range;

      const valInRange = Effects.valueInRangeFromPercentage(
        currInfluencePercentage,
        effectRange
      );

      // if (
      //   Effects.data[effect].paramaters[effectParams].influencedBy ===
      //   'diameter'
      // ) {
      //   console.log('Asteroid.asteroids', Asteroid.asteroids);
      //   console.log('influencedBy', influencedBy);
      //   console.log('currInfluencedVal', currInfluencedVal);
      //   console.log('influencedByRange', influencedByRange);
      //   console.log('currInfluencePercentage', currInfluencePercentage);
      //   console.log('effectRange', effectRange);
      //   console.log('effect', effect);
      //   console.log('effectParams', effectParams);
      //   console.log('valInRange', valInRange);
      //   console.log('---');
      // }

      Effects.updateEffectValFromAsteroid(effect, effectParams, valInRange);

      let octave;
      let key;
      let multitude;

      octave = Math.floor(i / Signal.instrumentTypes.length);
      multitude = octave * Signal.instrumentTypes.length;
      key = i - multitude;

      Signal.instrumentSelect.value = Signal.instrumentTypes[key];
    };

    for (let i = 0; i < Effects.data.length; i++) {
      const effect = Effects.data[i];

      for (let ii = 0; ii < effect.paramaters.length; ii++) {
        const effectParams = effect.paramaters[ii];

        macro(i, ii);
      }
    }
  },

  eventListener() {
    let selectsHtml = `
      <div class="flex  flex-wrap  pb3  mb3  bb  bc-black  f7  f6-md">
        Select a real-world asteroid:
      </div>
      <div class="flex  flex-wrap">
        <div id="asteroids" class="intro__statistic"></div>
      </div>
    `;

    // <div class="flex  flex-wrap  pb3  mb3  bb  bc-black  pt4">
    //   Select MIDI Sequence:
    // </div>
    // <div class="flex  flex-wrap">
    //   <div id="midi-sequence" class="col-12  intro__statistic"></div>
    // </div>

    let buttonHtml = `
      <button id="begin" class="control__button">
        Begin
      </button>
    `;

    Asteroid.asteroidSelectsElem.innerHTML = '';
    Asteroid.asteroidBeginElem.innerHTML = '';

    Asteroid.asteroidSelectsElem.insertAdjacentHTML('beforeend', selectsHtml);
    Asteroid.asteroidBeginElem.insertAdjacentHTML('beforeend', buttonHtml);

    const beginEl = document.querySelector('#begin');

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const selectWidth = isMobile ? 200 : 300;

    const asteroidSelect = new Nexus.Select('#asteroids', {
      size: [selectWidth, 30],
      options: Asteroid.asteroids.map(e => e.name)
    });

    // const midiSelect = new Nexus.Select('#midi-sequence', {
    //   size: [300, 30],
    //   options: Asteroid.midiSequences.map(e => e.name)
    // });

    asteroidSelect.on('change', e => {
      Asteroid.selected = Asteroid.asteroids[e.index];
      Asteroid.renderInfo(e.index);
    });

    // midiSelect.on('change', e => {
    //   const selected = Asteroid.midiSequences[e.index];
    //   Controls.resetControls();
    //
    //   if (selected.name !== 'None') {
    //     Sequencer.parseMatrix(selected.matrix);
    //   }
    // });

    beginEl.addEventListener(
      'click',
      () => {
        if (Asteroid.hasOpened) {
          return;
        }

        Main.wrapper.classList.add('active');
        Asteroid.elem.classList.remove('active');

        setTimeout(() => {
          Asteroid.elem.classList.remove('flex');
          Asteroid.elem.classList.add('dn');

          Sequencer.renderNotes();
          Controls.renderControls();

          Asteroid.hasOpened = true;
        }, 300);
      },
      false
    );
  },

  render() {
    Asteroid.fetchData();
  }
};

export default Asteroid;

/* eslint-enable */
