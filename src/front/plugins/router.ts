import { createRouter, createWebHistory, type RouterOptions } from 'vue-router'

import VCollectionPage from '@/front/pages/collection/collection-page/VCollectionPage.vue'
import VSearchPage from '@/front/pages/search/search-page/VSearchPage.vue'

const options: RouterOptions = {
    history: createWebHistory(),
    routes: [
        {
            name: 'collection',
            path: '/collection',
            component: VCollectionPage,
        },
        {
            name: 'search',
            path: '/search',
            component: VSearchPage,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/search',
        },
    ],
}

export default createRouter(options)
