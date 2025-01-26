<template>
    <div class="d-flex flex-column align-center pa-4 gap-4 w-80">
        <VAlbumHeader :album="album" />

        <div class="d-flex flex-column gap-2 w-100">
            <VSongListItem
                v-for="(song, index) of album?.songs"
                :key="index"
                :index="index + 1"
                :song="song"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Album } from '@/api'
import VSongListItem from '@/front/components/song-list-item'
import VAlbumHeader from '@/front/pages/album/album-header'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const album = ref<Album | null>(null)

onBeforeMount(async () => {
    const albumId = Number(route.params.id)
    console.log(albumId)

    if (albumId) {
        album.value = await window.api.fetchAlbum(albumId)
    }
})
</script>

<style lang="scss" scoped></style>
