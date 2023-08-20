const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: '/mis/',
  transpileDependencies: true,
  runtimeCompiler: true,

  pluginOptions: {
    i18n: {
      locale: "ru",
      fallbackLocale: "ru",

    }
  }


}
