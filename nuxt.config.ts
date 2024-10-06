// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  devServer: {
    host: "0.0.0.0",
    https: {
      cert: './localhost.crt',
      key: './localhost.key'
    }
  }
})
