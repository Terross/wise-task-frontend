import { createApp, provide, h } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { loadFonts } from './plugins/webfontloader'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  cache,
  uri: 'http://localhost:8084/graphql',
})

const theme: ThemeDefinition = {
  "dark": false,
  "colors": {
    "background": "#F5F5F5",
    "surface": "#FFFFFF",
    "primary": "#50A6FF",
    "secondary": "#E6E9FF",
    "error": "#F44336",
    "info": "#2196F3",
    "success": "#4CAF50",
    "warning": "#FFC107",
    "on-background": "#212121",
    "on-surface": "#212121"
  }
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'theme',
    themes: {
      theme,
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  components,
  directives
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient),
    provideApolloClient(apolloClient)
  },

  render: () => h(App),
})

app
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount('#app')
