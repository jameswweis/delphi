export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: "Science Scaling Explore",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src: "https://kit.fontawesome.com/8f002c5339.js",
        defer: true,
        crossorigin: "anonymous"
      }
    ]
  },
  /*
   ** Add Custom Env Variables
   */
  env: {
    COLLECTION_NAME: process.env.COLLECTION_NAME || "papers-prod-2"
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // "~/plugins/firebase.js",
    // "~plugins/vue-instantsearch"
    // "~/plugins/axios.js"
    "~/plugins/vue-mq.js",
    "~/plugins/vue-tour.js"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    "@nuxtjs/bulma",
    "@nuxtjs/pwa"
  ],

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend() {}
  },
  pwa: {
    manifest: {
      name: "Science Scaling Explore",
      short_name: "SSE",
      lang: "en-US",
      start_url: "/",
      orientation: "portrait",
      theme_color: "#3298dc",
      background_color: "#FFF"
    }
  }
};
