/* eslint-disable new-cap, no-unused-vars */
import Nexus from 'nexusui';

import Main from './Main';
import Sequencer from './Sequencer';
import Controls from './Controls';
import Signal from './Signal';
import Effects from './Effects';
import Audio from './Audio';

import { fetchAsync } from '../utils/fetchAsync';

const Asteroid = {
  elem: document.querySelector('.intro__wrapper'),
  beginEl: document.querySelector('#begin'),
  asteroidDataElem: document.querySelector('#asteroid-data'),
  asteroids: [],
  selectedAsteroid: {},
  hasOpened: false,

  init() {
    this.render();
  },

  fetchData: async () => {
    const today = new Date().toISOString().split('T')[0];

    const data = await fetchAsync(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=MKsFWtbcBefGIcipiyBf36RE9qX31mrNnwQGoges`
    );

    const r = (value, decimals) => {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    };

    const asteroids = [];
    let a, closeApproach;

    for (let i = 0; i < data.near_earth_objects[today].length; i++) {
      a = data.near_earth_objects[today][i];
      closeApproach = a.close_approach_data[0];

      const asteroidInstance = {
        name: a.name,
        hazardous: a.is_potentially_hazardous_asteroid.toString(),
        close_approach_date: closeApproach.close_approach_date,
        orbiting_body: closeApproach.orbiting_body,
        diameter: r(a.estimated_diameter.kilometers.estimated_diameter_max, 3),
        miss_distance: r(closeApproach.miss_distance.kilometers, 3),
        velocity: r(closeApproach.relative_velocity.miles_per_hour, 3)
      };

      asteroids.push(asteroidInstance);
    }

    Asteroid.asteroids = asteroids;
    Asteroid.selected = Asteroid.asteroids[0];
    Asteroid.renderInfo(0);
    Asteroid.eventListener();
  },

  renderInfo(i) {
    Asteroid.asteroidDataElem.innerHTML = '';

    let html = `
      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Name:</span>
        </div>
        <div class="col-12">
          ${Asteroid.selected.name}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Potentially Dangerous:</span>
        </div>
        <div class="col-12">
          ${Asteroid.selected.hazardous}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Close Approach Date:</span>
        </div>
        <div class="col-12">
          ${Asteroid.selected.close_approach_date}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Orbiting Body:</span>
        </div>
        <div class="col-12">
          ${Asteroid.selected.orbiting_body}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Est. Diamater (km):</span>
        </div>
        <div class="col-12">
          ${Asteroid.selected.diameter}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Miss Distance (km):</span>
        </div>
        <div class="col-12">
          ${Asteroid.selected.miss_distance}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Relatice Velocity (mph):</span>
        </div>
        <div class="col-12">
        ${Asteroid.selected.velocity}
        </div>
      </div>
    `;

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

      const updatedVal = Effects.valueInRangeFromPercentage(
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
      //   console.log('updatedVal', updatedVal);
      //   console.log('---');
      // }

      Effects.updateEffectValFromAsteroid(effect, effectParams, updatedVal);

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
    const select = new Nexus.Select('#asteroids', {
      size: [300, 30],
      options: Asteroid.asteroids.map(e => e.name)
    });

    select.on('change', e => {
      Asteroid.selected = Asteroid.asteroids[e.index];
      Asteroid.renderInfo(e.index);
    });

    Asteroid.beginEl.addEventListener(
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
        }, 300);

        Sequencer.renderNotes();
        Sequencer.renderSequence();
        Controls.renderControls();

        Asteroid.hasOpened = true;
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
