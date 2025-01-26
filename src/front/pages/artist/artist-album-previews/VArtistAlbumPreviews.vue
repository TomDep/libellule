<template>
    <div class="d-flex flex-column py-2">
        <VAlbumPreview
            v-for="(preview, index) of albumPreviews"
            :key="index"
            :album-preview="preview"
        />
    </div>
</template>

<script lang="ts" setup>
import VAlbumPreview from '@/front/pages/artist/artist-album-preview'
import { defineProps } from 'vue'
import { AlbumPreview } from '@/api'

defineProps<{
    albumPreviews: AlbumPreview[] | null
}>()
</script>

<style lang="scss" scoped></style>
