const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';
console.log(isProduction, process.env.NODE_ENV)

module.exports = {
  mode: 'production',
  entry: './public/css/main.css', // Entry point to your main CSS file
  output: {
    path: path.resolve(__dirname, 'public/css'),
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Match CSS files
        use: [
          // isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'  // This handles TailwindCSS and Autoprefixer
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',  // Output filename for the extracted CSS
    }),
  ],
  devtool: false,
  watch: false, // Watch for changes in development mode
};
