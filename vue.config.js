const { defineConfig } = require('@vue/cli-service')
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? '/mis/' : "/",
  transpileDependencies: true,
  runtimeCompiler: true,

  pluginOptions: {
    i18n: {
      locale: "ru",
      fallbackLocale: "ru",

    }
  }


}
