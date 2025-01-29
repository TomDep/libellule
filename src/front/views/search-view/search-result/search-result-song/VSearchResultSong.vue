<template>
    <VSongCover :song-id="result.id" />
    <div class="d-flex flex-column flex-1">
        <router-link :to="pathToCollection">
            <a class="body-large">{{ result.name }}</a>
        </router-link>
        <VArtistListInline :artists="result.artists" />
    </div>
</template>

<script lang="ts" setup>
import { SearchResultSong } from '@/api'
import VArtistListInline from '@/front/components/artist-list-inline'
import VSongCover from '@/front/components/song-cover'
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
