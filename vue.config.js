const CleanWebpackPlugin = require('clean-webpack-plugin');

const pages = {
    ripples: {
        entry: 'src/index.js'
    }
}

module.exports = {
    chainWebpack: config => {
        // Prevent html generation of index
        config.plugins.delete('html')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')

        // Prevent html generation of pages
        Object.keys(pages).forEach(page => {
            config.plugins.delete(`html-${page}`)
            config.plugins.delete(`preload-${page}`)
            config.plugins.delete(`prefetch-${page}`)
        })

        // Expose @knekk/ripples version
        config.plugin('define')
            .tap(args => {
                args[0]['process.env']['VERSION'] = JSON.stringify(require('./package.json').version)
                return args
            })
    },
    configureWebpack: {
        optimization: {
            splitChunks: false
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: process.env.NODE_ENV === 'production' ? ['./js/*'] : []
            }),
        ]
    },
    filenameHashing: false,
    pages,
    productionSourceMap: false
}