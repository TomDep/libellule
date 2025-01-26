<template>
    <div class="cover"></div>
    <div class="d-flex flex-column flex-1">
        <router-link to="/collection/album/1">
            {{ result.name }}
            {{ result.id }}
            {{ pathToCollection }}
        </router-link>

        <div class="d-flex body-medium on-surface-variant-text">
            <router-link v-for="(artist, index) of result.artists" :key="index" to="/collection">
                <span v-if="index > 0" class="mr-1">,</span>
                <a> {{ artist.name }} {{ artist.id }} </a>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { SearchResultSong } from '@/api'
import { onBeforeMount, ref } from 'vue'

const props = defineProps<{
    result: SearchResultSong
}>()

const pathToCollection = ref('')

onBeforeMount(async () => {
    const albumId = await window.api.fetchSongAlbumId(props.result.id)
    pathToCollection.value = `/collection/album/${albumId}`
})
</script>

<style scoped>
.cover {
    background-color: rgb(var(--mdui-color-surface-container-low));
    aspect-ratio: 1 / 1;
    height: 48px;
    border-radius: 8px;
}
</style>
