# [Front](https://front.mosquito.digital)

Frontend build system for internal use.

## Getting Started

You'll need the following installed on your system, instructions available at each of their sites:

* [Node.js 10.14.2](https://nodejs.org/en/)
* [gulp-cli@2.0.1](http://gulpjs.com/)

Once your system is setup with the above, navigate to the cloned directory and install project dependencies:

```javascript
npm install
```

In ```package.json``` there is a list of base paths for source, build and distribution directories. By default it is setup for a static web build but you can change the paths as needed, for example to reflect a WordPress theme directory ```./public/wp-content/themes/mosquito/static```

## Project Tasks

The following Gulp task launches a local server via BrowserStack that will watch for any changes to your assets and automatically compile as well as refreshing your browser:

```javascript
npm run watch
```

You can compile any html templates, js, css and copy static assets by running the build script:

```javascript
npm run build
```

This will output a production ready build. It sets the Node environment to 'production' via ```NODE_ENV=production``` and minifies the compiled output. It also purges the current build folder and copies any assets in the static folder e.g. images, fonts etc. The included ```cross-env``` package ensures environment variables can be set on Windows.

Images added to the default path of ```src/static/images``` are automatically optimised and copied to the build directory. Any static assets, such as fonts, that need to be moved to the build directory can set in the ```const copy``` array in ```gulpfile.babel.js``` using the following task

```javascript
npm run static
```

As the build folder contents will become outdated with updates it's a good idea to purge everything periodically so you're working from a clean slate. To do this run the following task to delete everything in the ```build``` directory.

```javascript
npm run clean
```

Make sure to then run the build task to rebuild all the required assets.

## Prettier

When watching the project JavaScript and SASS are formatted on save by [Prettier](https://prettier.io/). This means you can write in whatever way you are used to but what is committed to the codebase will be consistent and somewhat unopinionated as there are only a few options that can be configured.

## Linting

Before compilation JavaScript is linted by the package ESLint using the config ```eslint-config-prettier```. Any linting errors must be fixed before the bundle will compile successfully.

CSS is also linted via stylelint in the same manner as above by running the following lint script:

```javascript
npm run lint
```

* [ESLint](https://eslint.org/)
  * [Rules](https://eslint.org/docs/rules/)
* [Prettier](https://prettier.io/)
  * [Editor Integration](https://prettier.io/docs/en/editors.html)
* [stylelint](https://stylelint.io/)
  * [Rules](https://stylelint.io/user-guide/rules/)

## Testing

[Mocha](https://mochajs.org/) testing framework and the [Chai](http://chaijs.com/) assertion library are included in the boilerplate.

There are a number of example tests covering the generic library functions ```src/scripts/functions/*.js```

```javascript
npm run test
```

* [Ultimate Unit Testing Cheatsheet](https://gist.github.com/yoavniran/1e3b0162e1545055429e)

## Browser Compatibility

The last 2 major releases of the following browsers are to be supported by default unless project has a specific requirement with the exception on Internet Explorer. [Autoprefixer](https://github.com/postcss/autoprefixer) and [@babel-poyfill](https://babeljs.io/docs/en/babel-polyfill) are used to ensure consistency between older and modern browsers:

* Chrome (+ any Chromium based browser)
* Safari
* Firefox
* Edge
* Internet Explorer 11
