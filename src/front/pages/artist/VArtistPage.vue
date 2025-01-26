<template>
    <div class="d-flex w-80 gap-6 flex-column">
        <VArtistHeader :artist="artist" />
        <mdui-tabs placement="top" value="albums">
            <mdui-tab value="albums">Albums</mdui-tab>
            <mdui-tab value="songs">Songs</mdui-tab>
            <mdui-tab value="liked">Liked songs</mdui-tab>
            <mdui-tab value="playlists">Playlists</mdui-tab>

            <mdui-tab-panel slot="panel" value="albums">
                <VArtistAlbumPreviews :album-previews="albumPreviews" />
            </mdui-tab-panel>
            <mdui-tab-panel slot="panel" value="songs">Panel 2</mdui-tab-panel>
            <mdui-tab-panel slot="panel" value="liked">Panel 3</mdui-tab-panel>
            <mdui-tab-panel slot="panel" value="playlists">Panel 3</mdui-tab-panel>
        </mdui-tabs>
    </div>
</template>

<script lang="ts" setup>
import { AlbumPreview, Artist } from '@/api'
import VArtistAlbumPreviews from '@/front/pages/artist/artist-album-previews'
import VArtistHeader from '@/front/pages/artist/artist-header'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const artist = ref<Artist | null>(null)
const albumPreviews = ref<AlbumPreview[] | null>(null)

onBeforeMount(async () => {
    const artistId = Number(route.params.id)
    if (!artistId) {
        return
    }

    artist.value = await window.api.fetchArtist(artistId)
    albumPreviews.value = await window.api.fetchArtistAlbumPreviews(artistId)
})
</script>

<style lang="scss" scoped></style>
