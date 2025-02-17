import VAlbumPage from '@/front/pages/album'
import VArtistPage from '@/front/pages/artist'
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
            name: 'album',
            path: '/collection/album/:id',
            component: VAlbumPage,
        },
        {
            name: 'artist',
            path: '/collection/artist/:id',
            component: VArtistPage,
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
