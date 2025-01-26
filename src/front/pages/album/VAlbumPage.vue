<template>
    <div>
        {{ album?.name }}
        {{ album?.artist.name }}
    </div>
</template>

<script lang="ts" setup>
import { Album } from '@/api'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const album = ref<Album | null>(null)

onBeforeMount(async () => {
    const albumId = Number(route.params.id)
    if (albumId) {
        album.value = await window.api.fetchAlbum(albumId)
        console.log(album.value)
    }
})
</script>

<style lang="scss" scoped></style>
