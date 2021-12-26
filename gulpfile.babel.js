import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
import mqpacker from 'css-mqpacker';
import del from 'del';
import clean from 'gulp-clean';
import eslint from 'gulp-eslint';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import minimist from 'minimist';
import newer from 'gulp-newer';
import plumber from 'gulp-plumber';
import prettier from 'gulp-prettier-plugin';
import prettify from 'gulp-prettify';
import postcss from 'gulp-postcss';
import postscss from 'postcss-scss';
import reporter from 'postcss-reporter';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import stylelint from 'stylelint';
import through2 from 'through2';
import twig from 'gulp-twig';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import * as prettierConfig from './.prettierrc.js';
import { paths } from './src/config/paths';
import { copy } from './src/config/copy';

const sass = require('gulp-sass')(require('sass'));

// Setup task error function
const onError = function(err) {
  console.log(err.message);
  this.emit('end');
};

// Assign NODE_ENV
const argv = minimist(process.argv.slice(2), {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
});

// BrowserSync
gulp.task('browserSync', () => {
  // Local instance
  if (paths.browserSync.server !== '') {
    browserSync.init({
      server: paths.browserSync.server,
      notify: false
    });
  }

  // Proxy url
  if (paths.browserSync.proxy !== '') {
    browserSync.init({
      proxy: paths.browserSync.proxy,
      notify: false
    });
  }
});

// Scripts
gulp.task('prettier-scripts', () => {
  return gulp
    .src([paths.src.js + '**/*.js'])
    .pipe(prettier(prettierConfig, { filter: true }))
    .pipe(gulp.dest(file => file.base));
});

gulp.task(
  'eslint',
  gulp.series('prettier-scripts', () => {
    return gulp
      .src([paths.src.js + '**/*.js'])
      .pipe(eslint())
      .pipe(eslint.format('table'))
      .pipe(eslint.failAfterError());
  })
);

gulp.task(
  'scripts',
  // gulp.series('eslint', () => {
  //   return gulp
  //     .src(paths.src.js + '**/*.js')
  //     .pipe(plumber({ errorHandler: onError }))
  //     .pipe(
  //       webpackStream(
  //         {
  //           config: require('./webpack.config.js')
  //         },
  //         webpack
  //       )
  //     )
  //     .pipe(gulp.dest(paths.dist.js));
  // })
  gulp.series(() => {
    return gulp
      .src(paths.src.js + '**/*.js')
      .pipe(plumber({ errorHandler: onError }))
      .pipe(
        webpackStream(
          {
            config: require('./webpack.config.js')
          },
          webpack
        )
      )
      .pipe(gulp.dest(paths.dist.js));
  })
);

gulp.task(
  'scripts-watch',
  gulp.series('scripts', done => {
    browserSync.reload();
    done();
  })
);

// Styles
gulp.task('prettier-styles', () => {
  return gulp
    .src([paths.src.css + '**/*.scss'])
    .pipe(prettier(prettierConfig, { filter: true }))
    .pipe(gulp.dest(file => file.base));
});

gulp.task(
  'stylelint',
  gulp.series('prettier-styles', () => {
    return gulp
      .src(paths.src.css + '**/*.scss')
      .pipe(plumber({ errorHandler: onError }))
      .pipe(
        postcss([stylelint(), reporter({ clearReportedMessages: true })], {
          syntax: postscss
        })
      );
  })
);

gulp.task(
  'styles',
  gulp.series('stylelint', () => {
    return gulp
      .src(paths.src.css + 'main.scss')
      .pipe(plumber({ errorHandler: onError }))
      .pipe(argv.env !== 'production' ? sourcemaps.init() : through2.obj())

      .pipe(sass({ outputStyle: 'expanded' }))
      .pipe(
        argv.env === 'production'
          ? postcss([
              autoprefixer,
              mqpacker({ sort: true }),
              cssnano({
                discardComments: {
                  removeAll: true
                }
              })
            ])
          : through2.obj()
      )
      .pipe(
        argv.env !== 'production'
          ? sourcemaps.write('.', {
              includeContent: false,
              sourceRoot: paths.src.css
            })
          : through2.obj()
      )
      .pipe(
        size({
          gzip: true,
          showFiles: true
        })
      )
      .pipe(gulp.dest(paths.dist.css))
      .pipe(browserSync.stream({ match: '**/*.css' }));
  })
);

// Twig
gulp.task('twig', () => {
  return gulp
    .src([
      paths.src.templates + '**/*/index.html',
      paths.src.templates + 'index.html'
    ])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(twig())
    .pipe(
      argv.env !== 'production'
        ? prettify({ indent_inner_html: true })
        : through2.obj()
    )
    .pipe(
      argv.env === 'production'
        ? htmlmin({ collapseWhitespace: true, removeComments: true })
        : through2.obj()
    )
    .pipe(gulp.dest(paths.dist.root));
});

gulp.task(
  'twig-watch',
  gulp.series('twig', done => {
    browserSync.reload();
    done();
  })
);

// Images
gulp.task('images', () => {
  return gulp
    .src(paths.src.images + '**/*.+(gif|jpg|jpeg|png|svg)')
    .pipe(newer(paths.dist.images))
    .pipe(
      imagemin(
        [
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [
              {
                cleanupAttrs: true,
                cleanupEnableBackground: true,
                cleanupIDs: true,
                cleanupListOfValues: false,
                cleanupNumericValues: true,
                collapseGroups: true,
                convertColors: true,
                convertPathData: true,
                convertShapeToPath: true,
                convertStyleToAttrs: true,
                convertTransform: true,
                inlineStyles: true,
                mergePaths: true,
                minifyStyles: true,
                moveElemsAttrsToGroup: true,
                moveGroupAttrsToElems: true,
                removeComments: true,
                removeDesc: true,
                removeDimensions: false,
                removeDoctype: true,
                removeEditorsNSData: true,
                removeEmptyAttrs: true,
                removeEmptyContainers: true,
                removeEmptyText: true,
                removeHiddenElems: true,
                removeMetadata: true,
                removeNonInheritableGroupAttrs: true,
                removeRasterImages: false,
                removeScriptElement: false,
                removeStyleElement: false,
                removeTitle: true,
                removeUnknownsAndDefaults: true,
                removeUnusedNS: true,
                removeUselessDefs: true,
                removeUselessStrokeAndFill: true,
                removeViewBox: false,
                removeXMLNS: false,
                removeXMLProcInst: true,
                sortAttrs: true
              }
            ]
          })
        ],
        { verbose: true }
      )
    )
    .pipe(gulp.dest(paths.dist.images));
});

// Static
gulp.task('static', () => {
  return gulp
    .src(copy, {
      base: paths.src.root
    })
    .pipe(gulp.dest(paths.dist.root));
});

// Clean
gulp.task('clean', () => {
  return del([`${paths.dist.root}/**/*`]);
});

// Build
gulp.task(
  'build',
  gulp.series(
    'clean',
    'static',
    'images',
    gulp.parallel('scripts-watch', 'styles', 'twig-watch')
  )
);

// Watch
gulp.task(
  'watch',
  gulp.series(
    'build',
    gulp.parallel('browserSync', () => {
      gulp
        .watch(paths.src.js + '**/*.js', gulp.series('scripts-watch'))
        .on('error', onError);
      gulp
        .watch(paths.src.css + '**/*.scss', gulp.series('styles'))
        .on('error', onError);
      gulp
        .watch(paths.src.templates + '**/*.html', gulp.series('twig-watch'))
        .on('error', onError);
      gulp.watch(
        paths.src.images + '**/*.+(gif|jpg|jpeg|png|svg)',
        gulp.series('images')
      );
    })
  )
);

// Default
gulp.task('default', () => {
  gulp.start('watch');
});
