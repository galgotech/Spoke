// Variables in .env and .env.defaults will be added to process.env
const dotenv = require("dotenv");

dotenv.config({ path: ".env." + process.env.NODE_ENV });
dotenv.config({ path: ".env.defaults" });

const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const TerserJSPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = env => {
  return {
    entry: {
      entry: ["./src/index.js"]
    },

    devtool: process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map",

    devServer: {
      historyApiFallback: true,
      port: 8080,
      injectClient: false,
      host: "0.0.0.0",
      public: "localhost:8080",
      publicPath: process.env.BASE_ASSETS_PATH,
      useLocalIp: true,
      allowedHosts: ["localhost"],
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    },

    output: {
      filename: "assets/js/[name]-[chunkhash].js",
      publicPath: process.env.BASE_ASSETS_PATH
    },

    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif|svg)(\?.*$|$)/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "assets/images"
            }
          }
        },
        {
          test: /\.(woff|woff2|ttf|eot)(\?.*$|$)/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "assets/fonts"
            }
          }
        },
        {
          test: /\.(glb)(\?.*$|$)/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "assets/models"
            }
          }
        },
        {
          test: /\.(gltf)(\?.*$|$)/,
          use: {
            loader: "gltf-webpack-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "assets/models"
            }
          }
        },
        {
          test: /\.(bin)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name]-[hash].[ext]",
                outputPath: "assets/models"
              }
            }
          ]
        },
        {
          test: /\.(mp4|webm)(\?.*$|$)/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "assets/videos"
            }
          }
        },
        {
          test: /\.(spoke)(\?.*$|$)/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name]-[hash].[ext]",
              outputPath: "assets/templates"
            }
          }
        },
        {
          test: /\.js$/,
          include: path.join(__dirname, "src"),
          use: "babel-loader"
        },
        {
          test: /\.worker\.js$/,
          include: path.join(__dirname, "src"),
          loader: "worker-loader",
          options: {
            // Workers must be inlined because they are hosted on a CDN and CORS doesn't permit us
            // from loading worker scripts from another origin. To minimize bundle size, dynamically
            // import a wrapper around the worker. See SketchfabZipLoader.js and API.js for an example.
            name: "assets/js/workers/[name]-[hash].js",
            inline: true,
            fallback: false
          }
        },
        {
          test: /\.wasm$/,
          type: "javascript/auto",
          use: {
            loader: "file-loader",
            options: {
              outputPath: "assets/js/wasm",
              name: "[name]-[hash].[ext]"
            }
          }
        }
      ]
    },

    target: "web",
    node: {
      __dirname: false,
      fs: "empty",
      Buffer: false,
      process: false
    },

    optimization: {
      minimizer: [new TerserJSPlugin({ sourceMap: true, parallel: true, cache: path.join(__dirname, ".tersercache") })]
    },

    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: env && env.BUNDLE_ANALYZER ? "server" : "disabled"
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(
            __dirname,
            "src",
            "assets",
            process.env.IS_MOZ === "true" ? "favicon-spoke.ico" : "favicon-editor.ico"
          ),
          to: "assets/images/favicon.ico"
        }
      ]),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, "src", "assets", "favicon-spoke.ico"),
          to: "assets/images/favicon-spoke.ico"
        }
      ]),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, "src", "assets", "favicon-editor.ico"),
          to: "assets/images/favicon-editor.ico"
        }
      ]),
      new HTMLWebpackPlugin({
        template: path.join(__dirname, "src", "index.html"),
        faviconPath: (process.env.BASE_ASSETS_PATH || "/") + "assets/images/favicon.ico"
      }),
      new webpack.EnvironmentPlugin({
        BUILD_VERSION: "dev",
        NODE_ENV: process.env.NODE_ENV,
        RETICULUM_SERVER: process.env.RETICULUM_SERVER,
        THUMBNAIL_SERVER: process.env.FARSPARK_SERVER,
        HUBS_SERVER: process.env.HUBS_SERVER,
        CORS_PROXY_SERVER: process.env.CORS_PROXY_SERVER,
        BASE_ASSETS_PATH: process.env.BASE_ASSETS_PATH,
        NON_CORS_PROXY_DOMAINS: process.env.NON_CORS_PROXY_DOMAINS,
        ROUTER_BASE_PATH: process.env.ROUTER_BASE_PATH,
        SENTRY_DSN: process.env.SENTRY_DSN,
        GA_TRACKING_ID: process.env.GA_TRACKING_ID,
        IS_MOZ: process.env.IS_MOZ
      })
    ]
  };
};
