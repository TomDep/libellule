import { createApp, type Plugin } from 'vue'

import App from './App.vue'
const app = createApp(App)

import 'normalize.css'

import 'mdui/mdui.css'
import 'mdui'

import '@/front/styles/main.scss'
import '@fontsource/roboto'

import { setColorScheme } from 'mdui/functions/setColorScheme.js'
setColorScheme('#ff0000')

Object.values(
    import.meta.glob<Plugin>('./plugins/*.ts', {
        eager: true,
        import: 'default',
    }),
).forEach((v) => app.use(v))

app.mount('#app')
