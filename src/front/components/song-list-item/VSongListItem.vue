<template>
    <div class="d-flex w-100 align-center gap-8 px-2">
        <p class="body-medium">{{ index }}</p>
        <div class="d-flex flex-column">
            <p class="body-large">{{ song.title }}</p>
            <VArtistListInline :artists="song.artists" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Song } from '@/api'
import VArtistListInline from '@/front/components/artist-list-inline'
import VSongCover from '@/front/components/song-cover'

defineProps<{
    index: number
    song: Song
}>()
</script>

<style lang="scss" scoped>
.cover {
    height: 48px;
    aspect-ratio: 1 / 1;
}
</style>
