import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"


import path from 'path'
import webpack from 'webpack'

import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

import { getMainContainer } from "./inversify.config"
import { ChannelWebService } from './src/service/web/channel-web-service'
import { ChannelService } from "./src/service/channel-service"
import { CHUNK_SIZE } from "./src/repository/item-repository"

let configs = []

export default async () => {

  let container = getMainContainer()

  let channelWebService:ChannelWebService = container.get(ChannelWebService)
  let channelService:ChannelService = container.get(ChannelService)

  let channel = await channelService.get()


  let pages = Math.ceil(channel.itemCount / CHUNK_SIZE)

  let plugins = []


  let channelViewModel = await channelWebService.get(0)

  //Build home page
  plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      title: channelViewModel.channel.title,
      // favicon: 'src/html/favicon.ico',
      template: 'src/html/index.ejs',
      filename: 'index.html',
      channelViewModel: channelViewModel,
    })
  )


  //Build pages for navigation
  for (let i=0; i < pages; i++) {

    let channelViewModel = await channelWebService.get(i * CHUNK_SIZE)

    plugins.push(

      new HtmlWebpackPlugin({
        inject: false,
        title: channelViewModel.channel.title,
        // favicon: 'src/html/favicon.ico',
        template: 'src/html/pages/list.ejs',
        filename: `list-${i+1}.html`,
        channelViewModel: channelViewModel,
      })
    
    )
  }


  const fileLoader = {
    loader: 'file-loader',
    options: {
      name: '[folder]/[name].[ext]'
    }
  }
  
  let readerConfig = {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: '/node_modules/',
          loader: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot)$/,
          use: [fileLoader],
        },
        {
          test: /\.(ttf|woff|woff2)$/,
          use: {
            loader: 'url-loader',
            options: {
              name: '[folder]/[name]'
            }
          },
        },
        {
          test: /\.f7.html$/,
          use: ['framework7-loader'],
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
      alias: {
        buffer: 'buffer',
        process: 'process/browser'
      },
      fallback: { 
        "path": require.resolve("path-browserify"),
        "util": require.resolve("util/"),
        "assert": require.resolve("assert/"),
        "stream": require.resolve("stream-browserify")
      }
    },
    output: {
      filename: 'js/[name].reader.js',
      library: "reader",
      path: path.resolve(__dirname, 'public')
    },
    optimization: {
      usedExports: true,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
  
        }
      }
    },
    plugins: [
  
      new CleanWebpackPlugin({
        dangerouslyAllowCleanPatternsOutsideProject: true
      }),
  
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
  
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
  
      new webpack.ProvidePlugin({
        fetch: ['node-fetch', 'default'],
      }),

      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require("./package.json").version)
      }),

      ...plugins,
  
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
  
      new HTMLInlineCSSWebpackPlugin(),
  
  
      new CopyWebpackPlugin({
        patterns: [
            { from: './backup', to: 'backup' }
        ]
      })
    ]
  }

  let serviceWorkerConfig = {
    entry: './src/sw.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: '/node_modules/',
          loader: 'ts-loader',
        }
      ],
    },
    output: {
      filename: 'sw.js',
      path: path.resolve(__dirname, 'public')
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require("./package.json").version)
      })
    ]
  }

  
  configs.push(serviceWorkerConfig)
  configs.push(readerConfig)

  return configs
}
