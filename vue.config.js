/* eslint-disable */
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,

    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            //将需要忽略打包的都写在这个里面，但前提是index.html文件里面必须script引入
        }
    },

    pages: {
        index: {
            // page 的入口
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
        host: '0.0.0.0',
        // host: '127.0.0.1',
        // host: '122.51.184.120',
        port: 8010,
        proxy: {
            '/api/': {
                target: 'http://0.0.0.0:8081',
                // target: 'http://127.0.0.1:8081',
                // target: 'http://172.17.0.16:8080',
                // target: 'http://122.51.184.120',
                changeOrigin: true,
            }
        },
    },
    css: {
        loaderOptions: {
            // 设置 scss 公用变量文件
            sass: {
                data: `@import '~@/assets/css/color.scss';`
            }
        }
    },
}