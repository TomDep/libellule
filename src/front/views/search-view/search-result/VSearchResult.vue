<template>
    <VSearchResultBase :result="result">
        <VSearchResultArtist v-if="result.type === 'artist'" :result="result" />
        <VSearchResultAlbum v-else-if="result.type === 'album'" :result="result" />
        <VSearchResultSong v-else :result="result" />
    </VSearchResultBase>
</template>

<script lang="ts" setup>
import { SearchResult } from '@/api'
import VSearchResultAlbum from '@/front/views/search-view/search-result/search-result-album'
import VSearchResultArtist from '@/front/views/search-view/search-result/search-result-artist'
import VSearchResultBase from '@/front/views/search-view/search-result/search-result-base'
import VSearchResultSong from '@/front/views/search-view/search-result/search-result-song'

defineProps<{
    result: SearchResult
}>()
</script>
