const Path = require("path")


module.exports = {
    output: {
        filename: '[name].js',
        path: Path.resolve(__dirname, './dist/umd'),
        library: 'ToloGameDev',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    entry: { index: Path.resolve(__dirname, './dist/esm/index.js') },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.wasm'],
        enforceExtension: false
    },
    devtool: 'source-map',
    externals: ["react"],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'styleTag'
                        }
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif|webp)$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "img/[name].[contenthash].[ext]"
                }
            },
            {
                test: /\.(frag|vert)$/,
                loader: "raw-loader"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
                options: {
                    name: "fnt/[contenthash].[ext]"
                }
            },
            {
                test: /\.ya?ml$/,
                type: 'json',
                use: 'yaml-loader'
            }
        ],
    },
}