import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'

import CollectionPage from '@/pages/collection/collection-page/CollectionPage.vue'
import SearchPage from '@/pages/search/search-page/SearchPage.vue'

const options: RouterOptions = {
    history: createWebHistory(),
    routes: [
        {
            name: 'collection',
            path: '/collection',
            component: CollectionPage,
        },
        {
            name: 'search',
            path: '/search',
            component: SearchPage,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/search',
        },
    ],
}

export default createRouter(options)
