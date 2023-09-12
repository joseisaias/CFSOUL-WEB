/* eslint-disable */
var webpack = require("webpack");

module.exports = {

    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
    ],
};
