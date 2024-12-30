module.exports = {
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Service Swicth',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      {
        hid: "og:site_name",
        name: "og:site_name",
        content: "Service Swicth"
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/image-icon.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#61d4ae', height: '10px', throttle: 0, continuous: true },
  /*
  ** Global CSS
  */
  css: [
    'quill/dist/quill.core.css',
    // for snow theme
    'quill/dist/quill.snow.css',
    'assets/main.scss',
    'assets/custom.scss',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/nuxt-quill-plugin', ssr: false },
    { src: '~plugins/infinitescroll.js', ssr: false },
    '~plugins/filters.js',
    '~/plugins/simplee_api.js',
    '~/plugins/font-awesome.js',
    '~/plugins/vue-websockets.client.js',
    '~/plugins/nav-notifications.client.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/pwa',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-vuex-localstorage',
    'bootstrap-vue/nuxt'
  ],

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    progress: true
  },
  /*
  ** Build configuration
  */
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: falsee`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  build: {
    postcss: null,
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  server: {
    port: process.env.PORT || 8000
  },
  env: {
    apiUrl: process.env.NUXT_ENV_API_URL || 'https://api.dev.simplee.cl/api/',
    leadSocketUrl: process.env.NUXT_ENV_LEAD_SOCKET_URL || 'wss://api.dev.simplee.cl/ws/lead/',
    version: process.env.VERSION || 'CL'
  },
  telemetry: false
}
