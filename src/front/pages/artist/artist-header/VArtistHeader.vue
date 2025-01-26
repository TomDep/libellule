<template>
    <div class="d-flex gap-6 w-100 align-center">
        <div class="artist-image"></div>
        <p class="display-large">{{ artist?.name }}</p>
    </div>
</template>

<script lang="ts" setup>
import { Artist } from '@/api'

defineProps<{
    artist: Artist | null
}>()
</script>

<style lang="scss" scoped>
.artist-image {
    height: 200px;
    border-radius: 50%;
    background: rgb(var(--mdui-color-surface-container-low));
    box-shadow: var(--mdui-elevation-level4);
    aspect-ratio: 1 / 1;
}
</style>
