// import Accordion from './modules/Accordion';
// import Gallery from './modules/Gallery';
// import LazyLoad from './modules/LazyLoad';
// import Notify from './modules/Notify';
// import Tabs from './modules/Tabs';
import Main from './modules/Main';

// import { loadGA } from './functions/loadGA';

class App {
  constructor() {
    // this.config = {
    //   hostname: null,
    //   gaId: null
    // };
    this.modules = [Main];

    document.documentElement.className = 'js';

    // Init all necessary modules
    this.modules.forEach(module => {
      module.init();
    });

    this.dynamicWebpackImport();
    this.setupLazyLoad();

    // Uncomment to load ga
    // if (this.config.hostname && this.config.gaId) {
    //   loadGA(this.config.hostname, this.config.gaId);
    // }
  }

  dynamicWebpackImport() {
    // if (document.querySelector('#js-docs')) {
    //   import(/* webpackChunkName: 'docs' */ './modules/Docs').then(module => {
    //     module.default.init();
    //   });
    // }
    //
    // if (document.querySelector('[data-helper="grid"]')) {
    //   import(/* webpackChunkName: 'helper' */ './modules/Helper').then(
    //     module => {
    //       module.default.init();
    //     }
    //   );
    // }
    //
    // if (document.querySelector('[data-modal]')) {
    //   import(/* webpackChunkName: 'modal' */ './modules/Modal').then(module => {
    //     module.default.init();
    //   });
    // }
    //
    // if (document.querySelector('[data-track]')) {
    //   import(/* webpackChunkName: 'track' */ './modules/Track').then(module => {
    //     module.default.init();
    //   });
    // }
    //
    // if (document.querySelector('.js-video-embed')) {
    //   import(/* webpackChunkName: 'video-embed' */ './modules/VideoEmbed').then(
    //     module => {
    //       module.default.init();
    //     }
    //   );
    // }
  }

  setupLazyLoad() {
    // const lazyLoad = new LazyLoad({
    //   root: document.querySelectorAll('[data-src]'),
    //   rootMargin: '20px 0px 20px 0px',
    //   threshold: 0.1
    // });
    // lazyLoad.render();
  }
}

window.addEventListener('load', () => new App());
