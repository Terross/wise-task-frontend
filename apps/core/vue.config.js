const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
    configureWebpack: {
        performance: {
            hints: process.env.NODE_ENV === 'production' ? 'warning' : false
        }
    },
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }

  
})
