<template>
    <VSongCover />
    <div class="d-flex flex-column flex-1">
        <router-link to="/collection">
            <a class="body-large">{{ result.name }}</a>
            {{ result.id }}
        </router-link>

        <VArtistListInline :artists="result.artists" />
    </div>
</template>

<script lang="ts" setup>
import { SearchResultAlbum } from '@/api'
import VArtistListInline from '@/front/components/artist-list-inline'
import VSongCover from '@/front/components/song-cover'
const props = defineProps<{
    result: SearchResultAlbum
}>()
</script>

<style lang="scss" scoped></style>
