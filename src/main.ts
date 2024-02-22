/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp, provide, h } from 'vue'

// Apollo
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
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
