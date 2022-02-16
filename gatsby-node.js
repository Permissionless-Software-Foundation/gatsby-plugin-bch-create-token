/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
// You can delete this file if you're not using it

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.org/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
exports.onPreInit = () => console.log('Loaded gatsby-starter-plugin')
// const path = require('path')
const webpack = require('webpack')
exports.onCreateWebpackConfig = ({ stage, actions, getConfig, plugins }) => {
  // console.log('stage', stage)
  // console.log('actions', actions)
  // console.log('getConfig', getConfig)

  // https://webpack.js.org/configuration/resolve/
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        http: require.resolve('stream-http'),
        zlib: require.resolve('browserify-zlib'),
        https: require.resolve('https-browserify'),
        process: require.resolve('process/browser'),
        assert: require.resolve('assert')
      },
      alias: {
        process: 'process/browser'
      }
    }
  })

  // Ignore css order
  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }

    // Create new webpack plugins for resolve 'process/browser'
    // and buffer/Buffer
    const processPlugin = new webpack.ProvidePlugin({
      process: 'process/browser'
    })
    const bufferPlugin = new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })

    // Add plugins to webpack plugins array
    config.plugins.push(processPlugin)
    config.plugins.push(bufferPlugin)

    // Save the new config
    actions.replaceWebpackConfig(config)
  }
}
