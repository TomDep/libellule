<template>
    <div class="d-flex gap-4 w-100">
        <div class="cover"></div>

        <div class="d-flex flex-column gap-2 align-self-end">
            <p class="display-large">{{ album?.name }}</p>
            <router-link :to="`/collection/artist/${album?.artist.id}`">
                <a>{{ album?.artist.name }}</a>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Album } from '@/api'

defineProps<{
    album: Album | null
}>()
</script>

<style lang="scss" scoped>
.cover {
    height: 250px;
    border-radius: 24px;
    background-color: rgb(var(--mdui-color-surface-container-low));
    aspect-ratio: 1 / 1;
}
</style>
