import '@/styles/main.scss'
import 'vuetify/styles'

import { useDark } from '@vueuse/core'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import type { VDataTable } from 'vuetify/lib/components/index.mjs'

import '@mdi/font/css/materialdesignicons.css'
import { md3 } from 'vuetify/blueprints'

export type DataTableHeaders = InstanceType<typeof VDataTable>['$props']['headers']

export default createVuetify({
    components,
    directives,
    blueprint: md3,
    theme: {
        defaultTheme: useDark() ? 'dark' : 'light',
    },
    icons: {
        defaultSet: 'mdi',
    },
})
