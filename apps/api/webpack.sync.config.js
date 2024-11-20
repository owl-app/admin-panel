const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/app/database/seeder.ts',
      tsConfig: './tsconfig.app.json',
      optimization: false,
      outputHashing: 'none',
    }),
  ],
};
