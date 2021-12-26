export const paths = {
  src: {
    root: './src/',
    js: './src/static/scripts/',
    css: './src/static/styles/',
    images: './src/static/images/',
    favicons: './src/static/favicons/',
    fonts: './src/static/fonts/',
    templates: './src/templates/'
  },
  dist: {
    root: './build/',
    js: './build/static/scripts/',
    css: './build/static/styles/',
    images: './build/static/images/',
    favicons: './build/static/favicons/',
    fonts: './build/static/fonts/'
  },
  browserSync: {
    server: './build/',
    proxy: ''
  },
  webpack: {
    entry: {
      bundle: './src/static/scripts/App.js'
    }
  }
};
