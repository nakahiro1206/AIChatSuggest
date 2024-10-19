const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "src");

module.exports = {
  mode: "development",
  target: "node", 
  entry: {
    popup: path.join(srcDir, 'popup.tsx'),
    // background: path.join(srcDir, 'background.ts'),
    // content_script: path.join(srcDir, 'content_script.tsx'),
    service_worker: path.join(srcDir, 'scrapeProfile.ts'),
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
          // options: {
          //   presets: ["@babel/preset-env", "@babel/preset-react"],
          // },
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
    // new HtmlWebpackPlugin({
    //   template: "./public/popup.html",
    //   filename: "popup.html",
    // }),
    new CopyPlugin({
      patterns: [{ from: "./public" }],
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