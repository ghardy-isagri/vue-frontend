/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins

// Components
import App from './App.vue'

// Composables
import apolloClient from './services/apolloClient' // Apollo client instance
import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { registerPlugins } from './plugins'
import Vuetify from './plugins/vuetify'

const app = createApp(App)
app.use(Vuetify)
app.provide(DefaultApolloClient, apolloClient) // Provide Apollo Client to the app
registerPlugins(app)

app.mount('#app')
