<template>
    <div class="cover"></div>
    <div class="d-flex flex-column flex-1">
        <router-link to="/collection">
            <a class="body-large">{{ result.name }}</a>
            {{ result.id }}
        </router-link>

        <div class="d-flex body-medium on-surface-variant-text">
            <router-link v-for="(artist, index) of result.artists" :key="index" to="/collection">
                <span v-if="index > 0" class="mr-1">,</span>
                <a>
                    {{ artist.name }}
                </a>
                {{ artist.id }}
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { SearchResultAlbum } from '@/api'
const props = defineProps<{
    result: SearchResultAlbum
}>()
</script>

<style lang="scss" scoped>
.cover {
    height: 48px;
    border-radius: 8px;
    background-color: rgb(var(--mdui-color-surface-container-low));
    aspect-ratio: 1 / 1;
}
</style>
