/* eslint-disable */
// const isDev = process.env.NODE_ENV !== 'production'
// console.log(isDev)
// console.log(process.env)
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,
    //
    // configureWebpack: {
    //     externals: {
    //         'vue': 'Vue',
    //         'element-ui': 'ELEMENT',
    //         //将需要忽略打包的都写在这个里面，但前提是index.html文件里面必须script引入
    //     }
    // },

    pages: {
        index: {
            // components 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            favicon: 'public/favicon.ico',
            assetsDir: "src/assets",
            // 在 dist/index.html 的输出
            // filename: 'src/index.html',
            // 当使用 title 选项时，

        },

    },
    devServer: {
        // host: '0.0.0.0',
        // host:'80.167.39.13',
         host: '127.0.0.1',

        // host: '122.51.184.120',
        // host:'10.100.2.45',

        port: 8020,
        proxy: {
            '/api/': {
                // target:process.env.NODE_ENV === 'production' ? 'http://172.20.0.2:8091' : 'http://0.0.0.0:8091',
                // target: 'http://122.51.184.120',
                target: 'http://127.0.0.1:8091',
                // target: 'http://172.17.0.16:8091',

                // target: 'http://172.16.11.228:8081',

                changeOrigin: true,
            }
        },
    },
    css: {
        loaderOptions: {
            // 设置 scss 公用变量文件
            sass: {
                prependData: `@import '~@/assets/css/color.scss';`
            }
        }
    },
}