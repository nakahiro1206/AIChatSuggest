const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "src");

module.exports = {
  target: "node", 
  entry: {
    popup: path.join(srcDir, 'popup.tsx'),
    service_worker: path.join(srcDir, 'service_worker.ts'),
    offscreen: path.join(srcDir, 'offscreen.ts'),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
          test: /\.ts$|tsx/,
          use: "ts-loader",
          exclude: /node_modules/,
      },
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx",".ts",".js",".jsx","json"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./public/icon.png" },
        { from: "./public/manifest.json" },
        { from: "./public/popup.html" },
        { from: "./public/offscreen.html" }
      ],
    }), 
  ],
  externals: [
    {
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    },
    { canvas: {} }
  ],
};