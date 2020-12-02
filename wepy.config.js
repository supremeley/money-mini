const path = require('path')
var prod = process.env.NODE_ENV === 'production'

module.exports = {
  wpyExt: '.vue',
  eslint: true,
  cliLogs: !prod,
  static: ['static'],
  build: {},
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    aliasFields: ['wepy', 'weapp'],
    modules: ['node_modules']
  },
  compilers: {
    less: {
      compress: prod
    },
    sass: {
      // file: 'src/style/variable.scss',
      outputStyle: 'compressed'
    },
    babel: {
      sourceMap: true,
      presets: ['@babel/preset-env'],
      plugins: ['@wepy/babel-plugin-import-regenerator']
    }
  },
  plugins: [],
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}
