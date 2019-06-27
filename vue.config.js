/* eslint-disable */
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,

    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'src/index.html',
            favicon:'src/assets/favicon.ico',
            // 在 dist/index.html 的输出
            // filename: 'src/index.html',
            // 当使用 title 选项时，

        },

    },
    devServer: {
        host: '127.0.0.1',
        // host: '192.168.0.106',
        // host: '47.107.147.188',
        port: 8010,
        proxy: {
            '/api/': {
                target: 'http://127.0.0.1:8080',
                // target: '192.168.0.106:8080',
                // target: 'http://172.18.2.200:8080',
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