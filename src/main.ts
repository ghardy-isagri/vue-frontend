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
import apolloClient from './services/apolloClient' // Apollo client instance
import { createApp } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient) // Provide Apollo Client to the app
registerPlugins(app)

app.mount('#app')
