<template>
    <div class="artist-portrait"></div>
    <div class="d-flex flex-1">
        <router-link :to="collectionPath">
            <a>{{ result.name }}</a>
            {{ result.id }}
        </router-link>
    </div>
</template>

<script lang="ts" setup>
import { SearchResultArtist } from '@/api'
import VSearchResultBase from '@/front/views/search-view/search-result/search-result-base'
import { computed } from 'vue'

const props = defineProps<{
    result: SearchResultArtist
}>()

const collectionPath = computed(() => {
    return `/collection/artist/${props.result.id}`
})
</script>

<style lang="scss" scoped>
.artist-portrait {
    height: 48px;
    border-radius: 50%;
    background-color: rgb(var(--mdui-color-surface-container-low));
    aspect-ratio: 1 / 1;
}
</style>
