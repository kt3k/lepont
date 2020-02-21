module.exports = {
  entry: {
    index: './src/index.ts',
    browser: './src/browser.ts'
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }]
  },
  externals: {
    react: { commonjs: 'react' }
  }
}
