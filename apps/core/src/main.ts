/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
// Components
import App from './App.vue'

// Composables
import { createApp,  h } from 'vue'

// Apollo
import { provideApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache({addTypename: false})

const apolloClient = new ApolloClient({
  cache,
  uri: 'http://localhost:8084/graphql',
})

const app = createApp({
    setup () {
      // provide(DefaultApolloClient, apolloClient), ??? creating 2 requests instead of 1
      provideApolloClient(apolloClient)
    },
  
    render: () => h(App),
  })

registerPlugins(app)

app.mount('#app')
