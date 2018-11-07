/*
 * load plugins
 */

// package lets
const pkg = require('./package.json')

// gulp
const gulp = require('gulp')

// load all plugins in "devDependencies" into the letiable $
const $ = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies']
})

const onError = err => {
  console.log(err)
}

/*
 * clean
 */

gulp.task('clean', () => {
  return $.del(['**/.DS_Store', pkg.paths.build.base + '*'])
})

/*
 * scripts
 */

gulp.task('scripts', () => {
  return gulp
    .src([pkg.paths.src.js + 'index.js'])
    .pipe(
      $.webpackStream({
        module: {
          loaders: [
            {
              test: /.jsx?$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              query: {
                presets: ['env']
              }
            },
            {
              test: /\.json$/,
              loader: 'json-loader'
            }
          ]
        },
        plugins: [
          new $.webpackStream.webpack.optimize.UglifyJsPlugin({
            minimize: false,
            sourceMap: true,
            compress: {
              warnings: false
            }
          }),
          new $.webpackStream.webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./package.json').version)
          })
        ],
        devtool: 'source-map',
        entry: {
          index: [pkg.paths.src.js + 'index.js']
        },
        output: {
          filename: '[name].js',
          publicPath: pkg.paths.public
        }
      })
    )
    .pipe(gulp.dest(pkg.paths.build.js))
    .pipe($.browserSync.stream({ once: true }))
    .pipe($.notify({ message: 'Scripts task complete', onLast: true }))
})

/*
 * styles
 */

let processors = [$.autoprefixer(), $.cssMqpacker()]

let cssNanoOpts = {
  minifySelectors: false,
  reduceIdents: false,
  zindex: false
}

let browserSyncOpts = {
  stream: true
}

let cssNotifyOpts = {
  message: 'Styles task complete',
  onLast: true
}

gulp.task('styles', () => {
  return gulp
    .src([pkg.paths.src.css + '*.scss'])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.sourcemaps.init())
    .pipe($.sassGlob())
    .pipe($.sass())
    .pipe($.postcss(processors))
    .pipe($.cssnano(cssNanoOpts))
    .pipe($.sourcemaps.write('maps'))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(pkg.paths.build.css))
    .pipe($.browserSync.reload(browserSyncOpts))
    .pipe($.notify(cssNotifyOpts))
})

/*
 * browser sync task
 */

gulp.task('browser-sync', function() {
  let files = ['**/*.html']

  $.browserSync.init(files, {
    injectChanges: true,
    server: {
      baseDir: './'
    }
  })
})

/*
 * default task
 */

gulp.task('default', callback => {
  $.runSequence('clean', ['scripts', 'styles', 'browser-sync'], () => {
    gulp.watch([pkg.paths.src.base + '{,*/}{,*/}*.js'], ['scripts'])
    gulp.watch([pkg.paths.src.css + '{,*/}{,*/}*.scss'], ['styles'])
  })
})
