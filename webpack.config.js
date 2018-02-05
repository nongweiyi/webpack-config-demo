var webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    // 配置入口
    entry: {
        about: './src/pages/about/about.js',
        contact: './src/pages/contact/contact.js'
    },
    // 配置出口
    output: {
        path: __dirname + "/dist/",
        filename: 'js/[name]-[hash:5].js',
        publicPath: '/',
    },

    module: {
        loaders: [
            //解析.js
            {
                test: '/\.js$/',
                loader: 'babel',
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, 'src'),
                query: {
                    presets: ['env']
                }
            },
            // css处理
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'

            },
            // less处理
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            // 图片处理
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',

                query: {
                    name: 'assets/[name]-[hash:5].[ext]'
                },
            },{
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(__dirname + '/assert/css/common.less'),

        new UglifyJsPlugin(),//压缩js
       //压缩css
       new OptimizeCssAssetsPlugin({
           assetNameRegExp: /\.optimize\.css$/g,
           cssProcessor: require('cssnano'),
           cssProcessorOptions: { discardComments: {removeAll: true } },
           canPrint: true
         }),
        new HtmlWebpackPlugin({
            filename: __dirname + '/dist/about.html',
            inject: 'head',
            template: 'html-withimg-loader!'+__dirname + "/src/pages/about/about.html",
            chunks: ['about'],
            inlineSource: '.(js|css)$',
             minify:{
                removeComments: true,//删除注释
                collapseWhitespace:true//删除空格
            }
        }),
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: __dirname + '/dist/contact.html',
            template: __dirname + "/src/pages/contact/contact.html",
            chunks: ['contact'],
            inlineSource: '.(js|css)$',
            minify:{
               removeComments: true,//删除注释
               collapseWhitespace:true//删除空格
           }
        }),
        //设置每一次build之前先删除dist
        new CleanWebpackPlugin(
            ['dist/*', 'dist/*',],　     //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        )
    ],
    // 起本地服务，我起的dist目录
    devServer: {
        contentBase: "./dist/",
        historyApiFallback: true,
        inline: true,
        hot: true,
        host: '192.168.1.107',//我的局域网ip
    }
}
