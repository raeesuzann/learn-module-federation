// home-app/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
// import ModuleFederationPlugin from webpack
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
// import dependencies from package.json, which includes react and react-dom
const { dependencies } = require("./package.json");
const path = require("path");

module.exports = {
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.js",
  },
  mode: "development",
  devServer: {
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "HomeApp", // This application named 'HomeApp'
      // This is where we define the federated modules that we want to consume in this app.
      // Note that we specify "Header" as the internal name
      // so that we can load the components using import("Header/").
      // We also define the location where the remote's module definition is hosted:
      // Header@[http://localhost:3001/remoteEntry.js].
      // This URL provides three important pieces of information: the module's name is "Header", it is hosted on "localhost:3001",
      // and its module definition is "remoteEntry.js".
      remotes: {
        HeaderApp: "HeaderApp@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        ...dependencies, // other shared dependencies
        react: {
          singleton: true,
          requiredVersion: dependencies["react"],
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
      manifest: "./public/manifest.json"
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  target: "web",
};
