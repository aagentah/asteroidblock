import '@babel/polyfill';
import TerserPlugin from 'terser-webpack-plugin';

import { paths } from './src/config/paths';

const configureBabelLoader = browserlist => {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          [
            '@babel/preset-env',
            {
              debug: false,
              modules: false,
              useBuiltIns: 'usage',
              targets: {
                browsers: browserlist
              }
            }
          ]
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import']
      }
    }
  };
};

const baseConfig = {
  mode: 'development',
  output: {
    filename: '[name].js',
    publicPath: '/static/scripts/'
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['.js'],
    modules: ['src/static/scripts', 'node_modules']
  },
  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: {
      // CommonsChunkPlugin()
      name: 'vendor',
      chunks: 'all'
      // minChunks: 2
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true // ModuleConcatenationPlugin
  }
};

if (process.env.NODE_ENV === 'production') {
  baseConfig.mode = 'production';
  baseConfig.optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        mangle: true,
        ie8: false
      }
    })
  ];
}

const modernConfig = Object.assign({}, baseConfig, {
  entry: {
    bundle: paths.webpack.entry.bundle
  },
  module: {
    rules: [
      configureBabelLoader([
        // The last two versions of each browser, excluding versions
        // that don't support <script type="module">
        'last 2 Chrome versions',
        'not Chrome < 60',
        'last 2 Safari versions',
        'not Safari < 10.1',
        'last 2 iOS versions',
        'not iOS < 10.3',
        'last 2 Firefox versions',
        'not Firefox < 54',
        'last 2 Edge versions',
        'not Edge < 15'
      ])
    ]
  }
  // plugins: configurePlugins({ runtimeName: 'runtime' })
});

const legacyConfig = Object.assign({}, baseConfig, {
  entry: {
    bundle: paths.webpack.entry.bundle
  },
  module: {
    rules: [configureBabelLoader(['> 1%', 'last 2 versions'])]
  }
  // plugins: configurePlugins({ runtimeName: 'runtime-legacy' })
});

// Output based on NODE_ENV

const config =
  process.env.NODE_ENV === 'production' ? legacyConfig : modernConfig;

module.exports = config;
